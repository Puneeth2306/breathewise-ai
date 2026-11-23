'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Leaf, 
  ArrowRight, 
  Train, 
  Bus, 
  Users, 
  Bike, 
  Zap, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  TrendingDown,
  Info
} from 'lucide-react';
import { EMISSION_FACTORS } from '@/lib/impact-calculator';

interface AlternativeComparison {
  id: string;
  category: string;
  traditional: {
    title: string;
    emission: string;
    drawbacks: string[];
  };
  sustainable: {
    title: string;
    emission: string;
    savingsPercent: number;
    benefits: string[];
    limitations: string[];
  };
}

const COMPARISONS: AlternativeComparison[] = [
  {
    id: 'commute-metro',
    category: 'Daily Urban Commute',
    traditional: {
      title: 'Solo Petrol/Diesel Car Commute',
      emission: '170g CO2 / km',
      drawbacks: ['High brake & tire particulate wear', 'Severe traffic congestion', 'High fuel expense'],
    },
    sustainable: {
      title: 'Metro Rail (e.g., Namma Metro)',
      emission: '28g CO2 / passenger-km',
      savingsPercent: 84,
      benefits: [
        '84% greenhouse gas reduction per trip',
        'Filtered air-conditioned cabins cut roadside particulate exposure by 70%',
        'Immune to surface road gridlock',
      ],
      limitations: [
        'Fixed station routes require first/last-mile connection',
        'Peak-hour crowding during 8:30-10:00 AM',
      ],
    },
  },
  {
    id: 'commute-carpool',
    category: 'Ridesharing & Carpooling',
    traditional: {
      title: 'Single-Occupancy Vehicle',
      emission: '170g CO2 / km',
      drawbacks: ['Duplicates vehicle trips on the same corridor', 'Multiplies localized road wear'],
    },
    sustainable: {
      title: 'Shared 3-Person Carpool',
      emission: '56g CO2 / passenger-km',
      savingsPercent: 67,
      benefits: [
        'Divides fuel and toll expenses by 3',
        'Takes 2 passenger vehicles off crowded arterial roads',
        'Enables private door-to-door convenience',
      ],
      limitations: [
        'Requires departure time coordination',
        'Slightly longer pickup detours',
      ],
    },
  },
  {
    id: 'active-mobility',
    category: 'Micro-Mobility (<4 km Trips)',
    traditional: {
      title: 'Short Petrol Car or Auto Trip',
      emission: '210g CO2 / km (Cold engine inefficiency)',
      drawbacks: ['Cold engines produce 3x higher VOCs in the first 2 km', 'Parking friction'],
    },
    sustainable: {
      title: 'Walking or Cycling (Clean Air Routes)',
      emission: '0g CO2 (Zero emissions)',
      savingsPercent: 100,
      benefits: [
        '100% elimination of transport emissions',
        'Cardiovascular health improvement',
        'Zero parking or fuel costs',
      ],
      limitations: [
        'High particulate inhalation if riding on high-traffic roadways (wear N95 on busy roads)',
        'Weather dependent (summer heat or monsoon downpours)',
      ],
    },
  },
  {
    id: 'waste-management',
    category: 'Residential Waste Disposal',
    traditional: {
      title: 'Open Leaf & Backyard Waste Burning',
      emission: 'Extremely high localized PM2.5, dioxins, and black carbon',
      drawbacks: [
        'Severe carcinogen release at breathing height',
        'Major cause of toxic winter morning smog in residential layouts',
        'Illegal under environmental regulations',
      ],
    },
    sustainable: {
      title: 'Decentralized Composting & Municipal Collection',
      emission: 'Minimal biogenic emissions; converts organic matter to nutrient humus',
      savingsPercent: 95,
      benefits: [
        'Zero open toxic smoke generation',
        'Enriches soil and retains groundwater',
        'Protects neighborhood respiratory health',
      ],
      limitations: [
        'Requires 2-3 weeks for microbiological breakdown',
        'Demands strict segregation between dry recyclables and organic waste',
      ],
    },
  },
];

