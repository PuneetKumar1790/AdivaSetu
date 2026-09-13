import { browserDb } from '../db/browserDb';
import { eventBus } from '../events/eventBus';

export type ApiMode = 'mock' | 'real';
export type LatencyProfile = 'realistic' | 'fast' | 'instant';
export type SimulatedErrorType = 'none' | 'network_error' | 'gateway_timeout' | 'ai_busy';

export interface ApiConfigState {
  apiMode: ApiMode;
  latencyProfile: LatencyProfile;
  simulatedError: SimulatedErrorType;
}

/**
 * Standard API error class mimicking Ministry National Data Gateway responses
 */
export class MinistryGatewayError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(message: string, statusCode: number = 500, errorCode: string = 'GATEWAY_ERROR') {
    super(message);
    this.name = 'MinistryGatewayError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

export const apiConfig = {
  getMode(): ApiMode {
    return browserDb.getSystemSettings().apiMode;
  },

  setMode(mode: ApiMode): void {
    browserDb.updateSystemSettings({ apiMode: mode });
  },

  getLatencyProfile(): LatencyProfile {
    return browserDb.getSystemSettings().latencyProfile;
  },

  setLatencyProfile(profile: LatencyProfile): void {
    browserDb.updateSystemSettings({ latencyProfile: profile });
  },

  getSimulatedError(): SimulatedErrorType {
    return browserDb.getSystemSettings().simulatedError;
  },

  setSimulatedError(error: SimulatedErrorType): void {
    browserDb.updateSystemSettings({ simulatedError: error });
    eventBus.publish('system:error_simulated', error);
  },

  clearSimulatedError(): void {
    this.setSimulatedError('none');
  },

  /**
   * Calculate realistic delay based on operation category and current latency profile
   */
  async simulateLatency(
    category: 'dashboard' | 'applications' | 'singleApplication' | 'documentUpload' | 'aiVerification' | 'analytics' | 'mutation',
    label?: string
  ): Promise<void> {
    const profile = this.getLatencyProfile();
    if (profile === 'instant') return;

    let baseMs = 600;
    switch (category) {
      case 'dashboard':
        baseMs = Math.floor(650 + Math.random() * 300); // 650 - 950 ms
        break;
      case 'applications':
        baseMs = Math.floor(700 + Math.random() * 400); // 700 - 1100 ms
        break;
      case 'singleApplication':
        baseMs = Math.floor(450 + Math.random() * 250); // 450 - 700 ms
        break;
      case 'documentUpload':
        baseMs = Math.floor(1000 + Math.random() * 500); // 1000 - 1500 ms
        break;
      case 'aiVerification':
        baseMs = Math.floor(2200 + Math.random() * 800); // 2200 - 3000 ms
        break;
      case 'analytics':
        baseMs = Math.floor(800 + Math.random() * 500); // 800 - 1300 ms
        break;
      case 'mutation':
        baseMs = Math.floor(500 + Math.random() * 300); // 500 - 800 ms
        break;
    }

    if (profile === 'fast') {
      baseMs = Math.floor(baseMs * 0.3);
    }

    const activityLabel = label || `Synchronizing with Ministry Gateway (${category})...`;
    eventBus.publish('api:request_start', activityLabel);

    try {
      await new Promise((resolve) => setTimeout(resolve, baseMs));
    } finally {
      eventBus.publish('api:request_end', activityLabel);
    }

    // Check if error simulation is triggered
    this.checkSimulatedError();
  },

  checkSimulatedError(): void {
    const error = this.getSimulatedError();
    if (error === 'network_error') {
      throw new MinistryGatewayError(
        'Unable to reach Ministry Gateway. Network connection failed.',
        504,
        'NETWORK_TIMEOUT'
      );
    } else if (error === 'gateway_timeout') {
      throw new MinistryGatewayError(
        'Ministry Central Registry is currently unavailable (503 Service Temporarily Unavailable).',
        503,
        'GATEWAY_503'
      );
    } else if (error === 'ai_busy') {
      throw new MinistryGatewayError(
        'AI Scrutiny Engine cluster is operating under heavy surge. Request queued.',
        429,
        'RATE_LIMITED'
      );
    }
  },
};
