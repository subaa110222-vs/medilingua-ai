const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name?: string;
  role: "Doctor" | "Nurse" | "Rural Health Worker" | "Admin";
  hospital_id?: string;
  preferred_language: string;
}

export interface Patient {
  id: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  blood_group?: string;
  chronic_conditions: string[];
  known_allergies: string[];
  pregnancy_status: boolean;
  primary_language: string;
  phone_number: string;
  created_at: string;
}

export interface Consultation {
  id: string;
  patient_id: string;
  doctor_id: string;
  patient_language: string;
  doctor_language: string;
  status: "Active" | "Completed" | "Emergency" | "Cancelled";
  audio_log_url?: string;
  soap_summary?: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  created_at: string;
  patient?: Patient;
}

export interface TranscriptionLog {
  id: string;
  consultation_id: string;
  sender: "Patient" | "Doctor";
  original_text: string;
  translated_text: string;
  audio_translation_url?: string;
  is_risk_detected: boolean;
  created_at: string;
}

export interface Prescription {
  id: string;
  consultation_id?: string;
  patient_id: string;
  doctor_id?: string;
  scanned_image_url?: string;
  ocr_raw_text?: string;
  medicines: Array<{
    name: string;
    dosage: string; // e.g. "1-0-1"
    duration: string; // e.g. "5 days"
    explanation: string; // native language explanation
  }>;
  risk_warnings: string[];
  created_at: string;
}

export interface Reminder {
  id: string;
  patient_id: string;
  prescription_id?: string;
  medicine_name: string;
  dosage_time: string;
  reminder_type: "WhatsApp" | "SMS" | "Voice Call";
  language: string;
  status: "Active" | "Paused" | "Completed";
  created_at: string;
}

export interface Hospital {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone_number?: string;
}

export interface EmergencyAlert {
  id: string;
  consultation_id?: string;
  patient_id?: string;
  hospital_id?: string;
  trigger_keyword: string;
  status: "Triggered" | "Acknowledged" | "Dispatched" | "Resolved";
  created_at: string;
  patient?: Patient;
  hospital?: Hospital;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Sync Authenticated User
  syncUser: (token: string) =>
    request<UserProfile>("/auth/sync", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),

  // User Profile
  getProfile: (token: string) =>
    request<UserProfile>("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Patients
  createPatient: (patient: Partial<Patient>, token: string) =>
    request<Patient>("/patients", {
      method: "POST",
      body: JSON.stringify(patient),
      headers: { Authorization: `Bearer ${token}` },
    }),

  searchPatients: (query: string, token: string) =>
    request<Patient[]>(`/patients/search?query=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getPatientHistory: (patientId: string, token: string) =>
    request<Consultation[]>(`/patients/${patientId}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Consultations
  startConsultation: (patientId: string, patientLang: string, doctorLang: string, token: string) =>
    request<Consultation>("/consultations/start", {
      method: "POST",
      body: JSON.stringify({
        patient_id: patientId,
        patient_language: patientLang,
        doctor_language: doctorLang,
      }),
      headers: { Authorization: `Bearer ${token}` },
    }),

  endConsultation: (consultationId: string, token: string) =>
    request<Consultation>(`/consultations/${consultationId}/end`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),

  getConsultationDetails: (id: string, token: string) =>
    request<Consultation>(`/consultations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getTranscriptionLogs: (consultationId: string, token: string) =>
    request<TranscriptionLog[]>(`/consultations/${consultationId}/logs`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // OCR Prescriptions
  uploadPrescriptionOCR: (formData: FormData, token: string) => {
    const url = `${API_URL}/prescriptions/ocr`;
    return fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        // Note: Content-Type header must be omitted for multipart/form-data boundary
      },
    }).then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
      return res.json() as Promise<Prescription>;
    });
  },

  // Reminders
  scheduleReminders: (reminderData: { patient_id: string; prescription_id: string; reminder_type: string }, token: string) =>
    request<Reminder[]>("/reminders/schedule", {
      method: "POST",
      body: JSON.stringify(reminderData),
      headers: { Authorization: `Bearer ${token}` },
    }),

  getReminders: (patientId: string, token: string) =>
    request<Reminder[]>(`/reminders?patient_id=${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Hospitals & Emergency
  getNearbyHospitals: (lat: number, lng: number, token: string) =>
    request<Hospital[]>(`/hospitals/nearby?lat=${lat}&lng=${lng}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  triggerSOS: (sosData: { consultation_id?: string; latitude: number; longitude: number; trigger_keyword: string }, token: string) =>
    request<EmergencyAlert>("/emergency/sos", {
      method: "POST",
      body: JSON.stringify(sosData),
      headers: { Authorization: `Bearer ${token}` },
    }),

  getEmergencyAlerts: (token: string) =>
    request<EmergencyAlert[]>("/emergency/alerts", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Analytics
  getAnalytics: (token: string) =>
    request<{
      total_consultations: number;
      active_emergencies: number;
      average_latency_ms: number;
      language_distribution: Array<{ name: string; value: number }>;
      daily_consultations: Array<{ date: string; consultations: number }>;
      risk_classification_summary: Array<{ name: string; count: number }>;
    }>("/analytics/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
