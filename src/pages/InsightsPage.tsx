import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { 
  BarChart2, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Loader2,
  Calendar,
  Heart,
  Sparkles
} from 'lucide-react';
import { getMoodInsights } from '../services/gemini';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function InsightsPage() {
  const { token } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/mood/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setHistory(data);
      
      if (data.length > 0) {
        const aiInsights = await getMoodInsights(data.slice(0, 10));
        setInsights(aiInsights);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const moodCounts = history.reduce((acc: any, log: any) => {
    acc[log.mood] = (acc[log.mood] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(moodCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#71717a'];

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">AI Wellness Insights</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Personalized analysis of your well-being journey.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Mood Distribution */}
        <div className="md:col-span-1 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Mood Distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-zinc-600 dark:text-zinc-400">{item.name}</span>
                </div>
                <span className="font-bold text-zinc-900 dark:text-white">{item.value as React.ReactNode}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-emerald-600 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Lightbulb className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Personalized AI Suggestions
              </h2>
              <div className="prose prose-invert max-w-none">
                {insights ? (
                  <div className="whitespace-pre-wrap text-emerald-50 leading-relaxed">
                    {insights}
                  </div>
                ) : (
                  <p>Log more moods to receive personalized AI insights and suggestions.</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Stress Indicators</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {moodCounts['Stressed'] > 2 
                  ? "We've noticed an uptick in stress levels. Consider trying our 'Stress Relief' meditation."
                  : "Your stress levels appear stable. Keep maintaining your current balance!"}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Wellness Score</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Based on your recent logs, your emotional resilience is high. You're doing a great job checking in!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
