import React from 'react';
import Link from 'next/link';
import { Wind, Shield, Github, Heart, Globe, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white">
                <Wind className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                BreatheWise <span className="text-emerald-400 font-semibold">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Know Your Air. Protect Your Family. Improve Your Environment. Transforming complex urban air quality data into personalized, daily actionable decisions.
            </p>
            <div className="text-xs text-emerald-400/90 font-medium flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Initial Demonstration: Bengaluru, India</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Application Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Air Quality Dashboard
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-emerald-400 transition-colors">
                  BreatheWise AI Assistant
                </Link>
              </li>
              <li>
                <Link href="/planner" className="hover:text-emerald-400 transition-colors">
                  Personalized Daily Planner
                </Link>
              </li>
              <li>
                <Link href="/indoor-air" className="hover:text-emerald-400 transition-colors">
                  Indoor Air Quality & Purifiers
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="hover:text-emerald-400 transition-colors">
                  Sustainable Commute Alternatives
                </Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-emerald-400 transition-colors">
                  CO2 Environmental Impact Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Scientific Attribution & Methodologies */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Scientific Standards
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-400">
                <span>US EPA Air Quality Index (AQI)</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <span>India CPCB / SAMEER Standards</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <span>WHO 2021 Global AQ Guidelines</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <span>Open-Meteo & Copernicus CAMS Model</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <span>IPCC / DEFRA Transport Factors</span>
              </li>
            </ul>
          </div>

          {/* Scientific Disclaimer & Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Environmental Disclaimer
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              BreatheWise AI delivers environmental guidance and public health precautionary suggestions based on official atmospheric models and user inputs. It does not provide medical diagnoses.
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              CO2 emissions avoided are modeled estimates using published average vehicle emission factors.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} BreatheWise AI. Production Open Source.</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Puneeth2306/breathewise-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
