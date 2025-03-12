'use client';

import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { useADHDStore } from '../store/adhd-store';

export default function ActivityTracker() {
  const { currentEntry, updateCurrentEntry } = useADHDStore();

  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCurrentEntry({ activity: e.target.value });
  };

  const handleEffectivenessChange = (value: number[]) => {
    updateCurrentEntry({ effectiveness: value[0] });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCurrentEntry({ notes: e.target.value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Activity Tracking</h2>
      
      <div className="space-y-2">
        <label htmlFor="activity" className="block text-sm font-medium text-gray-700">
          What are you doing right now?
        </label>
        <input
          type="text"
          id="activity"
          value={currentEntry.activity || ''}
          onChange={handleActivityChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="e.g., Working, Reading, Studying..."
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          How effective are you at this activity?
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-full">
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              defaultValue={[currentEntry.effectiveness || 5]}
              max={10}
              min={1}
              step={1}
              onValueChange={handleEffectivenessChange}
            >
              <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                <Slider.Range className="absolute bg-gray-900 rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-5 h-5 bg-white border-2 border-gray-900 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
                aria-label="Effectiveness"
              />
            </Slider.Root>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>Not Effective</span>
              <span>Very Effective</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {currentEntry.effectiveness || 5}/10
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Additional Notes
        </label>
        <textarea
          id="notes"
          value={currentEntry.notes || ''}
          onChange={handleNotesChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Any observations about your current state..."
        />
      </div>
    </div>
  );
} 