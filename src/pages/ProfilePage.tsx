import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, Calendar, LogOut, Settings, Bell, Lock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Profile Settings</h1>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* User Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 text-center">
            <div className="w-24 h-24 rounded-3xl bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 text-4xl font-bold">
              {user.name[0]}
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{user.name}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{user.email}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3 h-3" />
              {user.role}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Quick Links</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors text-sm text-left">
                <Bell className="w-4 h-4" />
                Notifications
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors text-sm text-left">
                <Lock className="w-4 h-4" />
                Privacy & Security
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors text-sm text-left">
                <Settings className="w-4 h-4" />
                Preferences
              </button>
            </div>
          </div>

          <div className="bg-emerald-600 p-6 rounded-3xl shadow-lg text-white">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Developer Info
            </h3>
            <p className="text-sm opacity-90 mb-4">This application is maintained and developed by:</p>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <p className="font-bold text-lg">Er. uttam kumar</p>
              <p className="text-xs opacity-75">Lead Developer & Architect</p>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Personal Information</h3>
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={user.name}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue={user.email}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="pt-4">
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Wellness Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800">
                <div>
                  <p className="font-bold text-zinc-900 dark:text-white">Daily Reminders</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Get notified to log your mood daily.</p>
                </div>
                <div className="w-12 h-6 bg-emerald-600 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800">
                <div>
                  <p className="font-bold text-zinc-900 dark:text-white">AI Insights</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Allow AI to analyze your mood patterns.</p>
                </div>
                <div className="w-12 h-6 bg-emerald-600 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
