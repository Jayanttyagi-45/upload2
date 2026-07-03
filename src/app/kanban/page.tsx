'use client';
import { useState, useEffect } from 'react';

type Task = { id: string, title: string, column: 'todo' | 'inProgress' | 'done' };

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('kanban_tasks');
    if (saved) setTasks(JSON.parse(saved));
    else setTasks([
      { id: '1', title: 'Research Next.js', column: 'done' },
      { id: '2', title: 'Build interactive UI', column: 'inProgress' },
      { id: '3', title: 'Add animation effects', column: 'todo' },
    ]);
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), title: newTaskText, column: 'todo' }]);
    setNewTaskText('');
  };

  const moveTask = (id: string, newCol: 'todo' | 'inProgress' | 'done') => {
    setTasks(tasks.map(t => t.id === id ? { ...t, column: newCol } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const Column = ({ title, status, bgColor }: { title: string, status: 'todo'|'inProgress'|'done', bgColor: string }) => {
    const colTasks = tasks.filter(t => t.column === status);
    
    return (
      <div className="flex-1 min-w-[300px] bg-gray-100/50 rounded-3xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-gray-800 text-lg">{title}</h2>
          <span className={`${bgColor} text-gray-700 text-xs font-bold px-3 py-1 rounded-full`}>
            {colTasks.length}
          </span>
        </div>
        <div className="space-y-4">
          {colTasks.map(task => (
            <div key={task.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
              <p className="text-gray-800 font-medium mb-4">{task.title}</p>
              <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                  {status !== 'todo' && <button onClick={() => moveTask(task.id, status === 'done' ? 'inProgress' : 'todo')} className="text-xs font-bold text-gray-500 hover:text-indigo-600 bg-gray-100 px-2 py-1 rounded">←</button>}
                  {status !== 'done' && <button onClick={() => moveTask(task.id, status === 'todo' ? 'inProgress' : 'done')} className="text-xs font-bold text-gray-500 hover:text-indigo-600 bg-gray-100 px-2 py-1 rounded">→</button>}
                </div>
                <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors text-sm">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Project Board</h1>
            <p className="text-gray-500 mt-1">Organize your tasks visually.</p>
          </div>
          <form onSubmit={addTask} className="flex gap-2 w-full md:w-auto">
            <input 
              type="text" 
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="New task..." 
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
            />
            <button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-xl font-medium transition-colors whitespace-nowrap">
              + Add
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4">
          <Column title="To Do" status="todo" bgColor="bg-gray-200" />
          <Column title="In Progress" status="inProgress" bgColor="bg-blue-100" />
          <Column title="Done" status="done" bgColor="bg-green-100" />
        </div>
      </div>
    </main>
  );
}
