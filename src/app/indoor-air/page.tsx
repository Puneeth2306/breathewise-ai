'use client';

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Wind, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle, 
  Info, 
  RefreshCw, 
  Sliders, 
  Flame, 
  Clock, 
  AlertTriangle,
  Fan
} from 'lucide-react';
import { DEFAULT_LOCATION } from '@/lib/air-quality';
import { LocationData } from '@/types/air-quality';

export default function IndoorAirPage() {
  const [location, setLocation] = useState<LocationData>(DEFAULT_LOCATION);
  const [outdoorAqi, setOutdoorAqi] = useState<number>(78);

  const [roomType, setRoomType] = useState('Bedroom');
  const [roomArea, setRoomArea] = useState(220); // sq ft
  const [ventilation, setVentilation] = useState('street-facing');
  const [cookingFuel, setCookingFuel] = useState('lpg');
  const [hasPurifier, setHasPurifier] = useState(true);
  const [purifierType, setPurifierType] = useState('hepa-true');

  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('breathewise_current_location');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLocation(parsed);
      } catch {}
    }

    async function loadAqi() {
      try {
        const res = await fetch(
          `/api/air-quality?lat=${location.latitude}&lon=${location.longitude}&city=${encodeURIComponent(location.city)}`
        );
        if (res.ok) {
          const data = await res.json();
          setOutdoorAqi(data.current.usAqi);
        }
      } catch {}
    }
    loadAqi();
  }, [location.city, location.latitude, location.longitude]);

  const handleAssess = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/indoor-air', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomType,
          roomAreaSqFt: roomArea,
          ventilationType: ventilation,
          cookingFuel,
          hasPurifier,
          purifierType,
          outdoorAqi,
          city: location.city,
        }),
      });
      if (!res.ok) throw new Error('Failed to evaluate indoor air');
      const json = await res.json();
      setAssessment(json);
    } catch (e) {
      console.error(e);
      alert('Could not complete indoor air assessment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAssess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outdoorAqi]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Home className="w-4 h-4 text-emerald-600" />
            <span>Household IAQ & HEPA Engineering</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Indoor Air Quality Assistant
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Size your air purifier CADR, schedule smart window ventilation, and eliminate indoor particulate spikes.
          </p>
        </div>

        <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-subtle flex items-center gap-2 text-xs">
          <span className="text-slate-500">Outdoor {location.city}:</span>
          <span className="font-bold text-slate-900">{outdoorAqi} AQI</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Room Configuration */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Room Assessment Parameters</span>
            </h3>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Room Type</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
            >
              <option value="Master Bedroom">Master Bedroom</option>
              <option value="Children's Bedroom / Nursery">Children&apos;s Bedroom / Nursery</option>
              <option value="Living Room">Living Room</option>
              <option value="Home Office">Home Office</option>
              <option value="Kitchen / Dining">Kitchen / Dining</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Room Size: {roomArea} sq ft</span>
              <span className="text-slate-500 font-normal">Approx {Math.round(roomArea * 0.093)} m²</span>
            </div>
            <input
              type="range"
              min={80}
              max={800}
              step={10}
              value={roomArea}
              onChange={(e) => setRoomArea(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Ventilation Exposure</label>
            <select
              value={ventilation}
              onChange={(e) => setVentilation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
            >
              <option value="street-facing">Street-facing (High vehicular exhaust exposure)</option>
              <option value="courtyard">Courtyard / Green space facing (Buffer zone)</option>
              <option value="high-rise">High-Rise (Floor 8+, above ground boundary inversion)</option>
              <option value="closed-ac">Sealed Central AC / Minimal natural draft</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Cooking Fuel & Smoke Exposure</label>
            <select
              value={cookingFuel}
              onChange={(e) => setCookingFuel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
            >
              <option value="lpg">LPG Stove with range hood</option>
              <option value="induction">Electric Induction (Zero combustion byproducts)</option>
              <option value="lpg-no-hood">LPG without range hood / exhaust fan</option>
              <option value="wood-biomass">Biomass / Traditional hearth</option>
            </select>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={hasPurifier}
                onChange={(e) => setHasPurifier(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600"
              />
              <span>I currently have an Air Purifier in this room</span>
            </label>

            {hasPurifier && (
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Filter Type Installed</label>
                <select
                  value={purifierType}
                  onChange={(e) => setPurifierType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                >
                  <option value="hepa-true">True HEPA H13 (Traps 99.97% down to 0.3 µm)</option>
                  <option value="basic-filter">Basic Carbon / Pre-filter mesh only</option>
                  <option value="ionizer">Ionic / Electrostatic generator (Ozone warning)</option>
                </select>
              </div>
            )}
          </div>

          <button
            onClick={handleAssess}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-300" />}
            <span>Calculate Sizing & Recommendations</span>
          </button>
        </div>

        {/* Right Content: Sizing, Window Strategy & AI Advice */}
        <div className="lg:col-span-7 space-y-6">
          {assessment && (
            <>
              {/* CADR Metric Sizing Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">Recommended CADR</span>
                    <Fan className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">
                    {assessment.recommendedCadrCfm} <span className="text-sm font-normal text-slate-500">CFM</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Equivalent to <span className="font-semibold text-slate-800">{assessment.recommendedCadrM3H} m³/h</span> airflow.
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium border-t border-slate-100 pt-2">
                    Delivers 4.5 Air Changes per Hour (ACH) for your {roomArea} sq ft space.
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">Window Opening Advice</span>
                    <Clock className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    Smart Outdoor Sync
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {assessment.windowAdvice}
                  </p>
                  <div className="text-[11px] text-cyan-700 font-medium border-t border-slate-100 pt-2">
                    Prevents thermal inversion particulate infiltration.
                  </div>
                </div>
              </div>

              {/* Scientific Fact Check Callout: Plants vs HEPA */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Info className="w-4 h-4 text-amber-600" />
                  <span>Atmospheric Science Check: Potted Plants vs Mechanical HEPA</span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  {assessment.plantFactCheck} While indoor plants add natural biophilic calm and absorb trace amounts of benzene/formaldehyde, they lack the active air circulation volume required to capture microscopic airborne PM2.5 or PM10. True HEPA filtration remains mandatory.
                </p>
              </div>

              {/* Detailed Markdown Advice */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>AI Household Air Protocol</span>
                </h3>
                <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed space-y-3">
                  {assessment.aiAdvice}
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
