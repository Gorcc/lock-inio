'use client';

import Header from '@/components/Header';
import LeftMenu from '@/components/LeftMenu';
import StudyTimer from '@/components/StudyTimer';
import { useState, useEffect } from 'react';

export default function Home() {
  const [tasks, setTasks] = useState<Array<{id: number, text: string, completed: boolean, timestamp: Date}>>([]);
  const [newTask, setNewTask] = useState('');

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        // Parse the saved tasks and convert timestamp strings back to Date objects
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          timestamp: new Date(task.timestamp)
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([
        ...tasks, 
        { 
          id: Date.now(), 
          text: newTask, 
          completed: false,
          timestamp: new Date()
        }
      ]);
      setNewTask('');
    }
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <LeftMenu />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 rounded-xl bg-white p-8 shadow-md">
              <div className="flex justify-center">
                <StudyTimer />
              </div>
            </div>
            
            <div className="rounded-xl bg-white p-8 shadow-md">
              <h2 className="mb-4 text-xl font-bold flex items-center">
                <span className="mr-2">📝</span>
                What are you working on today?
              </h2>
              
              <form onSubmit={handleAddTask} className="mb-6 flex">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter your task here..."
                  className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-800"
                />
                <button 
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
              </form>
              
              {tasks.length > 0 ? (
                <ul className="space-y-2">
                  {tasks.map(task => (
                    <li 
                      key={task.id} 
                      className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center flex-1">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(task.id)}
                          className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
                        />
                        <span className={`ml-3 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {task.text}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-400 mr-3">
                          {task.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Delete task"
                        >
                          🗑️
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-center py-4">Add your first task to get started! ✨</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
