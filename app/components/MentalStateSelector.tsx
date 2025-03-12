'use client';

import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { useADHDStore, MentalStateSpectrum } from '../store/adhd-store';
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  BoltIcon,
  CloudIcon,
  SparklesIcon,
  NoSymbolIcon,
  SunIcon,
  CloudIcon as StormIcon,
} from '@heroicons/react/24/outline';

interface SpectrumSliderProps {
  value: number;
  onChange: (value: number) => void;
  leftLabel: string;
  rightLabel: string;
  LeftIcon: React.ElementType;
  RightIcon: React.ElementType;
  colorClasses: {
    range: string;
    thumb: string;
  };
}

const SPECTRUM_COLORS = {
  focus: {
    range: 'bg-blue-500',
    thumb: 'border-blue-500 hover:bg-blue-50 focus:ring-blue-500',
  },
  energy: {
    range: 'bg-green-500',
    thumb: 'border-green-500 hover:bg-green-50 focus:ring-green-500',
  },
  mood: {
    range: 'bg-purple-500',
    thumb: 'border-purple-500 hover:bg-purple-50 focus:ring-purple-500',
  },
  curiosity: {
    range: 'bg-orange-500',
    thumb: 'border-orange-500 hover:bg-orange-50 focus:ring-orange-500',
  },
};

function SpectrumSlider({
  value,
  onChange,
  leftLabel,
  rightLabel,
  LeftIcon,
  RightIcon,
  colorClasses,
}: SpectrumSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <LeftIcon className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">{leftLabel}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">{rightLabel}</span>
          <RightIcon className="w-5 h-5 text-gray-600" />
        </div>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        max={100}
        step={1}
        onValueChange={(values) => onChange(values[0])}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
          <Slider.Range className={`absolute ${colorClasses.range} rounded-full h-full`} />
        </Slider.Track>
        <Slider.Thumb
          className={`block w-5 h-5 bg-white border-2 rounded-full 
                     focus:outline-none focus:ring-2 transition-colors
                     ${colorClasses.thumb}`}
        />
      </Slider.Root>
      <div className="flex justify-center">
        <span className="text-sm font-medium text-gray-500">{value}%</span>
      </div>
    </div>
  );
}

export default function MentalStateSelector() {
  const { currentEntry, updateCurrentEntry } = useADHDStore();
  const mentalState = currentEntry.mentalState || {
    focus: 50,
    energy: 50,
    mood: 50,
    curiosity: 50,
  };

  const handleSpectrumChange = (key: keyof MentalStateSpectrum, value: number) => {
    updateCurrentEntry({
      mentalState: {
        ...mentalState,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Mental State Spectrum</h2>
        <p className="mt-2 text-gray-600">
          Adjust each slider to reflect where you are on these spectrums
        </p>
      </div>

      <div className="grid gap-8 bg-white rounded-xl border-2 border-gray-100 p-6">
        <SpectrumSlider
          value={mentalState.focus}
          onChange={(value) => handleSpectrumChange('focus', value)}
          leftLabel="Scattered"
          rightLabel="Hyperfocused"
          LeftIcon={CloudIcon}
          RightIcon={ArrowsPointingInIcon}
          colorClasses={SPECTRUM_COLORS.focus}
        />

        <SpectrumSlider
          value={mentalState.energy}
          onChange={(value) => handleSpectrumChange('energy', value)}
          leftLabel="Exhausted"
          rightLabel="Hyperactive"
          LeftIcon={NoSymbolIcon}
          RightIcon={BoltIcon}
          colorClasses={SPECTRUM_COLORS.energy}
        />

        <SpectrumSlider
          value={mentalState.mood}
          onChange={(value) => handleSpectrumChange('mood', value)}
          leftLabel="Overwhelmed"
          rightLabel="Calm"
          LeftIcon={StormIcon}
          RightIcon={SunIcon}
          colorClasses={SPECTRUM_COLORS.mood}
        />

        <SpectrumSlider
          value={mentalState.curiosity}
          onChange={(value) => handleSpectrumChange('curiosity', value)}
          leftLabel="Disinterested"
          rightLabel="Extremely Curious"
          LeftIcon={ArrowsPointingOutIcon}
          RightIcon={SparklesIcon}
          colorClasses={SPECTRUM_COLORS.curiosity}
        />
      </div>
    </div>
  );
} 