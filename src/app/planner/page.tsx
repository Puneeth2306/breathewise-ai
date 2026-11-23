'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Car, 
  Home, 
  Users, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Wind, 
  Save, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { DEFAULT_LOCATION } from '@/lib/air-quality';
import { LocationData } from '@/types/air-quality';
import { UserProfile } from '@/types/user';
import { DailyPlannerResponse } from '@/types/planner';
import { LocalStorageStore } from '@/lib/supabase';

export default function PlannerPage() {
  const [location, setLocation] = useState<LocationData>(DEFAULT_LOCATION);
  const [profile, setProfile] = useState<UserProfile>({
    id: 'user_default',
    city: 'Bengaluru',
    country: 'India',
    latitude: 12.9716,
    longitude: 77.5946,
    hasChildren: true,
    hasElderly: false,
    hasAsthmaOrRespiratory: false,
    commuteType: 'car',
    commuteDistanceKm: 14,
    exerciseTime: 'early-morning',
    cookingFuel: 'lpg',
    hasAirPurifier: true,
    purifierType: 'hepa-true',
    ventilationQuality: 'street-facing',
    createdAt: new Date().toISOString(),
  });

  const [plan, setPlan] = useState<DailyPlannerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const savedLoc = localStorage.getItem('breathewise_current_location');
    if (savedLoc) {
      try {
        const parsed = JSON.parse(savedLoc);
        setLocation(parsed);
        setProfile(prev => ({ ...prev, city: parsed.city, country: parsed.country }));
      } catch {}
    }

    const savedProf = LocalStorageStore.getUserProfile();
    if (savedProf) {
      setProfile(savedProf);
    }
  }, []);

  const generatePlan = async () => {
    setLoading(true);
    try {
      // Fetch live AQI first
      const aqiRes = await fetch(
        `/api/air-quality?lat=${location.latitude}&lon=${location.longitude}&city=${encodeURIComponent(location.city)}`
      );
      const aqiData = aqiRes.ok ? await aqiRes.json() : null;

      const res = await fetch('/api/daily-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          currentAQI: aqiData?.current,
          hourlyAQI: aqiData?.hourly,
          city: location.city,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate daily plan');
      const json = await res.json();
      setPlan(json);
    } catch (e) {
      console.error(e);
      alert('Could not generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.city]);

  const handleSaveProfile = () => {
    LocalStorageStore.saveUserProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    generatePlan();
  };

  const handleCopySchedule = () => {
    if (!plan) return;
    const text = `BreatheWise AI Daily Schedule (${plan.location}):\n` +
      plan.schedule.map(s => `${s.timeWindow}: ${s.activity}\nAdvice: ${s.actionableStep}\n`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Lifestyle Synchronization Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Personalized Daily Air Planner
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            AI-optimized hourly schedule mapping your commute, exercise, and ventilation to daily particulate troughs.
          </p>
        </div>

        {plan && (
          <button
            onClick={handleCopySchedule}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Schedule Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Daily Schedule</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Lifestyle Profile Onboarding */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Household & Lifestyle Profile</h3>
            </div>
            {savedSuccess && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Saved!
              </span>
            )}
          </div>

          {/* Commute Mode */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Daily Commute Mode
            </label>
            <select
              value={profile.commuteType}
              onChange={(e: any) => setProfile({ ...profile, commuteType: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
            >
              <option value="metro">Metro Rail / Rapid Transit</option>
              <option value="bus">Electric or City Bus</option>
              <option value="car">Personal Car (Solo)</option>
              <option value="carpool">Carpool / Rideshare</option>
              <option value="two-wheeler">Two-Wheeler / Motorcycle</option>
              <option value="bicycle">Bicycle</option>
              <option value="walking">Walking</option>
              <option value="remote">Work from Home (Remote)</option>
            </select>
          </div>

          {/* Distance */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              One-Way Commute Distance (km)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={profile.commuteDistanceKm}
              onChange={(e) => setProfile({ ...profile, commuteDistanceKm: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Exercise Timing */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Exercise Preference
            </label>
            <select
              value={profile.exerciseTime}
              onChange={(e: any) => setProfile({ ...profile, exerciseTime: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
            >
              <option value="early-morning">Early Morning (6:00 AM - 7:30 AM)</option>
              <option value="morning">Morning (7:30 AM - 9:00 AM)</option>
              <option value="afternoon">Midday / Afternoon (1:00 PM - 3:30 PM)</option>
              <option value="evening">Evening (5:30 PM - 7:30 PM)</option>
              <option value="indoor-only">Gym / Indoor Only</option>
              <option value="none">None</option>
            </select>
          </div>

          {/* Family Composition Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700 block">Family Vulnerabilities</span>
            
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.hasChildren}
                onChange={(e) => setProfile({ ...profile, hasChildren: e.target.checked })}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Children or Infants present in home</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.hasElderly}
                onChange={(e) => setProfile({ ...profile, hasElderly: e.target.checked })}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Elderly family members (65+)</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.hasAsthmaOrRespiratory}
                onChange={(e) => setProfile({ ...profile, hasAsthmaOrRespiratory: e.target.checked })}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Asthma, allergies, or respiratory sensitivity</span>
            </label>
          </div>

          {/* Indoor Environment */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700 block">Home Environment</span>

            <div>
              <label className="text-[11px] text-slate-600 block mb-1">Cooking Fuel</label>
              <select
                value={profile.cookingFuel}
                onChange={(e: any) => setProfile({ ...profile, cookingFuel: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
              >
                <option value="lpg">LPG (Liquefied Petroleum Gas)</option>
                <option value="induction">Induction / Electric Cooking</option>
                <option value="piped-gas">Piped Natural Gas (PNG)</option>
                <option value="wood-biomass">Biomass / Traditional Hearth</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-600 block mb-1">Air Purifier Availability</label>
              <select
                value={profile.hasAirPurifier ? 'yes' : 'no'}
                onChange={(e) => setProfile({ ...profile, hasAirPurifier: e.target.value === 'yes' })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
              >
                <option value="yes">Yes (True HEPA Unit Available)</option>
                <option value="no">No Air Purifier</option>
              </select>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Update Profile & Recompute Plan</span>
          </button>
        </div>

        {/* Right Content: Generated Personalized Plan */}
        <div className="lg:col-span-7 space-y-6">
          {loading && !plan ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <h4 className="font-bold text-slate-900 text-sm">Synthesizing Hour-by-Hour Air Plan...</h4>
              <p className="text-xs text-slate-500">Cross-referencing your commute and workout against atmospheric modeling.</p>
            </div>
          ) : plan ? (
            <div className="space-y-6">
              
              {/* Daily Overview Rating Banner */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Daily Risk Rating</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      plan.overallRating === 'Safe' ? 'bg-emerald-100 text-emerald-800' :
                      plan.overallRating === 'Exercise Caution' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {plan.overallRating}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{plan.location}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {plan.summary}
                </p>
              </div>

              {/* Hourly Schedule Timeline Cards */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Hour-by-Hour Adaptive Schedule</span>
                </h3>

                <div className="space-y-3">
                  {plan.schedule.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-subtle hover:border-emerald-200 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {item.timeWindow}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{item.activity}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-[10px] text-slate-500">Est. AQI:</span>
                          <span className="font-bold text-slate-800">{item.aqiForecast}</span>
                        </div>
                      </div>

                      <div className="text-xs font-semibold text-slate-800">
                        {item.recommendation}
                      </div>

                      <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-emerald-900 border border-slate-100 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Action: </span>
                          <span>{item.actionableStep}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 italic">
                        Scientific Rationale: {item.rationale}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commute & Family Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Commute Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-subtle space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Car className="w-4 h-4 text-emerald-600" />
                    <span>Commute Optimization</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900">
                    {plan.commuteRecommendation.suggestedMode}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {plan.commuteRecommendation.departureAdvice}
                  </p>
                  <div className="text-[11px] font-bold text-emerald-700 pt-1">
                    Reduces individual particulate exposure by ~{plan.commuteRecommendation.exposureReductionPercent}%
                  </div>
                </div>

                {/* Family Checklist */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-subtle space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Family Safeguard Checklist</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {plan.familyProtectionChecklist.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}
