from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db, Hospital
from .auth import get_current_user, User
import math

router = APIRouter(prefix="/hospitals", tags=["Hospitals & PHCs"])

@router.get("/nearby", response_model=List[dict])
def get_nearby_hospitals(
    lat: float,
    lng: float,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Finds and orders nearby hospitals from coordinates using basic Haversine distance.
    Fails back to mock list if database tables are empty.
    """
    hospitals = db.query(Hospital).all()
    if not hospitals:
        # Mock responses
        return [
            {
                "id": "h1",
                "name": "Kancheepuram Government General Hospital",
                "type": "District Hospital",
                "address": "General Hospital Road, Kancheepuram, Tamil Nadu 631501",
                "phone_number": "+91 44 2722 2444",
                "latitude": 12.9716,
                "longitude": 77.5946,
                "distance": "2.4 km"
            },
            {
                "id": "h2",
                "name": "Arogya Primary Health Centre (PHC)",
                "type": "PHC",
                "address": "Bazaar Street, Damal Village, Kancheepuram, Tamil Nadu 631502",
                "phone_number": "+91 44 2729 1100",
                "latitude": 12.9816,
                "longitude": 77.6046,
                "distance": "8.1 km"
            }
        ]

    results = []
    for h in hospitals:
        # Basic Haversine Distance
        rad_lat1 = math.radians(lat)
        rad_lat2 = math.radians(h.latitude or 0.0)
        diff_lat = rad_lat2 - rad_lat1
        diff_lng = math.radians((h.longitude or 0.0) - lng)
        a = math.sin(diff_lat / 2)**2 + math.cos(rad_lat1) * math.cos(rad_lat2) * math.sin(diff_lng / 2)**2
        c = 2 * math.asin(math.sqrt(a))
        distance_km = 6371 * c
        
        results.append({
            "id": str(h.id),
            "name": h.name,
            "type": h.type,
            "address": h.address,
            "phone_number": h.phone_number,
            "latitude": h.latitude,
            "longitude": h.longitude,
            "distance": f"{round(distance_km, 1)} km"
        })

    # Sort by distance
    results.sort(key=lambda x: float(x["distance"].split(" ")[0]))
    return results
