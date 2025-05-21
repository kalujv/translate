import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function AppHeader() {
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="material-icons text-[#4285F4] text-2xl">translate</span>
          <h1 className="font-google-sans text-xl md:text-2xl font-medium">Voice Translator</h1>
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a 
                  href="#" 
                  className="text-[#4285F4] font-google-sans text-sm md:text-base hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open('https://github.com/openai/openai-node', '_blank');
                  }}
                >
                  Help
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Learn more about this application</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
