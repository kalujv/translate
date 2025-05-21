import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Voice Translator. Powered by OpenAI.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-[#4285F4]">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-[#4285F4]">Terms of Service</a>
            <a href="#" className="text-sm text-gray-500 hover:text-[#4285F4]">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
