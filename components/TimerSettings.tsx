'use client';

import { useState, useEffect } from 'react';

interface TimerSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: TimerSettingsType) => void;
  currentSettings: TimerSettingsType;
}

export interface TimerSettingsType {
  studyMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
}

export default function TimerSettings({ 
  isOpen, 
  onClose, 
  onSave, 
  currentSettings 
}: TimerSettingsProps) {
  const [settings, setSettings] = useState<TimerSettingsType>(currentSettings);

  useEffect(() => {
    if (isOpen) {
      setSettings(currentSettings);
    }
  }, [isOpen, currentSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: parseInt(value, 10)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-primary">Timer Settings</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Study Duration (minutes)
            </label>
            <input
              type="number"
              name="studyMinutes"
              value={settings.studyMinutes}
              onChange={handleChange}
              min="1"
              max="120"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Short Break Duration (minutes)
            </label>
            <input
              type="number"
              name="breakMinutes"
              value={settings.breakMinutes}
              onChange={handleChange}
              min="1"
              max="30"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Long Break Duration (minutes)
            </label>
            <input
              type="number"
              name="longBreakMinutes"
              value={settings.longBreakMinutes}
              onChange={handleChange}
              min="1"
              max="60"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Sessions Before Long Break
            </label>
            <input
              type="number"
              name="sessionsBeforeLongBreak"
              value={settings.sessionsBeforeLongBreak}
              onChange={handleChange}
              min="1"
              max="10"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}