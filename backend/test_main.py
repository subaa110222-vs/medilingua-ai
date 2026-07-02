import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db import Base, get_db, User, Patient
from main import app

# Setup test in-memory database instance
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Bind temporary session dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def run_around_tests():
    # Setup database tables
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    # Insert mock doctor bypass user
    mock_doctor = User(
        id="mock-doctor",
        email="doctor.patel@government.in",
        first_name="Rajesh",
        last_name="Patel",
        role="Doctor",
        preferred_language="English"
    )
    db.add(mock_doctor)
    db.commit()
    db.close()
    
    yield
    # Tear down tables
    Base.metadata.drop_all(bind=engine)

def test_sync_user():
    payload = {
        "id": "user_clerk_test",
        "email": "test-doctor@hospital.gov.in",
        "first_name": "Test",
        "last_name": "Doctor",
        "role": "Doctor",
        "preferred_language": "English"
    }
    response = client.post("/api/v1/auth/sync", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test-doctor@hospital.gov.in"
    assert data["first_name"] == "Test"

def test_create_and_search_patient():
    # 1. Create Patient
    patient_payload = {
        "full_name": "Muthu Krishnan",
        "date_of_birth": "1964-07-01",
        "gender": "Male",
        "phone_number": "9840123456",
        "primary_language": "Tamil",
        "known_allergies": ["Penicillin"],
        "chronic_conditions": ["Hypertension"]
    }
    headers = {"Authorization": "Bearer mock-auth-token"}
    
    response = client.post("/api/v1/patients", json=patient_payload, headers=headers)
    assert response.status_code == 201
    patient_data = response.json()
    assert patient_data["full_name"] == "Muthu Krishnan"
    assert "id" in patient_data

    # 2. Search Patient
    search_response = client.get("/api/v1/patients/search?query=Muthu", headers=headers)
    assert search_response.status_code == 200
    results = search_response.json()
    assert len(results) >= 1
    assert results[0]["phone_number"] == "9840123456"

def test_consultation_endpoints():
    headers = {"Authorization": "Bearer mock-auth-token"}
    db = TestingSessionLocal()
    
    # Pre-populate patient
    patient = Patient(
        full_name="Muthu Krishnan",
        date_of_birth=datetime_helper(),
        gender="Male",
        phone_number="9840123456",
        primary_language="Tamil"
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    patient_id = str(patient.id)
    db.close()

    # Start Consultation
    consult_payload = {
        "patient_id": patient_id,
        "patient_language": "Tamil",
        "doctor_language": "English"
    }
    response = client.post("/api/v1/consultations/start", json=consult_payload, headers=headers)
    assert response.status_code == 200
    consult_data = response.json()
    assert consult_data["status"] == "Active"
    consult_id = consult_data["id"]

    # End Consultation
    end_response = client.post(f"/api/v1/consultations/{consult_id}/end", headers=headers)
    assert end_response.status_code == 200
    end_data = end_response.json()
    assert end_data["status"] == "Completed"
    assert "soap_summary" in end_data

def datetime_helper():
    import datetime
    return datetime.date(1964, 7, 1)
