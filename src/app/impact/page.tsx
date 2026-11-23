'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  PlusCircle, 
  TrendingUp, 
  TreePine, 
  Car, 
  Calendar, 
  Sparkles, 
  Info, 
  Trash2, 
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { calculateAvoidedCO2, calculateEquivalencies } from '@/lib/impact-calculator';
import { LoggedImpactActivity } from '@/types/impact';
import { LocalStorageStore } from '@/lib/supabase';

export default function ImpactTrackerPage() {
  const [activities, setActivities] = useState<LoggedImpactActivity[]>([]);
  const [activityType, setActivityType] = useState<'metro' | 'bus' | 'carpool' | 'bicycle' | 'walking' | 'work-from-home'>('metro');
  const [distanceKm, setDistanceKm] = useState(14);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load activities from local storage
  useEffect(() => {
    const stored = LocalStorageStore.getImpactActivities();
    if (stored && stored.length > 0) {
      setActivities(stored);
    } else {
      // Seed initial demonstration activities
      const initial: LoggedImpactActivity[] = [
        {
          id: 'demo_1',
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          activityType: 'metro',
          distanceKm: 16,
          co2SavedKg: 2.27,
          baselineVehicle: 'petrol-car',
          notes: 'Namma Metro commute to tech park',
        },
        {
          id: 'demo_2',
          date: new Date(Date.now() - 86400000 * 1).toISOString(),
          activityType: 'carpool',
          distanceKm: 22,
          co2SavedKg: 1.87,
          baselineVehicle: 'petrol-car',
          notes: 'Shared ride with two colleagues',
        },
        {
          id: 'demo_3',
          date: new Date().toISOString(),
          activityType: 'metro',
          distanceKm: 16,
          co2SavedKg: 2.27,
          baselineVehicle: 'petrol-car',
          notes: 'Metro return journey',
        },
      ];
      setActivities(initial);
      LocalStorageStore.saveImpactActivity(initial[0]);
    }
  }, []);

  const totalCo2SavedKg = activities.reduce((acc, a) => acc + (a.co2SavedKg || 0), 0);
  const totalCleanKm = activities.reduce((acc, a) => acc + (a.distanceKm || 0), 0);
  const equivalencies = calculateEquivalencies(totalCo2SavedKg);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (distanceKm <= 0) return;
    setSubmitting(true);

    try {
      const co2 = calculateAvoidedCO2(activityType, distanceKm);
      const newAct: LoggedImpactActivity = {
        id: 'act_' + Date.now(),
        date: new Date().toISOString(),
        activityType,
        distanceKm,
        co2SavedKg: co2,
        baselineVehicle: 'petrol-car',
        notes: notes.trim() || undefined,
      };

      const updated = [newAct, ...activities];
      setActivities(updated);
      LocalStorageStore.saveImpactActivity(newAct);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#10b981', '#06b6d4', '#3b82f6'],
        });
      } catch {}

      setNotes('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    const updated = activities.filter(a => a.id !== id);
    setActivities(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('breathewise_impact_activities', JSON.stringify(updated));
    }
  };

  // Group weekly data for Recharts
  const chartData = activities.slice(0, 7).reverse().map(a => ({
    name: new Date(a.date).toLocaleDateString([], { weekday: 'short' }),
    co2Kg: Number(a.co2SavedKg.toFixed(2)),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Carbon Avoidance Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Environmental Impact Tracker
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Log low-emission transit choices, quantify verified greenhouse gas reductions, and monitor your personal contribution to cleaner urban skies.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total CO2 Saved */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Estimated CO2 Avoided</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {totalCo2SavedKg.toFixed(2)} <span className="text-sm font-normal text-slate-500">kg</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            Compared to solo petrol vehicle baseline
          </div>
        </div>

        {/* Total Clean Distance */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Clean Distance Traveled</span>
            <Activity className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {totalCleanKm.toFixed(0)} <span className="text-sm font-normal text-slate-500">km</span>
          </div>
          <div className="text-[11px] text-cyan-700 font-medium">
            Across {activities.length} logged sustainable trips
          </div>
        </div>

        {/* Tree Absorption Equivalence */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Tree Absorption Days</span>
            <TreePine className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {equivalencies.treeDays} <span className="text-sm font-normal text-slate-500">days</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            Equivalent to {equivalencies.treesYearEquiv} mature tree-years
          </div>
        </div>

        {/* Car Distance Spared */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Car Km Spared</span>
            <Car className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {equivalencies.carKmSaved} <span className="text-sm font-normal text-slate-500">km</span>
          </div>
          <div className="text-[11px] text-indigo-700 font-medium">
            Tailpipe emission distance removed from roads
          </div>
        </div>
      </div>

      {/* Mandatory Scientific Transparency Alert */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-800">Scientific Methodology & Regulatory Disclosure:</strong> All figures displayed are modeled estimates calculated using standard IPCC and DEFRA lifecycle emission factors. Individual carbon avoidance does not directly or instantly alter local ambient ground-level AQI readings, which are driven by broader meteorological wind patterns and aggregate regional emissions.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Log New Sustainable Activity */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Log a Clean Journey</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Sustainable Mode
              </label>
              <select
                value={activityType}
                onChange={(e: any) => setActivityType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
              >
                <option value="metro">Metro Rail / Rapid Transit (Namma Metro / Delhi Metro)</option>
                <option value="bus">Electric / City Bus</option>
                <option value="carpool">3-Person Carpool / Shared Ride</option>
                <option value="bicycle">Bicycle (Zero emissions)</option>
                <option value="walking">Walking (Zero emissions)</option>
                <option value="work-from-home">Work from Home / Avoided Commute</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Distance Traveled: {distanceKm} km</span>
                <span className="text-emerald-700 font-bold">
                  Saves ~{calculateAvoidedCO2(activityType, distanceKm)} kg CO2
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={60}
                step={1}
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Trip Notes / Route (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Indiranagar to Whitefield via Metro"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Clean Journey & Update Tracker</span>
            </button>
          </form>
        </div>

        {/* Right Content: Chart & Recent Logs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Progress Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Recent Avoided Emissions Trend (kg CO2e)
              </h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                Weekly History
              </span>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', fontSize: '11px', border: 'none' }} 
                    formatter={(val: any) => [`${val} kg`, 'CO2 Avoided']}
                  />
                  <Bar dataKey="co2Kg" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Log List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Activity History ({activities.length})
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {activities.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  No sustainable journeys logged yet. Record your first transit trip above!
                </div>
              ) : (
                activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs hover:border-emerald-200 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-800 capitalize flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{act.activityType.replace(/-/g, ' ')}</span>
                        <span className="font-normal text-slate-500">({act.distanceKm} km)</span>
                      </div>
                      {act.notes && <div className="text-[11px] text-slate-500 mt-0.5">{act.notes}</div>}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        +{act.co2SavedKg.toFixed(2)} kg
                      </span>
                      <button
                        onClick={() => handleDelete(act.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
