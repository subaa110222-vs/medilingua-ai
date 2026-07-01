# MediLingua AI (MediLingua AI)

### *Breaking Language Barriers in Healthcare with AI*
**India Runs Ideathon 2026 - Challenge 3 (Everyday AI Innovator: Life, Made Better)**

MediLingua AI is an investor-grade, clinical-grade medical communication co-pilot designed for hospitals, Primary Health Centers (PHCs), ambulances, and rural healthcare workers. It facilitates seamless voice-to-voice translation between doctors and patients speaking different Indian languages while automatically compiling clinical SOAP notes, extracting medical entities, checking medication risks, and scheduling SMS/WhatsApp voice reminders.

---

## 🌟 Core Features
1. **Real-time Voice-to-Voice Translation**: Streaming translation (e.g., Tamil $\leftrightarrow$ English) with low latency.
2. **Medical-Aware translation**: Ingests symptoms, drug names, and clinical abbreviations instead of simple literal translation.
3. **Automated SOAP Summary**: Compiles consultation transcripts into formatted medical SOAP notes (Subjective, Objective, Assessment, Plan).
4. **Prescription Explanation**: Translates prescription instructions into simple dialect-aware audio for patients.
5. **AI Risk & Allergy Detection**: Real-time analysis warning doctors of drug-drug interactions, pregnancy issues, and allergy conflicts.
6. **Emergency Alert (SOS)**: Live detection of critical symptoms (e.g., stroke, chest pain) that triggers immediate ambulance routing.
7. **Offline Mode**: Operates on low-resource edges in disconnected rural locations using localized, quantized models.
8. **ABDM Integration Ready**: Maps records to Ayushman Bharat Health Account (ABHA) profiles.

---

## 📁 Repository Structure
```
d:\ideas\india runs/
├── README.md                   # [THIS FILE] Project overview & setup guide
├── docker-compose.yml          # Local database & offline services docker config
├── docs/                       # Slide decks, database architecture, Q&As
│   ├── architecture.md         # Full system flow & prompt design
│   ├── database_schema.sql     # PostgreSQL schemas & migrations
│   ├── pitch_deck.md           # Investor presentation slides
│   └── judge_qa.md             # Playbook for hackathon judges Q&A
├── backend/                    # FastAPI python code
│   ├── Dockerfile
│   ├── main.py
│   ├── config.py
│   ├── db.py
│   ├── schemas.py
│   ├── ai_engine.py
│   ├── requirements.txt
│   ├── api/                    # Route handlers
│   └── services/               # Internal business logic
├── frontend/                   # Next.js 15 app
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── src/                    # TSX App and Components
│   └── components/
└── demo/                       # Live Interactive Demo
    └── index.html              # High-fidelity single-file presentation demo
```

---

## 🛠️ Tech Stack & Key Integrations
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Radix UI (Shadcn)
- **Backend**: FastAPI (Python 3.10+), Uvicorn, WebSockets
- **Database**: PostgreSQL (Supabase Managed / Local PG)
- **Authentication**: Clerk JWT Integration
- **Speech & Translation**: Groq Whisper (STT), AI4Bharat / Govt. Bhashini API (Indic Speech Translation), ElevenLabs / Bhashini TTS (Voice Synthesis)
- **Language Models**: Llama-3-70B (via Groq API), GPT-4o-mini (OpenAI API)
- **Notifications**: Twilio API (SMS / WhatsApp voice-reminder dispatches)
- **Maps API**: Google Maps (Nearby PHC search and SOS routing)

---

## 🚀 Getting Started

### 1. Backend Setup (FastAPI)
Navigate to the backend directory and set up a Python virtual environment:
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # For Windows
pip install -r requirements.txt
```
Copy and rename env configurations:
Create a `.env` file in `/backend`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medilingua
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
CLERK_SECRET_KEY=your_clerk_secret_key
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
```
Run the development server:
```bash
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup (Next.js)
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```
Configure environmental credentials:
Create `.env.local` inside `/frontend`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publish_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
Launch the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the client dashboard.

---

## 📱 Standalone Presentation Demo
For hackathon booths and quick showcases without full API credentials, we have built a beautiful, high-fidelity, interactive **Standalone Demo**:
1. Open the file `demo/index.html` in any web browser.
2. Experience simulated real-time Tamil-to-English translation.
3. Review clinical SOAP notes, risk alerts, prescriptions, and interactive analytics.
