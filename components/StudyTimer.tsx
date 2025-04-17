'use client';

import { useState, useEffect } from 'react';
import TimerSettings, { TimerSettingsType } from './TimerSettings';

export default function StudyTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('study'); // 'study' or 'break'
  const [sessionCount, setSessionCount] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [timerSettings, setTimerSettings] = useState<TimerSettingsType>({
    studyMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 15,
    sessionsBeforeLongBreak: 4
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            clearInterval(interval as NodeJS.Timeout);
            setIsActive(false);
            
            // Switch modes
            if (mode === 'study') {
              setSessionCount(prev => prev + 1);
              const isLongBreak = (sessionCount + 1) % timerSettings.sessionsBeforeLongBreak === 0;
              
              if (isLongBreak) {
                setMode('longBreak');
                setMinutes(timerSettings.longBreakMinutes);
              } else {
                setMode('break');
                setMinutes(timerSettings.breakMinutes);
              }
            } else {
              setMode('study');
              setMinutes(timerSettings.studyMinutes);
            }
            
            return;
          }
          
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, mode, sessionCount, timerSettings]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'study') {
      setMinutes(timerSettings.studyMinutes);
    } else if (mode === 'break') {
      setMinutes(timerSettings.breakMinutes);
    } else {
      setMinutes(timerSettings.longBreakMinutes);
    }
    setSeconds(0);
  };

  const switchMode = () => {
    setIsActive(false);
    if (mode === 'study') {
      setMode('break');
      setMinutes(timerSettings.breakMinutes);
    } else {
      setMode('study');
      setMinutes(timerSettings.studyMinutes);
    }
    setSeconds(0);
  };
  
  const handleSaveSettings = (newSettings: TimerSettingsType) => {
    setTimerSettings(newSettings);
    
    // Update current timer if not active
    if (!isActive) {
      if (mode === 'study') {
        setMinutes(newSettings.studyMinutes);
      } else if (mode === 'break') {
        setMinutes(newSettings.breakMinutes);
      } else {
        setMinutes(newSettings.longBreakMinutes);
      }
      setSeconds(0);
    }
  };

  const getModeColor = () => {
    if (mode === 'study') return 'text-primary';
    if (mode === 'break') return 'text-green-500';
    return 'text-amber-500'; // long break
  };

  const getModeText = () => {
    if (mode === 'study') return 'Study Time';
    if (mode === 'break') return 'Short Break';
    return 'Long Break';
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-6xl font-bold mb-8 text-center">
        <h2 className={`text-3xl ${getModeColor()} mb-4`}>
          {getModeText()}
        </h2>
        <div className="text-8xl">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="text-sm text-gray-500 mt-2">
          Session {sessionCount + 1} / {timerSettings.sessionsBeforeLongBreak}
        </div>
      </div>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={toggleTimer}
          className={`px-6 py-3 rounded-lg text-white font-medium ${
            isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-opacity-90'
          }`}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={resetTimer}
          className="px-6 py-3 bg-gray-300 hover:bg-gray-400 rounded-lg font-medium"
        >
          Reset
        </button>
        
        <button
          onClick={switchMode}
          className="px-6 py-3 bg-gray-300 hover:bg-gray-400 rounded-lg font-medium"
        >
          Switch to {mode === 'study' ? 'Break' : 'Study'}
        </button>
      </div>
      
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        title="Timer Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Timer Settings</span>
      </button>
      
      <TimerSettings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        currentSettings={timerSettings}
      />
    </div>
  );
}