import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Flame, Cigarette, BookOpen, Scissors, Heart, Moon, DollarSign } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const App = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  
  // Resolution State - Mapping your 15 points
  const [habits, setHabits] = useState([
    { id: 1, name: "3.75+ GPA Prep", type: "toggle", done: false, icon: <BookOpen size={18}/> },
    { id: 2, name: "Tution", type: "toggle", done: false, icon: <DollarSign size={18}/> },
    { id: 4, name: "DSA/CP Daily Grind", type: "number", val: 0, icon: <Flame size={18}/> },
    { id: 5, name: "Weight Loss (Target -20kg)", type: "number", val: 0, icon: <CheckCircle2 size={18}/> },
    { id: 6, name: "Hair Care Routine", type: "toggle", done: false, icon: <Scissors size={18}/> },
    { id: 7, name: "Academic Study (1.5hr)", type: "toggle", done: false, icon: <BookOpen size={18}/> },
    { id: 8, name: "Skill Dev (2hr)", type: "toggle", done: false, icon: <Flame size={18}/> },
    { id: 11, name: "Save 500 BDT", type: "number", val: 0, icon: <DollarSign size={18}/> },
    { id: 12, name: "Cigarettes (Max 4)", type: "number", val: 0, icon: <Cigarette size={18}/> },
    { id: 13, name: "Sleep > 6hrs", type: "toggle", done: false, icon: <Moon size={18}/> },
    { id: 14, name: "Mood", type: "select", value: "neutral", icon: <Heart size={18}/>, options: ["demotivated", "sad", "frustrated", "neutral", "chill", "happy", "balling"] },
    { id: 15, name: "Inside Campus Study", type: "toggle", done: false, icon: <BookOpen size={18}/> },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`${API_URL}/habits/${today}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Merge loaded data with default habits
        const habitsMap = new Map(data.map(h => [h.id, h]));
        setHabits(habits.map(h => {
          const loaded = habitsMap.get(h.id);
          return loaded ? { ...h, done: loaded.done === 1, val: loaded.val } : h;
        }));
      }
    } catch (error) {
      console.log('Database not yet running - will use local state');
    }
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  const updateVal = (id, change) => {
    setHabits(habits.map(h => h.id === id ? { ...h, val: Math.max(0, h.val + change) } : h));
  };

  const updateMood = (id, value) => {
    setHabits(habits.map(h => h.id === id ? { ...h, value } : h));
  };

  const saveToDatabase = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`${API_URL}/habits/${today}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habits })
      });
      
      if (response.ok) {
        alert('✓ Synced to database!');
      }
    } catch (error) {
      alert('Error: Server not running. Start with: npm run server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[url('https://i.imgur.com/your-pixel-city.jpg')] bg-cover bg-center bg-fixed font-sans">
      <div className="min-h-screen bg-black/60 backdrop-blur-[2px] p-6 flex flex-col items-center">
        
        {/* Live Calendar Section */}
        <header className="text-center my-12 animate-in fade-in duration-1000">
          <h1 className="text-5xl font-bold tracking-tighter text-white drop-shadow-lg">
            {dateTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </h1>
          <p className="text-2xl text-cyan-400 font-light uppercase tracking-[0.2em] mt-2">
            {dateTime.toLocaleDateString('en-GB', { weekday: 'long' })}
          </p>
        </header>

        {/* Habits Grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.map((h) => (
            <div key={h.id} className="bg-white/10 border border-white/10 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between hover:bg-white/15 transition-all">
              <div className="flex items-center gap-4">
                <span className="text-cyan-400">{h.icon}</span>
                <span className="text-slate-100 font-medium">{h.name}</span>
              </div>
              
              {h.type === "toggle" ? (
                <button onClick={() => toggleHabit(h.id)}>
                  {h.done ? <CheckCircle2 className="text-green-400" /> : <Circle className="text-slate-500" />}
                </button>
              ) : h.type === "select" ? (
                <select 
                  value={h.value} 
                  onChange={(e) => updateMood(h.id, e.target.value)}
                  className="bg-black/30 text-white rounded-full px-3 py-1 border border-slate-500 text-sm capitalize"
                >
                  {h.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <div className="flex items-center gap-3 bg-black/30 rounded-full px-3 py-1">
                  <button onClick={() => updateVal(h.id, -1)} className="text-slate-400 hover:text-white">-</button>
                  <span className={`font-bold ${h.id === 12 && h.val > 4 ? 'text-red-500' : 'text-white'}`}>{h.val}</span>
                  <button onClick={() => updateVal(h.id, 1)} className="text-slate-400 hover:text-white">+</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button 
          onClick={saveToDatabase}
          disabled={loading}
          className="mt-12 px-12 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-full shadow-lg shadow-cyan-900/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? 'SYNCING...' : 'SYNC TO DATABASE'}
        </button>
      </div>
    </div>
  );
};

export default App;