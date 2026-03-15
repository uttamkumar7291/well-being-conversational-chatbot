import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Heart, Wind, BarChart2, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-zinc-950">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Your AI Wellness Companion</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white leading-tight mb-6">
              Mental Wellness & <span className="text-emerald-600">Daily Balance</span>
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-lg">
              WellMind AI provides personalized emotional support, mood tracking, and guided tools to help you navigate life's challenges with clarity and calm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 group">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="px-8 py-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-center">
                Sign In
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl bg-emerald-200/50 dark:bg-emerald-900/20 overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/wellness/800/800" 
                alt="Wellness" 
                className="w-full h-full object-cover mix-blend-overlay"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 max-w-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">Emotional Support</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Available 24/7</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">"I'm here to listen and support you whenever you need it."</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">Everything You Need to Thrive</h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">Comprehensive tools designed to support your mental health journey at every step.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: 'AI Emotional Support', desc: 'Compassionate conversations to help you process emotions and find peace.' },
              { icon: Wind, title: 'Guided Wellness', desc: 'Meditation and breathing exercises tailored to your current state.' },
              { icon: BarChart2, title: 'Mood Tracking', desc: 'Visualize your emotional patterns and gain deep personal insights.' },
              { icon: Shield, title: 'Privacy First', desc: 'Your data is secure and your conversations are private.' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-8">How WellMind AI Works</h2>
              <div className="space-y-8">
                {[
                  { step: '01', title: 'Check-in Daily', desc: 'Log your mood and share how you are feeling with our AI companion.' },
                  { step: '02', title: 'Get Support', desc: 'Receive personalized advice, meditation guides, or just a listening ear.' },
                  { step: '03', title: 'Track Progress', desc: 'Watch your wellness trends and see how your habits impact your mood.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="text-4xl font-bold text-emerald-200 dark:text-emerald-900/40">{item.step}</span>
                    <div>
                      <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{item.title}</h4>
                      <p className="text-zinc-600 dark:text-zinc-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border border-zinc-100 dark:border-zinc-800">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-emerald-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%]">
                    I've been feeling quite stressed lately with work deadlines.
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                    I'm sorry to hear that. It's completely normal to feel overwhelmed when deadlines pile up. Would you like to try a 5-minute box breathing exercise to help calm your nervous system?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 font-bold text-emerald-600 text-xl">
            <Sparkles className="w-6 h-6" />
            <span>WellMind AI</span>
          </div>
          <div className="flex gap-8 text-zinc-500 dark:text-zinc-400 text-sm">
            <a href="#" className="hover:text-emerald-600">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-600">Terms of Service</a>
            <a href="#" className="hover:text-emerald-600">Contact Support</a>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-zinc-400 dark:text-zinc-500 text-sm">© 2026 WellMind AI. All rights reserved.</p>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium">Developed by Er. uttam kumar</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
