from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from db import get_db, Consultation, Patient, TranscriptionLog
from schemas import ConsultationCreate, ConsultationResponse, TranscriptionLogResponse
from api.auth import get_current_user, User
from ai_engine import ai_engine

router = APIRouter(prefix="/consultations", tags=["Consultations"])

@router.post("/start", response_model=ConsultationResponse)
def start_consultation(
    payload: ConsultationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify patient exists
    patient = db.query(Patient).filter(Patient.id == payload.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")

    db_consult = Consultation(
        patient_id=payload.patient_id,
        doctor_id=current_user.id,
        patient_language=payload.patient_language,
        doctor_language=payload.doctor_language,
        status="Active"
    )
    db.add(db_consult)
    db.commit()
    db.refresh(db_consult)
    return db_consult

@router.post("/{id}/end", response_model=ConsultationResponse)
def end_consultation(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    consult = db.query(Consultation).filter(Consultation.id == id).first()
    if not consult:
        raise HTTPException(status_code=404, detail="Consultation session not found")

    # Fetch all logs of dialogue inside this session
    logs = db.query(TranscriptionLog).filter(TranscriptionLog.consultation_id == id).all()
    chat_history = [
        {"sender": log.sender, "original_text": log.original_text, "translated_text": log.translated_text}
        for log in logs
    ]

    # Fetch patient profile metadata for risk evaluation
    patient = db.query(Patient).filter(Patient.id == consult.patient_id).first()
    patient_profile = {
        "name": patient.full_name,
        "known_allergies": patient.known_allergies,
        "chronic_conditions": patient.chronic_conditions
    }

    # Generate SOAP clinical summary
    soap_summary = ai_engine.generate_soap_summary(chat_history, patient_profile)

    # Save summary and close session
    consult.status = "Completed"
    consult.soap_summary = soap_summary
    db.commit()
    db.refresh(consult)
    return consult

@router.get("/{id}", response_model=ConsultationResponse)
def get_consultation(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    consult = db.query(Consultation).filter(Consultation.id == id).first()
    if not consult:
        raise HTTPException(status_code=404, detail="Consultation not found")
    return consult

@router.get("/{id}/logs", response_model=List[TranscriptionLogResponse])
def get_consultation_logs(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logs = db.query(TranscriptionLog).filter(TranscriptionLog.consultation_id == id).all()
    return logs
