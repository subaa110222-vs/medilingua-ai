-- MediLingua AI - PostgreSQL Database Schema DDL
-- For local development and Supabase production deployment

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. HOSPITALS TABLE
CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('PHC', 'Ambulance', 'District Hospital', 'Clinic', 'General Hospital')),
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    phone_number VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for geographic searches
CREATE INDEX IF NOT EXISTS idx_hospitals_geo ON hospitals (latitude, longitude);

-- 2. USERS (DOCTORS / HEALTH WORKERS) TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY, -- Linked to Clerk Auth User ID
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL CHECK (role IN ('Doctor', 'Nurse', 'Rural Health Worker', 'Admin', 'Pharmacist')),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
    preferred_language VARCHAR(50) DEFAULT 'English',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for user logins and lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_hospital ON users (hospital_id);

-- 3. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other', 'Declined')),
    blood_group VARCHAR(5) CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    chronic_conditions VARCHAR(255)[], -- e.g., ARRAY['Asthma', 'Hypertension']
    known_allergies VARCHAR(255)[],    -- e.g., ARRAY['Sulfa', 'Penicillin']
    pregnancy_status BOOLEAN DEFAULT FALSE,
    primary_language VARCHAR(50) NOT NULL DEFAULT 'Tamil',
    phone_number VARCHAR(15) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for search by name and phone
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients (full_name);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients (phone_number);

-- 4. CONSULTATIONS TABLE
CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    patient_language VARCHAR(50) NOT NULL,
    doctor_language VARCHAR(50) NOT NULL DEFAULT 'English',
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Emergency', 'Cancelled')),
    audio_log_url TEXT, -- Path to full session recording in Supabase Storage
    soap_summary JSONB, -- Stores SOAP structured report (Subjective, Objective, Assessment, Plan)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consultations_patient ON consultations (patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_doctor ON consultations (doctor_id);
CREATE INDEX IF NOT EXISTS idx_consultations_created ON consultations (created_at DESC);

-- 5. TRANSCRIPTION LOGS TABLE
CREATE TABLE IF NOT EXISTS transcription_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    sender VARCHAR(10) NOT NULL CHECK (sender IN ('Patient', 'Doctor')),
    original_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    audio_translation_url TEXT, -- Path to generated voice TTS audio in Supabase Storage
    is_risk_detected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trans_logs_consultation ON transcription_logs (consultation_id);

-- 6. PRESCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID REFERENCES consultations(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
    scanned_image_url TEXT, -- Supabase Storage URL if scanned via OCR
    ocr_raw_text TEXT,
    medicines JSONB NOT NULL, -- Array: [{"name": "Metformin", "dosage": "1-0-1", "duration": "30 days", "explanation": "Tamil text"}]
    risk_warnings VARCHAR(255)[], -- e.g., ARRAY['Allergy warning: Sulfonamide']
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions (patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_consultation ON prescriptions (consultation_id);

-- 7. REMINDERS TABLE
CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    dosage_time TIME NOT NULL,
    reminder_type VARCHAR(20) NOT NULL CHECK (reminder_type IN ('WhatsApp', 'SMS', 'Voice Call')),
    language VARCHAR(50) NOT NULL DEFAULT 'Tamil',
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Paused', 'Completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reminders_patient ON reminders (patient_id);
CREATE INDEX IF NOT EXISTS idx_reminders_status ON reminders (status);

-- 8. EMERGENCY ALERTS TABLE
CREATE TABLE IF NOT EXISTS emergency_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    trigger_keyword VARCHAR(255) NOT NULL, -- e.g., 'Chest Pain'
    status VARCHAR(20) DEFAULT 'Triggered' CHECK (status IN ('Triggered', 'Acknowledged', 'Dispatched', 'Resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_emergency_alerts_hospital ON emergency_alerts (hospital_id);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_status ON emergency_alerts (status);
