'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Wind, 
  Sparkles, 
  Calendar, 
  Home as HomeIcon, 
  Leaf, 
  Activity, 
  Users, 
  MapPin, 
  Search, 
  Menu, 
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { POPULAR_LOCATIONS, DEFAULT_LOCATION } from '@/lib/air-quality';
import { LocationData } from '@/types/air-quality';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationData>(DEFAULT_LOCATION);
  const [currentAqi, setCurrentAqi] = useState<number | null>(78);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync selected location from local storage or events
  useEffect(() => {
    const saved = localStorage.getItem('breathewise_current_location');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentLocation(parsed);
      } catch {}
    }

    // Listen for custom location change events across pages
    const onLocationChange = (e: any) => {
      if (e.detail) {
        setCurrentLocation(e.detail);
        if (e.detail.aqi) setCurrentAqi(e.detail.aqi);
      }
    };
    window.addEventListener('breathewise_location_updated', onLocationChange);
    return () => window.removeEventListener('breathewise_location_updated', onLocationChange);
  }, []);

  // Search cities
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/location/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch {
        const localMatches = POPULAR_LOCATIONS.filter(l => 
          l.city.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(localMatches);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const selectCity = (city: LocationData) => {
    setCurrentLocation(city);
    localStorage.setItem('breathewise_current_location', JSON.stringify(city));
    window.dispatchEvent(new CustomEvent('breathewise_location_updated', { detail: city }));
    setSearchOpen(false);
    setSearchQuery('');
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Activity },
    { name: 'AI Assistant', href: '/assistant', icon: Sparkles },
    { name: 'Daily Planner', href: '/planner', icon: Calendar },
    { name: 'Indoor Air', href: '/indoor-air', icon: HomeIcon },
    { name: 'Sustainable Living', href: '/sustainability', icon: Leaf },
    { name: 'Impact Tracker', href: '/impact', icon: ShieldCheck },
    { name: 'Community', href: '/community', icon: Users },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5'
            : 'bg-white/80 backdrop-blur-sm border-b border-slate-200/60 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Wind className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-slate-900 tracking-tight leading-none font-sans">
                    BreatheWise
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    AI
                  </span>
                </div>
                <span className="text-[11px] text-slate-600 font-medium tracking-tight">
                  Environmental Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      isActive
                        ? 'bg-white text-emerald-700 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Location & Search Selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-xs text-slate-700 transition-colors shadow-subtle"
                title="Change or detect location"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800 max-w-[100px] truncate">
                  {currentLocation.city}
                </span>
                {currentAqi !== null && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    currentAqi <= 50 ? 'bg-emerald-100 text-emerald-800' :
                    currentAqi <= 100 ? 'bg-amber-100 text-amber-800' :
                    currentAqi <= 150 ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {currentAqi} AQI
                  </span>
                )}
                <Search className="w-3 h-3 text-slate-500 ml-0.5" />
              </button>

              <Link
                href="/assistant"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all hover:shadow-emerald-500/10"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Ask AI</span>
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* City Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search city (e.g. Bengaluru, New Delhi, London)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm outline-none text-slate-900 placeholder:text-slate-500"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-h-80 overflow-y-auto">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Popular Demonstration Cities
              </div>
              <div className="grid grid-cols-2 gap-1.5 mb-4">
                {POPULAR_LOCATIONS.slice(0, 6).map((city) => (
                  <button
                    key={city.city}
                    onClick={() => selectCity(city)}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center justify-between ${
                      currentLocation.city === city.city
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50/50'
                    }`}
                  >
                    <span>{city.city}</span>
                    <span className="text-[10px] text-slate-500">{city.country}</span>
                  </button>
                ))}
              </div>

              {searchResults.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Search Results
                  </div>
                  <div className="space-y-1">
                    {searchResults.map((city, idx) => (
                      <button
                        key={`${city.city}-${city.latitude}-${idx}`}
                        onClick={() => selectCity(city)}
                        className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-emerald-50 text-slate-800 flex items-center justify-between border border-transparent hover:border-emerald-100"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-medium">{city.city}</span>
                          <span className="text-xs text-slate-500">{city.region ? `${city.region}, ` : ''}{city.country}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
              <span>Powered by Open-Meteo & CAMS</span>
              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        selectCity({
                          city: 'My Location',
                          region: 'Detected GPS',
                          country: '',
                          latitude: pos.coords.latitude,
                          longitude: pos.coords.longitude,
                          isCustom: true,
                        });
                      },
                      () => alert('Could not access device GPS location. Please select a city manually.')
                    );
                  }
                }}
                className="text-emerald-700 hover:underline font-semibold flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" />
                Use GPS Current Location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
