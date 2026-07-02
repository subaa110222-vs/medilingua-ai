from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from db import get_db, EmergencyAlert, Patient, Hospital
from schemas import SOSCreate, EmergencyAlertResponse
from api.auth import get_current_user, User
from services.twilio_sms import twilio_service

router = APIRouter(prefix="/emergency", tags=["Emergency Alarms"])

@router.post("/sos", response_model=EmergencyAlertResponse)
def trigger_sos_alert(
    payload: SOSCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Register SOS Event
    db_alert = EmergencyAlert(
        consultation_id=payload.consultation_id,
        trigger_keyword=payload.trigger_keyword,
        status="Triggered"
    )
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)

    # In a real environment, dispatch Twilio SMS to nearest ambulance coordinators
    alert_msg = f"CRITICAL: Emergency SOS alarm triggered! Symptom flagged: '{payload.trigger_keyword}'. Coordinates: {payload.latitude}, {payload.longitude}."
    # Send emergency broadcast
    twilio_service.send_sms("+919840123456", alert_msg)

    return db_alert

@router.get("/alerts", response_model=List[EmergencyAlertResponse])
def get_sos_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    alerts = db.query(EmergencyAlert).order_by(EmergencyAlert.created_at.desc()).all()
    return alerts
