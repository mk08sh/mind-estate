'use client';

import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { useADHDStore } from '../store/adhd-store';

export default function EnergyLevel() {
  const { currentEntry, updateCurrentEntry } = useADHDStore();
  const energy = currentEntry.mentalState?.energy ?? 50;
  
  const handleEnergyChange = (value: number[]) => {
    updateCurrentEntry({
      mentalState: {
        ...currentEntry.mentalState,
        energy: value[0]
      }
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Energy Level</h2>
      <div className="flex items-center space-x-4">
        <div className="w-full">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            defaultValue={[energy]}
            max={100}
            min={0}
            step={1}
            onValueChange={handleEnergyChange}
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
              <Slider.Range className="absolute bg-green-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-white border-2 border-green-500 rounded-full hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Energy Level"
            />
          </Slider.Root>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
        <div className="text-2xl font-bold text-green-500">
          {energy}%
        </div>
      </div>
    </div>
  );
} 