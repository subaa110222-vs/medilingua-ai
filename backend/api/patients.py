from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from db import get_db, Patient, Consultation
from schemas import PatientCreate, PatientResponse, ConsultationResponse
from api.auth import get_current_user, User

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(
    patient_data: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Ensure patient phone is unique within this PHC region
    existing = db.query(Patient).filter(Patient.phone_number == patient_data.phone_number).first()
    if existing:
        return existing
        
    db_patient = Patient(**patient_data.dict())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.get("/search", response_model=List[PatientResponse])
def search_patients(
    query: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Search patient listings by name, phone, or primary language.
    """
    results = db.query(Patient).filter(
        (Patient.full_name.ilike(f"%{query}%")) | 
        (Patient.phone_number.like(f"%{query}%"))
    ).limit(10).all()
    return results

@router.get("/{patient_id}/history", response_model=List[ConsultationResponse])
def get_patient_consultation_history(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    history = db.query(Consultation).filter(
        Consultation.patient_id == patient_id
    ).order_by(Consultation.created_at.desc()).all()
    return history
