from sqlalchemy import create_engine, Column, String, Boolean, DateTime, ForeignKey, Double, Time, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import uuid
import datetime
from config import settings

# Setup SQLAlchemy connection
# If connection to PostgreSQL fails, automatically fallback to local SQLite database file
try:
    if settings.DATABASE_URL.startswith("postgresql"):
        engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
        # Try to connect
        conn = engine.connect()
        conn.close()
    else:
        raise ValueError("Use SQLite")
except Exception as e:
    print(f"PostgreSQL connection failed or bypassed. Falling back to local SQLite: {e}")
    # Local SQLite fallback
    engine = create_engine("sqlite:///./medilingua.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 1. HOSPITALS MODEL
class Hospital(Base):
    __tablename__ = "hospitals"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False) # 'PHC', 'Ambulance', etc.
    address = Column(Text, nullable=False)
    latitude = Column(Double, nullable=True)
    longitude = Column(Double, nullable=True)
    phone_number = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    users = relationship("User", back_populates="hospital")
    emergency_alerts = relationship("EmergencyAlert", back_populates="hospital")

# 2. USERS (DOCTORS / HEALTH WORKERS) MODEL
class User(Base):
    __tablename__ = "users"
    id = Column(String(255), primary_key=True) # Linked to Clerk ID
    email = Column(String(255), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=True)
    role = Column(String(50), nullable=False) # 'Doctor', 'Nurse', 'Rural Health Worker'
    hospital_id = Column(String(36), ForeignKey("hospitals.id", ondelete="SET NULL"), nullable=True)
    preferred_language = Column(String(50), default="English")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    hospital = relationship("Hospital", back_populates="users")
    consultations = relationship("Consultation", back_populates="doctor")
    prescriptions = relationship("Prescription", back_populates="doctor")

# 3. PATIENTS MODEL
class Patient(Base):
    __tablename__ = "patients"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String(255), nullable=False)
    date_of_birth = Column(DateTime, nullable=False)
    gender = Column(String(20), nullable=False)
    blood_group = Column(String(5), nullable=True)
    chronic_conditions = Column(JSON, nullable=True) # Compatible list format
    known_allergies = Column(JSON, nullable=True)     # Compatible list format
    pregnancy_status = Column(Boolean, default=False)
    primary_language = Column(String(50), nullable=False, default="Tamil")
    phone_number = Column(String(15), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    consultations = relationship("Consultation", back_populates="patient", cascade="all, delete-orphan")
    prescriptions = relationship("Prescription", back_populates="patient", cascade="all, delete-orphan")
    reminders = relationship("Reminder", back_populates="patient", cascade="all, delete-orphan")
    emergency_alerts = relationship("EmergencyAlert", back_populates="patient", cascade="all, delete-orphan")

# 4. CONSULTATIONS MODEL
class Consultation(Base):
    __tablename__ = "consultations"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String(36), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    doctor_id = Column(String(255), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    patient_language = Column(String(50), nullable=False)
    doctor_language = Column(String(50), nullable=False, default="English")
    status = Column(String(50), default="Active") # 'Active', 'Completed', 'Emergency'
    audio_log_url = Column(Text, nullable=True)
    soap_summary = Column(JSON, nullable=True) # {subjective, objective, assessment, plan}
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    patient = relationship("Patient", back_populates="consultations")
    doctor = relationship("User", back_populates="consultations")
    transcription_logs = relationship("TranscriptionLog", back_populates="consultation", cascade="all, delete-orphan")
    prescriptions = relationship("Prescription", back_populates="consultation")
    emergency_alerts = relationship("EmergencyAlert", back_populates="consultation", cascade="all, delete-orphan")

# 5. TRANSCRIPTION LOGS MODEL
class TranscriptionLog(Base):
    __tablename__ = "transcription_logs"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    consultation_id = Column(String(36), ForeignKey("consultations.id", ondelete="CASCADE"), nullable=False)
    sender = Column(String(10), nullable=False) # 'Patient' or 'Doctor'
    original_text = Column(Text, nullable=False)
    translated_text = Column(Text, nullable=False)
    audio_translation_url = Column(Text, nullable=True)
    is_risk_detected = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    consultation = relationship("Consultation", back_populates="transcription_logs")

# 6. PRESCRIPTIONS MODEL
class Prescription(Base):
    __tablename__ = "prescriptions"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    consultation_id = Column(String(36), ForeignKey("consultations.id", ondelete="SET NULL"), nullable=True)
    patient_id = Column(String(36), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    doctor_id = Column(String(255), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    scanned_image_url = Column(Text, nullable=True)
    ocr_raw_text = Column(Text, nullable=True)
    medicines = Column(JSON, nullable=False) # List: [{"name": "", "dosage": "", "duration": "", "explanation": ""}]
    risk_warnings = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    consultation = relationship("Consultation", back_populates="prescriptions")
    patient = relationship("Patient", back_populates="prescriptions")
    doctor = relationship("User", back_populates="prescriptions")
    reminders = relationship("Reminder", back_populates="prescription", cascade="all, delete-orphan")

# 7. REMINDERS MODEL
class Reminder(Base):
    __tablename__ = "reminders"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String(36), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    prescription_id = Column(String(36), ForeignKey("prescriptions.id", ondelete="CASCADE"), nullable=True)
    medicine_name = Column(String(255), nullable=False)
    dosage_time = Column(Time, nullable=False)
    reminder_type = Column(String(20), nullable=False) # 'WhatsApp', 'SMS', 'Voice Call'
    language = Column(String(50), nullable=False, default="Tamil")
    status = Column(String(20), default="Active") # 'Active', 'Paused', 'Completed'
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    patient = relationship("Patient", back_populates="reminders")
    prescription = relationship("Prescription", back_populates="reminders")

# 8. EMERGENCY ALERTS MODEL
class EmergencyAlert(Base):
    __tablename__ = "emergency_alerts"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    consultation_id = Column(String(36), ForeignKey("consultations.id", ondelete="CASCADE"), nullable=True)
    patient_id = Column(String(36), ForeignKey("patients.id", ondelete="CASCADE"), nullable=True)
    hospital_id = Column(String(36), ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=True)
    trigger_keyword = Column(String(255), nullable=False)
    status = Column(String(20), default="Triggered") # 'Triggered', 'Acknowledged', 'Dispatched', 'Resolved'
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    consultation = relationship("Consultation", back_populates="emergency_alerts")
    patient = relationship("Patient", back_populates="emergency_alerts")
    hospital = relationship("Hospital", back_populates="emergency_alerts")
