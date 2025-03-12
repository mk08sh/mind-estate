'use client';

import React, { useState, useEffect } from 'react';
import MentalStateSelector from './components/MentalStateSelector';
import EnergyLevel from './components/EnergyLevel';
import TimePerceptionCanvas from './components/TimePerceptionCanvas';
import ActivityTracker from './components/ActivityTracker';
import HistoryView from './components/HistoryView';
import { useADHDStore, Entry } from './store/adhd-store';
import { Toaster, toast } from 'react-hot-toast';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'track' | 'history'>('track');
  const [isHydrated, setIsHydrated] = useState(false);
  const { currentEntry, addEntry, resetCurrentEntry } = useADHDStore();

  // Handle hydration
  useEffect(() => {
    const hydrateStore = async () => {
      try {
        // @ts-ignore - Hydrate the store
        await useADHDStore.persist.rehydrate();
        setIsHydrated(true);
      } catch (error) {
        console.error('Failed to hydrate store:', error);
        // Still set hydrated to true to allow the app to function
        setIsHydrated(true);
      }
    };

    hydrateStore();
  }, []);

  const handleSave = () => {
    if (!isHydrated) {
      toast.error('Please wait for the app to load');
      return;
    }

    // Validate that we have at least some data to save
    if (!currentEntry.mentalState && !currentEntry.activity && !currentEntry.timePerception) {
      toast.error('Please add some data before saving');
      return;
    }
    
    try {
      // Save the entry with whatever fields are filled out
      addEntry(currentEntry);
      toast.success('Entry saved successfully!', {
        duration: 2000,
        position: 'bottom-center',
        style: {
          background: '#1a1a1a',
          color: '#fff',
          borderRadius: '10px',
        },
      });
    } catch (error) {
      console.error('Failed to save entry:', error);
      toast.error('Failed to save entry');
    }
  };

  // Show a loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we load your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            borderRadius: '10px',
          },
        }}
      />
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Mind Mirror</h1>
          <p className="text-xl text-gray-600">Track your mental states, energy levels, and time perception</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 px-8 py-4 text-lg font-medium transition-colors duration-200 ${
                activeTab === 'track'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('track')}
            >
              Track Current State
            </button>
            <button
              className={`flex-1 px-8 py-4 text-lg font-medium transition-colors duration-200 ${
                activeTab === 'history'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('history')}
            >
              View History
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'track' ? (
              <div className="space-y-12">
                <TimePerceptionCanvas />
                <MentalStateSelector />
                <EnergyLevel />
                <ActivityTracker />
                <div className="flex justify-end pt-6">
                  <button
                    onClick={handleSave}
                    className="px-8 py-3 text-lg font-medium rounded-xl bg-blue-600 text-white 
                             hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Save Entry
                  </button>
                </div>
              </div>
            ) : (
              <HistoryView />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 