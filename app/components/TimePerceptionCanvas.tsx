'use client';

import React, { useRef, useState, useEffect } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { useADHDStore } from '../store/adhd-store';

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
    title: 'Drawing Test',
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
  const { updateCurrentEntry } = useADHDStore();

  useEffect(() => {
    if (currentTest.type === 'drawing') {
      setPrompt(DRAWING_PROMPTS[Math.floor(Math.random() * DRAWING_PROMPTS.length)]);
    }
  }, [currentTest]);

  const handleStart = () => {
    setIsActive(true);
    setStartTime(Date.now());
    setResults(null);
    setTapCount(0);
    if (canvasRef.current && currentTest.type === 'drawing') {
      canvasRef.current.clear();
    }
  };

  const handleStop = () => {
    if (!startTime) return;
    
    const actualTime = (Date.now() - startTime) / 1000;
    const difference = Math.abs(actualTime - currentTest.targetSeconds);
    const accuracy = Math.max(0, 100 - (difference / currentTest.targetSeconds * 100));
    
    setResults({
      actualTime,
      targetTime: currentTest.targetSeconds,
      difference,
      accuracy,
    });

    const drawing = currentTest.type === 'drawing' ? canvasRef.current?.getSaveData() : null;
    
    updateCurrentEntry({
      drawing,
      timePerception: {
        actual: actualTime,
        perceived: currentTest.targetSeconds,
        testType: currentTest.type,
        accuracy,
      }
    });
    
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{currentTest.title}</h2>
        <p className="mt-2 text-gray-600">{currentTest.description}</p>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-100 p-6 space-y-6">
        {!isActive && !results && (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-4">{currentTest.instructions}</p>
            <p className="text-sm text-gray-500">Target time: {currentTest.targetSeconds} seconds</p>
          </div>
        )}

        {currentTest.type === 'drawing' && (
          <div className="space-y-4">
            {isActive && <p className="text-lg text-gray-700 text-center">{prompt}</p>}
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
          </div>
        )}

        {currentTest.type === 'tapping' && isActive && (
          <button
            onClick={handleTap}
            className="w-full py-12 rounded-xl bg-blue-50 hover:bg-blue-100 
                     transition-colors duration-200 text-blue-600 text-xl font-medium"
          >
            Tap Here ({tapCount} taps)
          </button>
        )}

        {results && (
          <div className="space-y-4 bg-gray-50 rounded-lg p-4">
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
          </div>
        )}

        <div className="flex justify-center space-x-4">
          {!isActive && (
            <button
              onClick={handleNextTest}
              className="px-6 py-2 rounded-lg border-2 border-gray-200 
                       hover:border-gray-300 text-gray-600 hover:text-gray-900
                       transition-all duration-200"
            >
              Try Different Test
            </button>
          )}
          <button
            onClick={isActive ? handleStop : handleStart}
            className={`px-6 py-2 rounded-lg font-medium ${
              isActive
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } transition-colors duration-200`}
          >
            {isActive ? "I Think Time's Up" : "Start Test"}
          </button>
        </div>
      </div>
    </div>
  );
} 