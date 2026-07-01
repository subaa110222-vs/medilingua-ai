from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Form
from sqlalchemy.orm import Session
from typing import Optional
from ..db import get_db, Prescription, Patient
from ..schemas import PrescriptionResponse
from .auth import get_current_user, User
from ..ai_engine import ai_engine
from ..services.supabase_store import supabase_store
import uuid

router = APIRouter(prefix="", tags=["Translation & OCR"])

@router.post("/prescriptions/ocr", response_model=PrescriptionResponse)
async def upload_and_parse_prescription(
    file: UploadFile = File(...),
    patient_id: str = Form(...),
    consultation_id: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify patient exists
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")

    # Read image bytes
    image_bytes = await file.read()
    file_name = f"{uuid.uuid4()}_{file.filename}"
    
    # Upload prescription image to Supabase Storage
    image_url = supabase_store.upload_file_bytes(image_bytes, file_name, folder="prescriptions")

    patient_profile = {
        "name": patient.full_name,
        "known_allergies": patient.known_allergies,
        "chronic_conditions": patient.chronic_conditions
    }

    # Run AI Vision OCR
    ocr_result = ai_engine.parse_prescription_ocr(image_url, patient_profile)

    # Save details to database
    db_prescription = Prescription(
        consultation_id=consultation_id,
        patient_id=patient_id,
        doctor_id=current_user.id,
        scanned_image_url=image_url,
        ocr_raw_text=ocr_result.get("ocr_raw_text"),
        medicines=ocr_result.get("medicines", []),
        risk_warnings=ocr_result.get("risk_warnings", [])
    )
    db.add(db_prescription)
    db.commit()
    db.refresh(db_prescription)
    return db_prescription
