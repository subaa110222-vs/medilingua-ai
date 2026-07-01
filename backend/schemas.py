from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import date, time, datetime

# 1. USER SCHEMAS
class UserBase(BaseModel):
    id: str
    email: EmailStr
    first_name: str
    last_name: Optional[str] = None
    role: str
    hospital_id: Optional[str] = None
    preferred_language: str = "English"

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# 2. PATIENT SCHEMAS
class PatientBase(BaseModel):
    full_name: str
    date_of_birth: date
    gender: str
    blood_group: Optional[str] = None
    chronic_conditions: List[str] = []
    known_allergies: List[str] = []
    pregnancy_status: bool = False
    primary_language: str = "Tamil"
    phone_number: str

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# 3. CONSULTATION SCHEMAS
class ConsultationCreate(BaseModel):
    patient_id: str
    patient_language: str
    doctor_language: str = "English"

class ConsultationResponse(BaseModel):
    id: str
    patient_id: str
    doctor_id: str
    patient_language: str
    doctor_language: str
    status: str
    audio_log_url: Optional[str] = None
    soap_summary: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

# 4. TRANSCRIPTION SCHEMAS
class TranscriptionLogResponse(BaseModel):
    id: str
    consultation_id: str
    sender: str
    original_text: str
    translated_text: str
    audio_translation_url: Optional[str] = None
    is_risk_detected: bool
    created_at: datetime

    class Config:
        from_attributes = True

# 5. PRESCRIPTION SCHEMAS
class MedicineItem(BaseModel):
    name: str
    dosage: str
    duration: str
    explanation: str

class PrescriptionCreate(BaseModel):
    consultation_id: Optional[str] = None
    patient_id: str
    medicines: List[MedicineItem]
    scanned_image_url: Optional[str] = None
    ocr_raw_text: Optional[str] = None
    risk_warnings: List[str] = []

class PrescriptionResponse(BaseModel):
    id: str
    consultation_id: Optional[str] = None
    patient_id: str
    doctor_id: Optional[str] = None
    scanned_image_url: Optional[str] = None
    ocr_raw_text: Optional[str] = None
    medicines: List[Dict[str, Any]]
    risk_warnings: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

# 6. REMINDER SCHEMAS
class ReminderCreate(BaseModel):
    patient_id: str
    prescription_id: Optional[str] = None
    medicine_name: str
    dosage_time: time
    reminder_type: str
    language: str = "Tamil"

class ReminderResponse(ReminderCreate):
    id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# 7. EMERGENCY ALERT SCHEMAS
class SOSCreate(BaseModel):
    consultation_id: Optional[str] = None
    latitude: float
    longitude: float
    trigger_keyword: str

class EmergencyAlertResponse(BaseModel):
    id: str
    consultation_id: Optional[str] = None
    patient_id: Optional[str] = None
    hospital_id: Optional[str] = None
    trigger_keyword: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# 8. ANALYTICS RESPONSE
class AnalyticsResponse(BaseModel):
    total_consultations: int
    active_emergencies: int
    average_latency_ms: int
    language_distribution: List[Dict[str, Any]]
    daily_consultations: List[Dict[str, Any]]
    risk_classification_summary: List[Dict[str, Any]]
