'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Users, 
  Globe, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  MapPin, 
  CheckCircle, 
  Flame, 
  Award, 
  Share2, 
  TrendingUp, 
  Leaf,
  BellRing
} from 'lucide-react';
import { CommunityMetric } from '@/types/impact';

export default function CommunityPage() {
  const [data, setData] = useState<CommunityMetric | null>(null);
  const [pledgedCampaigns, setPledgedCampaigns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCommunity() {
      try {
        const res = await fetch('/api/impact');
        if (res.ok) {
          const json = await res.json();
          setData(json.community);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCommunity();

    // Load user pledges from localStorage
    try {
      const saved = localStorage.getItem('breathewise_user_pledges');
      if (saved) setPledgedCampaigns(JSON.parse(saved));
    } catch {}
  }, []);

  const handlePledge = (campaignId: string) => {
    if (pledgedCampaigns.includes(campaignId)) return;

    const updated = [...pledgedCampaigns, campaignId];
    setPledgedCampaigns(updated);
    localStorage.setItem('breathewise_user_pledges', JSON.stringify(updated));

    if (data) {
      setData({
        ...data,
        totalActivePledges: data.totalActivePledges + 1,
      });
    }

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4', '#f59e0b'],
      });
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Decentralized Citizen Air Defense</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Community Air Action Network
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Aggregated, privacy-preserving metrics showing collective citizen action to reduce localized smog and protect community lungs.
        </p>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-tr from-slate-900 to-navy-900 text-white rounded-3xl p-6 shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
            <span>Verified Citizen Pledges</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-4xl font-black tracking-tight">
            {data ? data.totalActivePledges.toLocaleString() : '14,280'}
          </div>
          <div className="text-xs text-slate-400">
            Active households across Bengaluru & partner cities
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Collective CO2 Avoided</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tight">
            {data ? (data.totalKgCo2Avoided / 1000).toFixed(1) : '48.9'} <span className="text-lg font-normal text-slate-500">tonnes</span>
          </div>
          <div className="text-xs text-emerald-700 font-medium">
            Calculated via DEFRA transport emission factors
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Total Clean Transit Logged</span>
            <Globe className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tight">
            {data ? (data.totalCleanKmTraveled / 1000).toFixed(1) : '328.4'} <span className="text-lg font-normal text-slate-500">k km</span>
          </div>
          <div className="text-xs text-cyan-700 font-medium">
            Metro rail, electric bus, cycling, and walking
          </div>
        </div>
      </div>

      {/* Community Campaigns */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Active Community Clean-Air Pledges
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Join thousands of residents in proactive smog mitigation initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data?.activeCampaigns.map((camp) => {
            const isPledged = pledgedCampaigns.includes(camp.id);
            return (
              <div
                key={camp.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {camp.badge}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {camp.participants.toLocaleString()} joined
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {camp.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {camp.description}
                  </p>
                </div>

                <button
                  onClick={() => handlePledge(camp.id)}
                  disabled={isPledged}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                    isPledged
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                      : 'bg-slate-900 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isPledged ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Pledge Confirmed</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                      <span>Sign This Clean Air Pledge</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Participating Metropolitan Regions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Metropolitan Participation Leaderboard
        </h3>
        <p className="text-xs text-slate-600">
          Privacy-conscious aggregated metrics by city. Individual user locations or identifiers are never published.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {data?.topCities.map((c) => (
            <div key={c.city} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800 text-sm">
                <span>{c.city}</span>
                <span className="text-xs font-normal text-slate-500">{c.journeysLogged.toLocaleString()} trips</span>
              </div>
              <div className="text-xs text-emerald-700 font-semibold">
                {(c.co2SavedKg / 1000).toFixed(1)} tonnes CO2 avoided
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