export default function SustainabilityPage() {
  const [distanceKm, setDistanceKm] = useState(15);
  const [selectedComparison, setSelectedComparison] = useState(COMPARISONS[0]);

  // Calculations for interactive comparison
  const carEmissionsGrams = distanceKm * EMISSION_FACTORS.petrolCarGramsPerKm;
  const metroEmissionsGrams = distanceKm * EMISSION_FACTORS.metroTrainGramsPerKm;
  const busEmissionsGrams = distanceKm * EMISSION_FACTORS.dieselBusGramsPerKm;
  const carpoolEmissionsGrams = distanceKm * EMISSION_FACTORS.carpool3PersonsGramsPerKm;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span>Decarbonization & Clean Mobility Matrix</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sustainable Living & Low-Emission Alternatives
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Quantifying the trade-offs, carbon savings, and particulate exposure reductions of modern sustainable lifestyle shifts.
        </p>
      </div>

      {/* Interactive Trip Distance Simulator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Interactive Commute Emission Simulator
            </h3>
            <p className="text-xs text-slate-600">
              Select your typical commute distance to see the exact carbon difference between transit modes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Distance:</span>
            <span className="text-xl font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              {distanceKm} km
            </span>
          </div>
        </div>

        <div>
          <input
            type="range"
            min={2}
            max={40}
            step={1}
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-medium mt-1">
            <span>2 km (Local neighborhood)</span>
            <span>15 km (Average urban commute)</span>
            <span>40 km (Suburban cross-city corridor)</span>
          </div>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Solo Petrol Car */}
          <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold text-rose-800">Solo Petrol Car</div>
            <div className="text-2xl font-black text-rose-950">
              {(carEmissionsGrams / 1000).toFixed(2)} <span className="text-xs font-normal text-slate-600">kg CO2</span>
            </div>
            <div className="text-[11px] text-rose-700 font-medium">
              Baseline high-emission benchmark
            </div>
          </div>

          {/* Diesel City Bus */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold text-amber-800">City / Electric Bus</div>
            <div className="text-2xl font-black text-amber-950">
              {(busEmissionsGrams / 1000).toFixed(2)} <span className="text-xs font-normal text-slate-600">kg CO2</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-bold">
              Saves {((carEmissionsGrams - busEmissionsGrams) / 1000).toFixed(2)} kg CO2 (60% cut)
            </div>
          </div>

          {/* Metro Rail */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold text-emerald-800">Metro Rail Transit</div>
            <div className="text-2xl font-black text-emerald-950">
              {(metroEmissionsGrams / 1000).toFixed(2)} <span className="text-xs font-normal text-slate-600">kg CO2</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-bold">
              Saves {((carEmissionsGrams - metroEmissionsGrams) / 1000).toFixed(2)} kg CO2 (84% cut)
            </div>
          </div>

          {/* 3-Person Carpool */}
          <div className="bg-cyan-50/80 border border-cyan-200 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold text-cyan-800">3-Person Carpool</div>
            <div className="text-2xl font-black text-cyan-950">
              {(carpoolEmissionsGrams / 1000).toFixed(2)} <span className="text-xs font-normal text-slate-600">kg CO2</span>
            </div>
            <div className="text-[11px] text-cyan-700 font-bold">
              Saves {((carEmissionsGrams - carpoolEmissionsGrams) / 1000).toFixed(2)} kg CO2 (67% cut)
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>Emission factors based on UK DEFRA & IPCC passenger transport guidelines.</span>
          <Link href="/impact" className="text-emerald-700 font-bold hover:underline">
            Log your journey to impact tracker →
          </Link>
        </div>
      </div>

      {/* Sustainable Alternatives Matrix */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Comprehensive Lifestyle Alternatives Matrix
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COMPARISONS.map((comp) => (
            <div
              key={comp.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                  {comp.category}
                </div>

                {/* Traditional High-Emission Option */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{comp.traditional.title}</span>
                    <span className="text-[11px] font-semibold text-rose-600">{comp.traditional.emission}</span>
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                    {comp.traditional.drawbacks.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Green Alternative */}
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>{comp.sustainable.title}</span>
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      -{comp.sustainable.savingsPercent}% Emissions
                    </span>
                  </div>

                  {/* Benefits */}
                  <div>
                    <span className="text-[11px] font-bold text-emerald-900">Key Advantages:</span>
                    <ul className="text-[11px] text-emerald-800 space-y-1 list-disc list-inside mt-0.5">
                      {comp.sustainable.benefits.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  <div className="border-t border-emerald-100 pt-2">
                    <span className="text-[11px] font-bold text-slate-700">Practical Limitations & Trade-offs:</span>
                    <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc list-inside mt-0.5">
                      {comp.sustainable.limitations.map((lim, i) => (
                        <li key={i}>{lim}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
