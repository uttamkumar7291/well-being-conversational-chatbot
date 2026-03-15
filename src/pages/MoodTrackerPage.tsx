import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { 
  Smile, 
  Meh, 
  Frown, 
  Angry, 
  CloudRain, 
  Sun, 
  Calendar, 
  Plus, 
  History,
  CheckCircle2,
  BarChart2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const moods = [
  { icon: Sun, label: 'Happy', color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { icon: Smile, label: 'Calm', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { icon: Meh, label: 'Neutral', color: 'text-zinc-500', bg: 'bg-zinc-50' },
  { icon: Frown, label: 'Sad', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Angry, label: 'Stressed', color: 'text-red-500', bg: 'bg-red-50' },
];

export default function MoodTrackerPage() {
  const { token } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const res = await fetch('/api/mood/history', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setHistory(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/mood', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ mood: selectedMood, note })
      });
      setSelectedMood(null);
      setNote('');
      setShowSuccess(true);
      fetchHistory();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartData = [...history].reverse().map(log => ({
    date: format(new Date(log.created_at), 'MMM dd'),
    value: moods.findIndex(m => m.label === log.mood) + 1
  }));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Mood Tracker</h1>
        <p className="text-zinc-500 dark:text-zinc-400">How are you feeling today?</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Log Mood Section */}
        <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-600" />
            Log Your Mood
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-5 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.label}
                  type="button"
                  onClick={() => setSelectedMood(mood.label)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                    selectedMood === mood.label 
                      ? `${mood.bg} dark:bg-emerald-900/20 ring-2 ring-emerald-500` 
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <mood.icon className={`w-8 h-8 ${mood.color}`} />
                  <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{mood.label}</span>
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Add a note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 h-32 resize-none text-zinc-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={!selectedMood || isSubmitting}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Saving...' : 'Save Entry'}
              {showSuccess && <CheckCircle2 className="w-5 h-5" />}
            </button>
          </form>
        </section>

        {/* Weekly Summary */}
        <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-600" />
            Mood Trends
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="dark:stroke-zinc-800" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'var(--tooltip-bg, #fff)', color: 'var(--tooltip-text, #000)' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
            <p className="text-sm text-emerald-800 dark:text-emerald-400 font-medium">
              You've logged {history.length} entries. Keep tracking to see more patterns!
            </p>
          </div>
        </section>
      </div>

      {/* History List */}
      <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-600" />
          Recent Entries
        </h2>
        <div className="space-y-4">
          {history.map((log) => {
            const mood = moods.find(m => m.label === log.mood) || moods[2];
            return (
              <div key={log.id} className="flex items-start gap-4 p-4 rounded-2xl border border-zinc-50 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <div className={`w-12 h-12 rounded-xl ${mood.bg} dark:bg-emerald-900/20 flex items-center justify-center shrink-0`}>
                  <mood.icon className={`w-6 h-6 ${mood.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-zinc-900 dark:text-white">{log.mood}</h4>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">{format(new Date(log.created_at), 'MMM dd, h:mm a')}</span>
                  </div>
                  {log.note && <p className="text-sm text-zinc-600 dark:text-zinc-400">{log.note}</p>}
                </div>
              </div>
            );
          })}
          {history.length === 0 && (
            <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">No entries yet. Start by logging your mood above!</p>
          )}
        </div>
      </section>
    </div>
  );
}
