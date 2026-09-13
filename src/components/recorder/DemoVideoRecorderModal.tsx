import React, { useState, useRef, useEffect } from 'react';
import { Video, Play, Pause, Square, Download, RefreshCw, X, AlertCircle, CheckCircle } from 'lucide-react';

interface DemoVideoRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoVideoRecorderModal: React.FC<DemoVideoRecorderModalProps> = ({ isOpen, onClose }) => {
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'paused' | 'stopped'>('idle');
  const [seconds, setSeconds] = useState(0);
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      cleanup();
    }
  }, [isOpen]);

  const cleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setRecordingState('idle');
    setSeconds(0);
    setPermissionError(null);
  };

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    setPermissionError(null);
    chunksRef.current = [];

    try {
      // Try to obtain screen capture via getDisplayMedia
      let stream: MediaStream;
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: 30 },
          audio: true,
        });
      } else {
        // Fallback to user media if getDisplayMedia is not present
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      }

      streamRef.current = stream;

      // When user clicks the browser's native "Stop Sharing"
      stream.getVideoTracks()[0].onended = () => {
        stopRecording();
      };

      const options = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? { mimeType: 'video/webm;codecs=vp9' }
        : MediaRecorder.isTypeSupported('video/webm')
        ? { mimeType: 'video/webm' }
        : undefined;

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoBlobUrl(url);
        setRecordingState('stopped');
        if (timerRef.current) clearInterval(timerRef.current);
      };

      mediaRecorder.start(250);
      setRecordingState('recording');
      setSeconds(0);

      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Media recording error:', err);
      setPermissionError(
        'Screen recording permission was not granted. You can continue using the application without recording.'
      );
      setRecordingState('idle');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setRecordingState('paused');
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setRecordingState('recording');
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const downloadRecording = () => {
    if (!videoBlobUrl) return;
    const a = document.createElement('a');
    a.href = videoBlobUrl;
    a.download = `AdivaSetu_Demo_Walkthrough_${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#0D3829] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-rose-600/30 text-rose-300 rounded-lg border border-rose-500/40">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide">Demo Walkthrough Recorder</h3>
              <p className="text-[11px] text-emerald-200 font-medium">In-Browser Screen & Audio Capture</p>
            </div>
          </div>
          <button
            onClick={() => {
              cleanup();
              onClose();
            }}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {permissionError && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{permissionError}</p>
            </div>
          )}

          {/* Idle state */}
          {recordingState === 'idle' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 shadow-inner">
                <Video className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">Record Live Hackathon Walkthrough</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Capture your browser window to record applicant submission, AI verification, and officer scrutiny steps.
                </p>
              </div>
              <button
                onClick={startRecording}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all active:scale-95"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                <span>Start Recording</span>
              </button>
            </div>
          )}

          {/* Active Recording or Paused */}
          {(recordingState === 'recording' || recordingState === 'paused') && (
            <div className="space-y-6 text-center py-2">
              <div className="flex items-center justify-center space-x-3">
                <span
                  className={`w-3.5 h-3.5 rounded-full ${
                    recordingState === 'recording' ? 'bg-rose-600 animate-pulse' : 'bg-amber-500'
                  }`}
                ></span>
                <span className="text-2xl font-mono font-bold text-slate-800">
                  {formatDuration(seconds)}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">
                  {recordingState === 'recording' ? 'REC' : 'PAUSED'}
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Recording is active. You may navigate tabs or perform operations on AdivaSetu.
              </p>

              <div className="flex items-center justify-center space-x-3 pt-2">
                {recordingState === 'recording' ? (
                  <button
                    onClick={pauseRecording}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    onClick={resumeRecording}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Resume</span>
                  </button>
                )}

                <button
                  onClick={stopRecording}
                  className="flex items-center space-x-1.5 px-5 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Recording</span>
                </button>
              </div>
            </div>
          )}

          {/* Stopped & Ready for Preview & Download */}
          {recordingState === 'stopped' && videoBlobUrl && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Demo Recording Ready ({formatDuration(seconds)})</span>
              </div>

              {/* Video Player */}
              <div className="rounded-xl overflow-hidden bg-black aspect-video border border-slate-300 shadow-md">
                <video
                  ref={videoPreviewRef}
                  src={videoBlobUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={startRecording}
                  className="flex items-center space-x-1 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Record Again</span>
                </button>

                <button
                  onClick={downloadRecording}
                  className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white shadow-md transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Recording (.webm)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
