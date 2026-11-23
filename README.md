# BreatheWise AI 🍃

> **Know Your Air. Protect Your Family. Improve Your Environment.**

[![Live Production](https://img.shields.io/badge/Vercel-Live_Deployment-10b981?style=for-the-badge&logo=vercel)](https://breathewise-ai-nu.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-slate?style=for-the-badge&logo=github)](https://github.com/Puneeth2306/breathewise-ai)

**Live URL**: [https://breathewise-ai-nu.vercel.app](https://breathewise-ai-nu.vercel.app)  
**GitHub Repository**: [https://github.com/Puneeth2306/breathewise-ai](https://github.com/Puneeth2306/breathewise-ai)

BreatheWise AI is a premium, GenAI-powered environmental intelligence and sustainable-living web platform designed to help individuals, families, and urban communities navigate severe winter smog and urban air pollution. 

Demonstrated for **Bengaluru, India** and architected for global cities worldwide.

---

## 🌟 Key Application Modules

1. **Atmospheric Monitoring Dashboard**
   - Real-time multi-pollutant assimilation (PM2.5, PM10, NO2, O3, CO, SO2) powered by European Copernicus CAMS models and Open-Meteo.
   - Dual-scale comparative analysis: **US EPA AQI** and **Indian Central Pollution Control Board (CPCB) / SAMEER** sub-indexes.
   - 48-hour interactive atmospheric trend graph (past 6 hours + next 24 hours forecast) detailing diurnal particulate shifts.
   - Smart geolocation auto-detection and global city search.

2. **BreatheWise AI Assistant (Google Gemini)**
   - Conversational AI powered by official Google GenAI SDK.
   - Live environmental context ingestion (current AQI, PM2.5 concentrations, and user lifestyle profiles injected into prompts).
   - Strict scientific guardrails: never hallucinates AQI values, never provides clinical diagnoses, and clearly explains atmospheric physics (thermal inversion, boundary layer mixing).

3. **Personalized Daily Planner**
   - Lifestyle synchronization matching daily office/school schedules, workout windows, and commute modes against daily pollution troughs.
   - Family protection checklists for vulnerable groups (infants, elderly, asthmatics).

4. **Indoor Air Quality (IAQ) & HEPA Sizing**
   - Accurate Clean Air Delivery Rate (CADR in CFM and m³/h) sizing engine to achieve 4.5+ Air Changes per Hour (ACH).
   - Dynamic window opening scheduler aligned with midday atmospheric mixing.
   - Clear scientific disclosures: debunking the myth that houseplants replace mechanical True HEPA filtration.

5. **Sustainable Living & Transit Matrix**
   - Direct quantified comparisons: Solo petrol car vs. Metro rail vs. Bus vs. Carpool vs. Active micro-mobility.
   - Transparent evaluation of emissions, personal particulate exposure, and practical real-world limitations.

6. **CO2 Environmental Impact Tracker**
   - Log clean journeys and calculate verified kilograms of CO2 avoided using UK DEFRA / IPCC emission factors.
   - Tree absorption day equivalencies and car kilometers spared.
   - Scientific transparency disclaimer clarifying that estimated carbon avoidance does not directly alter local ground-level AQI readings.

7. **Community Air Action Network**
   - Aggregated, privacy-preserving citizen statistics (clean kilometers logged, tonnes of CO2 avoided).
   - Active grassroots clean-air pledges (Namma Metro Commuter Challenge, Zero Open Burning Vigil).

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion, Lucide Icons
- **Data Visualization**: Recharts (Responsive Area and Bar charts)
- **Artificial Intelligence**: Google Gemini API (`@google/generative-ai`)
- **Atmospheric Data**: Open-Meteo Air Quality API (European Copernicus CAMS & GFS assimilation)
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) + LocalStorage offline-first fallback
- **Deployment**: Vercel & GitHub

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Puneeth2306/breathewise-ai.git

# Navigate into project directory
cd breathewise-ai

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Gemini API Key (Get at https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Credentials (Optional - App includes full offline demo persistence)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Running Locally

```bash
# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Building for Production

```bash
npm run build
npm run start
```

---

## 🔒 Security & Privacy

- All API keys are isolated server-side inside Next.js API routes (`/api/gemini/chat`, `/api/daily-plan`, `/api/indoor-air`).
- Full Supabase Row Level Security (RLS) schemas provided in `supabase/schema.sql`.
- Privacy-conscious community metrics: no individual user GPS locations or personal identifiers are published.
- `.env.local` is strictly excluded from Git commits via `.gitignore`.

---

## 📜 Scientific Attribution & Methodologies

- **Air Quality Standards**: US EPA Air Quality Index (AQI) & Indian Central Pollution Control Board (CPCB) / SAMEER National AQI.
- **Atmospheric Models**: Copernicus Atmosphere Monitoring Service (CAMS) & Open-Meteo APIs.
- **Carbon Accounting**: Greenhouse Gas Protocol / UK DEFRA passenger transport emission factors.

---

## 📄 License

MIT License. Open-source environmental technology initiative.
