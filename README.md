# AdivaSetu (अदिवा सेतु)
### Tribal Scholarship & Fellowship Digital Gateway
**Ministry of Tribal Affairs, Government of India**

---

## 🏛️ Overview

**AdivaSetu** is an AI-enabled scholarship and fellowship management platform prototype designed for the **Ministry of Tribal Affairs, Government of India**. It brings the complete scholar lifecycle into a single transparent, digital workflow — from preliminary eligibility checking, 10-step digital application, and multi-stage AI document verification to officer scrutiny, dynamic merit screening, and Direct Benefit Transfer (DBT) fellowship management.

Although designed as a frontend-only prototype for hackathon demonstration, it operates entirely client-side with full persistence via `localStorage`, simulated AI reasoning, real browser file handling, and browser-native screen recording.

---

## ⚡ Quick Deployment on Vercel

This repository is pre-configured with `vercel.json` for seamless Single Page Application (SPA) routing on Vercel.

1. Import this repository `https://github.com/PuneetKumar1790/AdivaSetu.git` into [Vercel](https://vercel.com).
2. **Framework Preset**: `Vite`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. Click **Deploy**.

---

## 🌟 Key Capabilities

### 1. Dual Persona Experience
- **Applicant**: `Aarav Kumar` (Scheduled Tribe Scholar - Gond community, JNU Ph.D Fellow)
- **Ministry Officer**: `Dr. Rajesh Soren, IPoS` (Deputy Secretary, Scholarships & Fellowships)
- 1-Click quick login buttons available on the portal login page and via the persistent **"Demo Tour"** header drawer.

### 2. AI Document Intelligence Pipeline (7-Stage)
1. Document Quality & Blur Analysis
2. Multilingual OCR Extraction
3. Classification & Seal Detection
4. DigiLocker / e-Pramaan Registry Match
5. Scheme Rule & Income Threshold Match
6. Tamper & Anomaly Risk Analysis
7. Confidence Score & Decision Synthesis

### 3. Deficiency Resolution Flow
- Automatic detection of expired/flagged documents (e.g., Annual Family Income Certificate).
- Correction workspace enabling replacement uploads with real-time AI re-verification scoring **98.2% Pass**.
- Seamless state transition to `Resubmitted` and placement into the officer scrutiny queue.

### 4. Ministry Officer AI-Assisted Scrutiny Workspace
- **Overall AI Confidence Score**: `96.2%`
- 100% Document completeness, 98.6% cross-document consistency, 0 critical risk flags.
- **Human-in-the-Loop Governance**: Sovereign decision actions (`Approve Eligibility`, `Request Clarification`, `Mark Deficient`) with confirmation modals.

### 5. Configurable Screening & Merit Engine
- Live candidate merit table ranked across criteria.
- Parameter adjustment sliders: Academic (30%), Research (25%), Eligibility (20%), Institution (15%), Document Authenticity (10%).
- Real-time merit index recalculation upon weight tuning.

### 6. Fellowship & Direct Benefit Transfer (DBT) Ledger
- Active fellowship card detailing monthly stipend (₹37,000/mo JRF + contingency) and 5-year tenor.
- PFMS disbursement ledger with UTR numbers and milestones.
- Client-side downloadable **Provisional Award Letter** with digital seal and signature.

### 7. National & State-Wise Analytics
- 20 Priority States table (Madhya Pradesh, Odisha, Jharkhand, Chhattisgarh, etc.) with sanction rates.
- Selection Funnel, Scheme Distribution, and AI vs Manual turnaround comparison (2.8 days vs 44.0 days).

### 8. Built-in Browser Screen Recorder
- Built-in video recording using `navigator.mediaDevices.getDisplayMedia()`.
- Duration timer, pause, resume, stop controls, in-browser playback preview, and `.webm` download.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS v4 (Indian Gov-tech palette: Forest Green `#0D3829`, Saffron `#D97706`, Ivory `#FDFBF7`)
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, Tailwind CSS keyframes
- **Persistence**: Reactive `localStorage` state layer with automatic seed data

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/PuneetKumar1790/AdivaSetu.git

# Navigate into project directory
cd AdivaSetu

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📜 License & Acknowledgements

Created for the **Ministry of Tribal Affairs, Government of India** digital prototype initiative.
