'use client';

import React, { useRef, useState, useEffect } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { useADHDStore } from '../store/adhd-store';
import { toast } from 'react-hot-toast';

type TestType = 'drawing' | 'counting' | 'meditation' | 'tapping';

interface TimeTest {
  type: TestType;
  title: string;
  description: string;
  targetSeconds: number;
  instructions: string;
}

const TIME_TESTS: TimeTest[] = [
  {
    type: 'drawing',
    title: 'Time Blindness Test',
    description: 'Draw until you think the time is up',
    targetSeconds: 30,
    instructions: 'Draw freely until you think 30 seconds have passed',
  },
  {
    type: 'counting',
    title: 'Counting Test',
    description: 'Count numbers in your head',
    targetSeconds: 20,
    instructions: 'Close your eyes and count numbers in your head until you think 20 seconds have passed',
  },
  {
    type: 'meditation',
    title: 'Meditation Test',
    description: 'Sit still with eyes closed',
    targetSeconds: 45,
    instructions: 'Close your eyes and sit still until you think 45 seconds have passed',
  },
  {
    type: 'tapping',
    title: 'Rhythm Test',
    description: 'Tap a steady rhythm',
    targetSeconds: 15,
    instructions: 'Tap the button at a steady pace until you think 15 seconds have passed',
  },
];

const DRAWING_PROMPTS = [
  "Draw how your mind feels right now",
  "Sketch your current thought pattern",
  "Draw your energy flow",
  "Illustrate your focus level",
  "Draw your mental landscape"
];

export default function TimePerceptionCanvas() {
  const canvasRef = useRef<any>(null);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [results, setResults] = useState<{
    actualTime: number;
    targetTime: number;
    difference: number;
    accuracy: number;
  } | null>(null);
  const [prompt, setPrompt] = useState('');
  const [currentTest, setCurrentTest] = useState<TimeTest>(TIME_TESTS[0]);
  const [tapCount, setTapCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const { updateCurrentEntry } = useADHDStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (currentTest.type === 'drawing' && isMounted) {
      setPrompt(DRAWING_PROMPTS[Math.floor(Math.random() * DRAWING_PROMPTS.length)]);
    }
  }, [currentTest, isMounted]);

  const handleStart = () => {
    if (!isMounted) return;
    setIsActive(true);
    setStartTime(Date.now());
    setResults(null);
    setTapCount(0);
    if (canvasRef.current && currentTest.type === 'drawing') {
      canvasRef.current.clear();
    }
  };

  const handleStop = () => {
    if (!startTime || !isMounted) return;
    
    const actualTime = (Date.now() - startTime) / 1000;
    const difference = Math.abs(actualTime - currentTest.targetSeconds);
    const accuracy = Math.max(0, 100 - (difference / currentTest.targetSeconds * 100));
    
    setResults({
      actualTime,
      targetTime: currentTest.targetSeconds,
      difference,
      accuracy,
    });

    let drawing = null;
    if (currentTest.type === 'drawing' && canvasRef.current) {
      try {
        drawing = canvasRef.current.getSaveData();
        const drawingData = JSON.parse(drawing);
        if (drawingData.lines && drawingData.lines.length > 0) {
          console.log('Drawing saved successfully');
        } else {
          drawing = null;
        }
      } catch (error) {
        console.error('Failed to save drawing:', error);
        toast.error('Failed to save drawing');
        drawing = null;
      }
    }
    
    const entry = {
      drawing,
      timePerception: {
        actual: actualTime,
        perceived: currentTest.targetSeconds,
        testType: currentTest.type,
        accuracy,
      }
    };

    try {
      updateCurrentEntry(entry);
    } catch (error) {
      console.error('Failed to update entry:', error);
      toast.error('Failed to save test results');
    }
    
    setIsActive(false);
    setStartTime(null);
  };

  const handleNextTest = () => {
    const currentIndex = TIME_TESTS.findIndex(test => test.type === currentTest.type);
    const nextIndex = (currentIndex + 1) % TIME_TESTS.length;
    setCurrentTest(TIME_TESTS[nextIndex]);
    setResults(null);
  };

  const handleTap = () => {
    if (isActive && currentTest.type === 'tapping') {
      setTapCount(prev => prev + 1);
    }
  };

  // Don't render anything during SSR
  if (typeof window === 'undefined' || !isMounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Time Perception Test</h2>
        <p className="mt-2 text-gray-600">Test your time perception based on the state of mind you're in</p>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-100 p-6 space-y-6">
        {!isActive && !results && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{currentTest.title}</h3>
              <p className="text-lg text-gray-700 mb-2">{currentTest.instructions}</p>
              <p className="text-sm text-gray-500">Target time: {currentTest.targetSeconds} seconds</p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleNextTest}
                className="px-6 py-2 rounded-lg border-2 border-gray-200 
                         hover:border-gray-300 text-gray-600 hover:text-gray-900
                         transition-all duration-200"
              >
                Try Different Test
              </button>
              <button
                onClick={handleStart}
                className="px-6 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 
                         text-white transition-colors duration-200"
              >
                Start Test
              </button>
            </div>
          </div>
        )}

        {isActive && (
          <div className="space-y-4">
            {currentTest.type === 'drawing' && (
              <>
                <p className="text-lg text-gray-700 text-center">{prompt}</p>
                <CanvasDraw
                  ref={canvasRef}
                  brushRadius={2}
                  lazyRadius={0}
                  brushColor="#000000"
                  canvasWidth={400}
                  canvasHeight={300}
                  disabled={!isActive}
                  hideGrid
                  className="mx-auto border rounded"
                />
              </>
            )}

            {currentTest.type === 'tapping' && (
              <button
                onClick={handleTap}
                className="w-full py-12 rounded-xl bg-blue-50 hover:bg-blue-100 
                         transition-colors duration-200 text-blue-600 text-xl font-medium"
              >
                Tap Here ({tapCount} taps)
              </button>
            )}

            {currentTest.type !== 'drawing' && currentTest.type !== 'tapping' && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-700 mb-4">{currentTest.instructions}</p>
                <p className="text-gray-500">Close your eyes and focus on your internal clock</p>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleStop}
                className="px-8 py-3 rounded-lg font-medium bg-green-500 hover:bg-green-600 
                         text-white transition-colors duration-200"
              >
                I Think Time's Up
              </button>
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Target Time</p>
                <p className="text-lg font-medium">{results.targetTime}s</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Your Time</p>
                <p className="text-lg font-medium">{results.actualTime.toFixed(1)}s</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Difference</p>
                <p className="text-lg font-medium">{results.difference.toFixed(1)}s</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Accuracy</p>
                <p className="text-lg font-medium">{results.accuracy.toFixed(1)}%</p>
              </div>
            </div>
            {results.accuracy >= 90 ? (
              <p className="text-green-600">Excellent time perception!</p>
            ) : results.accuracy >= 70 ? (
              <p className="text-blue-600">Good time perception, but room for improvement.</p>
            ) : (
              <p className="text-orange-600">Your time perception was quite different from actual time.</p>
            )}
            
            <div className="flex justify-center pt-4">
              <button
                onClick={handleNextTest}
                className="px-6 py-2 rounded-lg border-2 border-gray-200 
                         hover:border-gray-300 text-gray-600 hover:text-gray-900
                         transition-all duration-200"
              >
                Try Different Test
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 