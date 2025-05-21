import React from 'react';

export default function FeatureInformation() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex items-center mb-3">
          <span className="material-icons text-[#4285F4] mr-3">translate</span>
          <h3 className="font-google-sans font-medium">Accurate Translation</h3>
        </div>
        <p className="text-gray-600 text-sm">Powered by OpenAI's advanced language models for precise translations across multiple languages.</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex items-center mb-3">
          <span className="material-icons text-[#4285F4] mr-3">offline_bolt</span>
          <h3 className="font-google-sans font-medium">Real-Time Processing</h3>
        </div>
        <p className="text-gray-600 text-sm">Instant voice recognition and translation with minimal latency for seamless conversations.</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex items-center mb-3">
          <span className="material-icons text-[#4285F4] mr-3">record_voice_over</span>
          <h3 className="font-google-sans font-medium">Natural Speech</h3>
        </div>
        <p className="text-gray-600 text-sm">High-quality text-to-speech conversion that sounds natural and clear in English.</p>
      </div>
    </div>
  );
}
