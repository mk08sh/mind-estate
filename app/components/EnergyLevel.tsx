'use client';

import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { useADHDStore } from '../store/adhd-store';

export default function EnergyLevel() {
  const { currentEntry, updateCurrentEntry } = useADHDStore();
  
  const handleEnergyChange = (value: number[]) => {
    updateCurrentEntry({ energyLevel: value[0] });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Energy Level</h2>
      <div className="flex items-center space-x-4">
        <div className="w-full">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            defaultValue={[currentEntry.energyLevel || 5]}
            max={10}
            min={1}
            step={1}
            onValueChange={handleEnergyChange}
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
              <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-white border-2 border-blue-500 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Energy Level"
            />
          </Slider.Root>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
        <div className="text-2xl font-bold text-blue-500">
          {currentEntry.energyLevel || 5}/10
        </div>
      </div>
    </div>
  );
} 