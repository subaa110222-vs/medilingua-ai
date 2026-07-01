from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db, Reminder, Prescription, Patient
from ..schemas import ReminderCreate, ReminderResponse
from .auth import get_current_user, User
from ..services.twilio_sms import twilio_service
import datetime

router = APIRouter(prefix="/reminders", tags=["Medicine Reminders"])

@router.post("/schedule", response_model=List[ReminderResponse])
def schedule_patient_reminders(
    payload: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.id == payload.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Define standard reminder schedules
    # (In production, map actual drug intake frequencies like 1-0-1 to specific times)
    db_reminder = Reminder(
        patient_id=payload.patient_id,
        prescription_id=payload.prescription_id,
        medicine_name=payload.medicine_name,
        dosage_time=payload.dosage_time,
        reminder_type=payload.reminder_type,
        language=payload.language,
        status="Active"
    )
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)

    # Send confirmation SMS / WhatsApp alerts
    msg = f"MediLingua: Reminders scheduled for {payload.medicine_name} at {payload.dosage_time} in {payload.language}."
    if payload.reminder_type == "WhatsApp":
        twilio_service.send_whatsapp(patient.phone_number, msg)
    else:
        twilio_service.send_sms(patient.phone_number, msg)

    return [db_reminder]

@router.get("", response_model=List[ReminderResponse])
def get_reminders(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reminders = db.query(Reminder).filter(Reminder.patient_id == patient_id).all()
    return reminders
