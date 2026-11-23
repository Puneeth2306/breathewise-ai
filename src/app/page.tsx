'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wind, 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  Home, 
  Leaf, 
  Users, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  MapPin,
  RefreshCw,
  Info,
  ChevronRight,
  Zap,
  Globe2
} from 'lucide-react';
import { POPULAR_LOCATIONS } from '@/lib/air-quality';
import { AirQualityResponse } from '@/types/air-quality';

export default function LandingPage() {
  const [selectedDemoCity, setSelectedDemoCity] = useState(POPULAR_LOCATIONS[0]); // Bengaluru
  const [aqiData, setAqiData] = useState<AirQualityResponse | null>(null);
  const [loadingAqi, setLoadingAqi] = useState(true);

  useEffect(() => {
    async function loadPreview() {
      setLoadingAqi(true);
      try {
        const res = await fetch(
          `/api/air-quality?lat=${selectedDemoCity.latitude}&lon=${selectedDemoCity.longitude}&city=${encodeURIComponent(selectedDemoCity.city)}&country=${encodeURIComponent(selectedDemoCity.country)}`
        );
        if (res.ok) {
          const data = await res.json();
          setAqiData(data);
        }
      } catch (e) {
        console.error('Failed to load AQI preview', e);
      } finally {
        setLoadingAqi(false);
      }
    }
    loadPreview();
  }, [selectedDemoCity]);

  return (
    <div className="w-full space-y-24 py-8">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pt-12 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Vision & Action */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-subtle">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Next-Gen Environmental Intelligence</span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-700">Demonstrating Bengaluru & Global Cities</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Know Your Air. <br />
                <span className="gradient-eco-text">Protect Your Family.</span> <br />
                Improve Your Environment.
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                BreatheWise AI is a GenAI-powered environmental assistant that transforms complex atmospheric pollution data into simple, personalized daily decisions. Safeguard vulnerable family members, optimize indoor ventilation, and track emissions avoided.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 justify-center lg:justify-start">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group"
                >
                  <Activity className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                  <span>Launch Live Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/assistant"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Ask BreatheWise AI</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Open-Meteo & CAMS Data</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Google Gemini Powered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>US EPA & Indian CPCB Standards</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-slate-200/90 p-6 relative overflow-hidden transition-shadow">
                
                {/* Header & City Selector */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-none">
                        {selectedDemoCity.city}
                      </h3>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {selectedDemoCity.country}
                      </span>
                    </div>
                  </div>

                  {/* City Switcher Chips */}
                  <div className="flex items-center gap-1">
                    {POPULAR_LOCATIONS.slice(0, 3).map((loc) => (
                      <button
                        key={loc.city}
                        onClick={() => setSelectedDemoCity(loc)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-md transition-colors ${
                          selectedDemoCity.city === loc.city
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {loc.city.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AQI Metric Highlight */}
                {loadingAqi ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-3">
                    <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
                    <span className="text-xs text-slate-500">Fetching live atmospheric data...</span>
                  </div>
                ) : aqiData ? (
                  <div className="space-y-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-5xl font-black text-slate-900 tracking-tight">
                          {aqiData.current.usAqi}
                        </div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                          US Air Quality Index
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${aqiData.current.badgeBg} ${aqiData.current.textColor} border ${aqiData.current.badgeBorder}`}>
                          {aqiData.current.category}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-1 font-medium">
                          CPCB: <span className="font-semibold text-slate-700">{aqiData.cpcbEquivalent.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pollutants Breakdown Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="text-[10px] text-slate-500 font-medium">PM2.5</div>
                        <div className="text-sm font-bold text-slate-900">
                          {aqiData.current.pollutants.pm25.value} <span className="text-[9px] font-normal text-slate-500">µg/m³</span>
                        </div>
                        <div className="text-[9px] text-emerald-700 font-medium mt-0.5">
                          WHO 24h: 15
                        </div>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="text-[10px] text-slate-500 font-medium">PM10</div>
                        <div className="text-sm font-bold text-slate-900">
                          {aqiData.current.pollutants.pm10.value} <span className="text-[9px] font-normal text-slate-500">µg/m³</span>
                        </div>
                        <div className="text-[9px] text-emerald-700 font-medium mt-0.5">
                          WHO 24h: 45
                        </div>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="text-[10px] text-slate-500 font-medium">NO2</div>
                        <div className="text-sm font-bold text-slate-900">
                          {aqiData.current.pollutants.no2.value} <span className="text-[9px] font-normal text-slate-500">µg/m³</span>
                        </div>
                        <div className="text-[9px] text-slate-500 font-medium mt-0.5">
                          Traffic Exhaust
                        </div>
                      </div>
                    </div>

                    {/* AI Advisory Excerpt */}
                    <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Today&apos;s Action Window:</span>
                      </div>
                      <p className="text-emerald-800 text-[11px] leading-relaxed">
                        {aqiData.dailySummary.outdoorRiskSummary} Cleanest outdoor window: <span className="font-semibold">{aqiData.dailySummary.cleanestTimeWindow}</span>.
                      </p>
                    </div>

                    {/* View full dashboard link */}
                    <Link
                      href="/dashboard"
                      className="block text-center py-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      Explore Full Atmospheric Breakdown & Trend Charts →
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. How It Works (4-Step Visual Flow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
            Intelligent Architecture
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How BreatheWise AI Protects You Daily
          </h2>
          <p className="text-sm text-slate-600">
            From atmospheric satellites to your breakfast table—we translate complex particulate data into clear, protective habits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative group hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm mb-4">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">
              Live Atmosphere Feed
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pulls continuous multi-pollutant metrics (PM2.5, PM10, NO2, O3, CO) from Open-Meteo and European Copernicus CAMS models.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative group hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 font-bold text-sm mb-4">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">
              Lifestyle Context
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Considers your exercise timings, commute route, presence of infants or seniors, home cooking type, and purifier availability.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative group hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-sm mb-4">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">
              Gemini AI Reasoning
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generates personalized schedules and action steps grounded in atmospheric physics without medical diagnoses or invented data.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative group hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 font-bold text-sm mb-4">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">
              Measure Impact
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Log low-emission transit shifts, quantify estimated kg of CO2 avoided, and participate in community clean-air initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Core Application Modules Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
            Comprehensive Suite
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for Every Dimension of Urban Air
          </h2>
          <p className="text-sm text-slate-600">
            A complete suite of proactive tools to safeguard your household and adopt sustainable alternatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Dashboard */}
          <Link
            href="/dashboard"
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle hover:shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Air Quality Dashboard
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full-spectrum live monitoring for PM2.5, PM10, NO2, O3, CO. 48-hour interactive trend graphs, WHO guideline comparisons, and Indian CPCB scale alignment.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">
              <span>View Live Dashboard</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </Link>

          {/* Card 2: AI Assistant */}
          <Link
            href="/assistant"
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle hover:shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                BreatheWise AI Assistant
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chat interactively with our Google Gemini environmental brain. Ask specific questions regarding jogging, child recess safety, and emergency smog precautions.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-cyan-700 group-hover:translate-x-1 transition-transform">
              <span>Ask a Question</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </Link>

          {/* Card 3: Daily Planner */}
          <Link
            href="/planner"
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle hover:shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Personalized Daily Planner
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Adaptive hour-by-hour schedule aligning your commute, exercise, and home habits with the diurnal dip in urban air pollution.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-amber-700 group-hover:translate-x-1 transition-transform">
              <span>Generate My Daily Plan</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </Link>

          {/* Card 4: Indoor Air */}
          <Link
            href="/indoor-air"
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle hover:shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Indoor Air & Purifier Sizing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculate room CADR requirements, smart window opening intervals, and cooking exhaust protocols. Scientific facts on why HEPA is necessary over plants alone.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-indigo-700 group-hover:translate-x-1 transition-transform">
              <span>Assess Home Air</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </Link>

          {/* Card 5: Sustainability */}
          <Link
            href="/sustainability"
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle hover:shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Sustainable Living & Transit
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compare high-emission habits against green alternatives. Quantify cost, carbon, and personal particulate exposure across metro, bus, and carpooling.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">
              <span>Explore Green Alternatives</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </Link>

          {/* Card 6: Impact Tracker */}
          <Link
            href="/impact"
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle hover:shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                CO2 Avoided Tracker
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log your clean journeys, calculate verified kilograms of CO2 avoided, and view tree absorption equivalents with transparent DEFRA emission factors.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-rose-700 group-hover:translate-x-1 transition-transform">
              <span>Track Your Impact</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Family Protection Section */}
      <section className="bg-slate-900 text-white rounded-3xl max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-xs text-emerald-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Vulnerable Populations Protocol</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Tailored Safeguards for Those Who Need It Most
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Air pollution doesn&apos;t affect everyone equally. Children breathe 50% more air per pound of body weight, seniors face heightened cardiovascular strain, and asthmatics experience airway hyper-responsiveness. BreatheWise AI customizes alerts to protect your loved ones.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-900 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Children & Infants</h4>
                  <p className="text-xs text-slate-400">Protective playground recess advisory and school bus cabin filtration tips.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-900 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Elderly & Cardiac Patients</h4>
                  <p className="text-xs text-slate-400">Morning thermal inversion avoidance to prevent cardiovascular stress.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-900 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Asthma & Respiratory Sensitivities</h4>
                  <p className="text-xs text-slate-400">Proactive air purifier activation windows and mask-wearing criteria.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Scientific Fact: Atmospheric Inversion</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              During winter mornings in cities like Bengaluru, New Delhi, and London, nocturnal radiative ground cooling creates a temperature inversion. A layer of warm air traps cold, polluted air near the ground, multiplying particulate concentration by up to 2.5x compared to afternoon hours.
            </p>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/80 space-y-2">
              <div className="text-xs font-semibold text-emerald-400">BreatheWise Recommendation:</div>
              <p className="text-xs text-slate-300">
                Shift vulnerable morning walks from 6:30 AM to after 9:30 AM when solar heating breaks the inversion lid and disperses surface particulates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Sustainable Living & Community Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
              Collective Action
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Small Daily Choices. Substantial Clean Air Gains.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Urban air quality is not an immutable fate—it is the sum of local emissions. By shifting a 15 km daily commute from a solo petrol car to Namma Metro or electric bus, you eliminate over 2.1 kg of CO2 and prevent toxic brake and exhaust particulate generation in residential wards.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/sustainability"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>View Decision Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/community"
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
              >
                <span>Join Community Action</span>
              </Link>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-slate-700">Emission Factor Benchmarks (IPCC/DEFRA)</span>
              <span className="text-[10px] text-slate-500">Per Passenger-km</span>
            </div>
            
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-medium mb-1 text-slate-800">
                  <span>Solo Petrol Car</span>
                  <span className="font-bold text-rose-600">170 g CO2 / km</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-rose-500 h-2 rounded-full w-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1 text-slate-800">
                  <span>Diesel City Bus</span>
                  <span className="font-bold text-amber-600">68 g CO2 / km</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full w-[40%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1 text-slate-800">
                  <span>Metro Rail / Rapid Transit</span>
                  <span className="font-bold text-emerald-600">28 g CO2 / km</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full w-[16%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1 text-slate-800">
                  <span>Walking / Cycling</span>
                  <span className="font-bold text-cyan-600">0 g CO2 / km (Zero Emissions)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-cyan-500 h-2 rounded-full w-[2%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Take Charge of Your Daily Air Quality
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Start by checking your current neighborhood AQI, generating a custom daily plan, or asking our Gemini AI assistant for personalized family guidance.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-md"
              >
                Open Dashboard Now
              </Link>
              <Link
                href="/planner"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
              >
                Create Daily Schedule
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
