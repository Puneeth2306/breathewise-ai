'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  ShieldCheck, 
  Save, 
  Trash2, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  Info
} from 'lucide-react';
import { UserProfile } from '@/types/user';
import { LocalStorageStore, isSupabaseConfigured } from '@/lib/supabase';
import { POPULAR_LOCATIONS } from '@/lib/air-quality';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    id: 'user_default',
    email: 'puneethj232005@gmail.com',
    fullName: 'Puneeth J',
    city: 'Bengaluru',
    country: 'India',
    latitude: 12.9716,
    longitude: 77.5946,
    hasChildren: true,
    hasElderly: false,
    hasAsthmaOrRespiratory: false,
    commuteType: 'metro',
    commuteDistanceKm: 14,
    exerciseTime: 'early-morning',
    cookingFuel: 'lpg',
    hasAirPurifier: true,
    purifierType: 'hepa-true',
    ventilationQuality: 'street-facing',
    createdAt: new Date().toISOString(),
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = LocalStorageStore.getUserProfile();
    if (stored) {
      setProfile(stored);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    LocalStorageStore.saveUserProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClearCache = () => {
    if (confirm('Clear local profile and logged activity cache?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Account & Household Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            User Profile & Preferences
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Manage your personal baseline, default city, and household vulnerability indicators.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isSupabaseConfigured ? 'Supabase Synced' : 'Guest Local Mode (Active)'}</span>
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        
        {/* User Identity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={profile.fullName || ''}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              value={profile.email || ''}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Primary City */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Default City</label>
          <select
            value={profile.city}
            onChange={(e) => {
              const selected = POPULAR_LOCATIONS.find(l => l.city === e.target.value);
              if (selected) {
                setProfile({
                  ...profile,
                  city: selected.city,
                  country: selected.country,
                  latitude: selected.latitude,
                  longitude: selected.longitude,
                });
              } else {
                setProfile({ ...profile, city: e.target.value });
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500"
          >
            {POPULAR_LOCATIONS.map((loc) => (
              <option key={loc.city} value={loc.city}>
                {loc.city}, {loc.country}
              </option>
            ))}
          </select>
        </div>

        {/* Family and Household */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Family Vulnerability Profile
          </h3>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.hasChildren}
                onChange={(e) => setProfile({ ...profile, hasChildren: e.target.checked })}
                className="rounded border-slate-300 text-emerald-600"
              />
              <span>Children or Infants living in household</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.hasElderly}
                onChange={(e) => setProfile({ ...profile, hasElderly: e.target.checked })}
                className="rounded border-slate-300 text-emerald-600"
              />
              <span>Elderly family members (65+)</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.hasAsthmaOrRespiratory}
                onChange={(e) => setProfile({ ...profile, hasAsthmaOrRespiratory: e.target.checked })}
                className="rounded border-slate-300 text-emerald-600"
              />
              <span>Pre-existing asthma, bronchitis, or cardiovascular condition</span>
            </label>
          </div>
        </div>

        {/* Commute and Home */}
        <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Standard Commute Mode</label>
            <select
              value={profile.commuteType}
              onChange={(e: any) => setProfile({ ...profile, commuteType: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
            >
              <option value="metro">Metro Rail Transit</option>
              <option value="bus">Electric / City Bus</option>
              <option value="car">Solo Car</option>
              <option value="carpool">Carpool</option>
              <option value="two-wheeler">Two-Wheeler</option>
              <option value="bicycle">Bicycle</option>
              <option value="walking">Walking</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">One-Way Distance (km)</label>
            <input
              type="number"
              min={1}
              max={100}
              value={profile.commuteDistanceKm}
              onChange={(e) => setProfile({ ...profile, commuteDistanceKm: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleClearCache}
            className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Local Cache</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Saved Successfully!' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
