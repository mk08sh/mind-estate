'use client';

import React from 'react';
import { format } from 'date-fns';
import { useADHDStore, Entry, TimeTestType, MentalStateSpectrum } from '../store/adhd-store';

const TEST_TYPE_LABELS: Record<TimeTestType, string> = {
  drawing: 'Drawing Test',
  counting: 'Counting Test',
  meditation: 'Meditation Test',
  tapping: 'Rhythm Test',
};

const STATE_COLORS = {
  focus: 'bg-blue-500',
  energy: 'bg-green-500',
  mood: 'bg-purple-500',
  curiosity: 'bg-orange-500',
};

interface StateBarProps {
  label: string;
  value: number;
  colorClass: string;
}

function StateBar({ label, value, colorClass }: StateBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} rounded-full transition-all duration-200`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function EntryCard({ entry }: { entry: Entry }) {
  const timePerception = entry.timePerception;
  const mentalState = entry.mentalState;

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'bg-green-500';
    if (accuracy >= 70) return 'bg-blue-500';
    return 'bg-orange-500';
  };

  return (
    <div className="border rounded-lg p-6 space-y-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-xl text-gray-900">{entry.activity}</h3>
          <p className="text-sm text-gray-500">
            {format(new Date(entry.timestamp), 'MMM d, yyyy h:mm a')}
          </p>
        </div>
        <div className="text-right">
          <div className="font-medium text-gray-700">Effectiveness</div>
          <div className="text-blue-600 font-medium">{entry.effectiveness}/10</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h4 className="font-medium text-gray-900 mb-3">Mental State</h4>
        <div className="space-y-3">
          <StateBar label="Focus" value={mentalState.focus} colorClass={STATE_COLORS.focus} />
          <StateBar label="Energy" value={mentalState.energy} colorClass={STATE_COLORS.energy} />
          <StateBar label="Mood" value={mentalState.mood} colorClass={STATE_COLORS.mood} />
          <StateBar label="Curiosity" value={mentalState.curiosity} colorClass={STATE_COLORS.curiosity} />
        </div>
      </div>

      {timePerception && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Time Perception Test</h4>
            <span className="text-sm text-gray-600">{TEST_TYPE_LABELS[timePerception.testType]}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Target Time</p>
              <p className="font-medium text-gray-900">{timePerception.perceived}s</p>
            </div>
            <div>
              <p className="text-gray-600">Actual Time</p>
              <p className="font-medium text-gray-900">{timePerception.actual.toFixed(1)}s</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-200 ${getAccuracyColor(timePerception.accuracy)}`}
                style={{ width: `${timePerception.accuracy}%` }}
              />
            </div>
            <span className="font-medium text-sm">{timePerception.accuracy.toFixed(0)}%</span>
          </div>
        </div>
      )}

      {entry.notes && (
        <div>
          <div className="text-sm text-gray-600 mb-1">Notes</div>
          <p className="text-gray-800">{entry.notes}</p>
        </div>
      )}

      {entry.drawing && (
        <div>
          <div className="text-sm text-gray-600 mb-2">Drawing</div>
          <img
            src={entry.drawing}
            alt="Mind state drawing"
            className="border rounded-lg w-full max-w-sm mx-auto"
          />
        </div>
      )}
    </div>
  );
}

export default function HistoryView() {
  const { entries, clearEntries } = useADHDStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">History</h2>
        {entries.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
                clearEntries();
              }
            }}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white 
                     hover:bg-red-700 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Clear History
          </button>
        )}
      </div>
      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">No entries yet. Start tracking your state!</p>
          </div>
        ) : (
          entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
} 