import React from 'react';

interface AudioControlsProps {
  isRecording: boolean;
  status: string;
  onToggleRecording: () => void;
}

export default function AudioControls({ isRecording, status, onToggleRecording }: AudioControlsProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-center mb-4">
        <button 
          className={`
            ${isRecording ? 'bg-[#EA4335] recording-pulse' : 'bg-[#4285F4] hover:bg-[#4285F4]/90'}
            text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4] 
            transition-all duration-200
          `}
          onClick={onToggleRecording}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          <span className="material-icons text-3xl">
            {isRecording ? 'stop' : 'mic'}
          </span>
        </button>
      </div>
      <div className="text-center text-sm text-gray-500 font-roboto">
        <p>{status}</p>
      </div>
    </div>
  );
}
