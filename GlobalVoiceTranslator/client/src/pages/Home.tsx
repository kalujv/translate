import React from 'react';
import AppHeader from '@/components/AppHeader';
import TranslationPanel from '@/components/TranslationPanel';
import FeatureInformation from '@/components/FeatureInformation';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
        <TranslationPanel />
        <FeatureInformation />
      </main>
      
      <Footer />
    </div>
  );
}
