import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wind, 
  Moon, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock,
  ChevronRight,
  Heart
} from 'lucide-react';

interface Content {
  id: number;
  type: string;
  title: string;
  content: string;
  duration: string;
}

export default function WellnessToolsPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [selectedTool, setSelectedTool] = useState<Content | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const fetchContent = async () => {
    const res = await fetch('/api/wellness');
    const data = await res.json();
    setContent(data);
  };

  const startSession = (tool: Content) => {
    setSelectedTool(tool);
    const minutes = parseInt(tool.duration || '5');
    setTimeLeft(minutes * 60);
    setIsActive(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Wellness Tools</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Take a moment for yourself with our guided sessions designed to restore balance and calm.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { type: 'meditation', icon: Moon, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', title: 'Meditation' },
          { type: 'breathing', icon: Wind, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', title: 'Breathing' },
          { type: 'affirmation', icon: Sparkles, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', title: 'Affirmations' },
        ].map((category) => (
          <div key={category.type} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${category.bg} flex items-center justify-center ${category.color}`}>
                <category.icon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{category.title}</h2>
            </div>
            <div className="space-y-4">
              {content.filter(c => c.type === category.type).map((item) => (
                <button
                  key={item.id}
                  onClick={() => startSession(item)}
                  className="w-full p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all text-left group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 transition-colors">{item.title}</h3>
                    {item.duration && (
                      <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                        <Clock className="w-3 h-3" />
                        {item.duration}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">{item.content}</p>
                  <div className="mt-4 flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    Start Session
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Active Session Overlay */}
      <AnimatePresence>
        {selectedTool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-900/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-2xl w-full bg-white dark:bg-zinc-900 rounded-[40px] p-12 text-center relative overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
              </div>

              <button 
                onClick={() => setSelectedTool(null)}
                className="absolute top-8 right-8 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-2"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative z-10 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                  {selectedTool.type.toUpperCase()}
                </div>
                <h2 className="text-4xl font-bold text-zinc-900 dark:text-white">{selectedTool.title}</h2>
                
                {selectedTool.type !== 'affirmation' ? (
                  <div className="space-y-12">
                    <div className="relative flex items-center justify-center">
                      <motion.div
                        animate={{ scale: isActive ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="w-64 h-64 rounded-full border-4 border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center"
                      >
                        <span className="text-6xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          {formatTime(timeLeft)}
                        </span>
                      </motion.div>
                    </div>
                    <div className="flex justify-center gap-6">
                      <button
                        onClick={() => setIsActive(!isActive)}
                        className="w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20"
                      >
                        {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                      </button>
                      <button
                        onClick={() => {
                          setTimeLeft(parseInt(selectedTool.duration || '5') * 60);
                          setIsActive(false);
                        }}
                        className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <RotateCcw className="w-8 h-8" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-12">
                    <p className="text-3xl italic text-zinc-700 dark:text-zinc-300 leading-relaxed font-serif">
                      "{selectedTool.content}"
                    </p>
                    <div className="mt-12">
                      <button
                        onClick={() => setSelectedTool(null)}
                        className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-colors"
                      >
                        I Feel Better
                      </button>
                    </div>
                  </div>
                )}

                {isActive && selectedTool.type === 'breathing' && (
                  <motion.p
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-emerald-600 dark:text-emerald-400 font-medium text-xl"
                  >
                    Breathe in... and breathe out...
                  </motion.p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const X = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
