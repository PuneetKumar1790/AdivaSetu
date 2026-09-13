import { useEffect, useState } from 'react';

export type EventType =
  | 'application:created'
  | 'application:status_changed'
  | 'application:deficiency_resolved'
  | 'document:uploaded'
  | 'verification:stage'
  | 'verification:completed'
  | 'notification:created'
  | 'system:sync_state'
  | 'system:error_simulated'
  | 'api:request_start'
  | 'api:request_end';

export interface AppEvent<T = any> {
  type: EventType;
  payload: T;
  timestamp: string;
}

type Listener<T = any> = (event: AppEvent<T>) => void;

class EventBus {
  private listeners: Map<EventType, Set<Listener>> = new Map();
  private broadcastChannel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('adivasetu_events_channel');
        this.broadcastChannel.onmessage = (ev) => {
          if (ev.data && ev.data.type) {
            this.dispatchLocal(ev.data.type, ev.data.payload, false);
          }
        };
      } catch {
        // Fallback for environments without BroadcastChannel
      }
    }
  }

  subscribe<T = any>(type: EventType, listener: Listener<T>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener as Listener);

    return () => {
      this.listeners.get(type)?.delete(listener as Listener);
    };
  }

  publish<T = any>(type: EventType, payload: T): void {
    this.dispatchLocal(type, payload, true);
  }

  private dispatchLocal<T = any>(type: EventType, payload: T, broadcast: boolean): void {
    const event: AppEvent<T> = {
      type,
      payload,
      timestamp: new Date().toISOString(),
    };

    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.forEach((fn) => {
        try {
          fn(event);
        } catch (err) {
          console.error(`[EventBus] Error in listener for ${type}:`, err);
        }
      });
    }

    if (broadcast && this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(event);
      } catch {
        // Ignore broadcast failure
      }
    }
  }
}

export const eventBus = new EventBus();

/**
 * React Hook to subscribe to real-time events seamlessly
 */
export function useEventSubscription<T = any>(
  eventType: EventType,
  callback: (event: AppEvent<T>) => void
): void {
  useEffect(() => {
    const unsubscribe = eventBus.subscribe<T>(eventType, callback);
    return () => {
      unsubscribe();
    };
  }, [eventType, callback]);
}

/**
 * React Hook to track active API in-flight requests (for top progress / sync indicator)
 */
export function useApiActivity(): { isRequestActive: boolean; activeLabel: string } {
  const [activeRequests, setActiveRequests] = useState<string[]>([]);

  useEffect(() => {
    const un1 = eventBus.subscribe<string>('api:request_start', (e) => {
      setActiveRequests((prev) => [...prev, e.payload]);
    });
    const un2 = eventBus.subscribe<string>('api:request_end', (e) => {
      setActiveRequests((prev) => prev.filter((label) => label !== e.payload));
    });

    return () => {
      un1();
      un2();
    };
  }, []);

  return {
    isRequestActive: activeRequests.length > 0,
    activeLabel: activeRequests[activeRequests.length - 1] || 'Processing request...',
  };
}
