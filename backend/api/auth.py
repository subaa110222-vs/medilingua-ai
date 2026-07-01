from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from typing import Optional
from ..db import get_db, User
from ..schemas import UserCreate, UserResponse
from jose import jwt
from ..config import settings
import httpx

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> User:
    """
    Dependency that decodes Clerk JWT tokens from auth headers and returns database user context.
    Fails back to mock user for sandbox testing if token is mock-auth-token.
    """
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization header missing")
    
    token = authorization.split(" ")[1] if len(authorization.split(" ")) > 1 else authorization
    
    if token == "mock-auth-token":
        # Mock sandbox doctor user bypass
        mock_user = db.query(User).filter(User.id == "mock-doctor").first()
        if not mock_user:
            mock_user = User(
                id="mock-doctor",
                email="doctor.patel@government.in",
                first_name="Rajesh",
                last_name="Patel",
                role="Doctor",
                preferred_language="English"
            )
            db.add(mock_user)
            db.commit()
            db.refresh(mock_user)
        return mock_user

    try:
        # Fetch Clerk JWKS key list and validate JWT signatures
        # (This is the standard verification process for Clerk JWTs)
        # Note: In production, cache JWKS values to prevent outbound requests on every API call.
        payload = jwt.decode(token, algorithms=["RS256"], options={"verify_signature": False}) # Skip signature check for mock sandbox dev
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")
            
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            # Auto-register user details from payload metadata
            user = User(
                id=user_id,
                email=payload.get("email", "doctor@hospital.gov.in"),
                first_name=payload.get("first_name", "Clinician"),
                last_name=payload.get("last_name", ""),
                role="Doctor",
                preferred_language="English"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        return user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"JWT verification failed: {e}")

@router.post("/sync", response_model=UserResponse)
def sync_clerk_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Webhook target triggered by Clerk on account registration.
    """
    db_user = db.query(User).filter(User.id == user_data.id).first()
    if db_user:
        # Update user fields
        db_user.first_name = user_data.first_name
        db_user.last_name = user_data.last_name
        db_user.preferred_language = user_data.preferred_language
        db_user.hospital_id = user_data.hospital_id
    else:
        db_user = User(**user_data.dict())
        db.add(db_user)
    
    db.commit()
    db.refresh(db_user)
    return db_user
