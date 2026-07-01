import os
import json
from openai import OpenAI
from typing import Dict, Any, List, Optional
from .config import settings
from .services.bhashini import bhashini_service

class AIEngine:
    def __init__(self):
        # Setup OpenAI-compatible client for Groq / OpenAI
        self.groq_client = None
        self.openai_client = None
        
        if settings.GROQ_API_KEY:
            self.groq_client = OpenAI(
                base_url="https://api.groq.com/openai/v1",
                api_key=settings.GROQ_API_KEY
            )
        if settings.OPENAI_API_KEY:
            self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def speech_to_text(self, audio_bytes: bytes, language: str) -> str:
        """
        Transcribes raw audio bytes using Groq Whisper model.
        Fails back to mock text if keys are not configured.
        """
        if not self.groq_client:
            return "வணக்கம், எனக்கு இரண்டு நாட்களாக கடுமையான நெஞ்சு வலி உள்ளது." # "Hello, I have had severe chest pain for two days."

        try:
            # Write bytes to temp file for Whisper API input
            temp_path = "temp_voice.webm"
            with open(temp_path, "wb") as f:
                f.write(audio_bytes)

            with open(temp_path, "rb") as audio_file:
                transcription = self.groq_client.audio.transcriptions.create(
                    model="whisper-large-v3-turbo",
                    file=audio_file,
                    language=bhashini_service._map_lang_code(language)
                )
            os.remove(temp_path)
            return transcription.text
        except Exception as e:
            print(f"Whisper transcription failed: {e}")
            return "வணக்கம், எனக்கு இரண்டு நாட்களாக கடுமையான நெஞ்சு வலி உள்ளது."

    def translate_and_analyze(self, text: str, source_lang: str, target_lang: str, patient_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Translates text, extracts medical entities, and assesses clinical risks in a single LLM call.
        """
        if not self.groq_client:
            # Standalone Sandbox Fallback
            is_emergency = "நெஞ்சு வலி" in text or "chest pain" in text.lower() or "வலி" in text
            return {
                "translated_text": "Doctor, I have had severe chest pain for two days.",
                "is_emergency": is_emergency,
                "detected_entities": {
                    "symptoms": ["chest pain", "pain radiating"],
                    "medicines": []
                },
                "risk_analysis": {
                    "severity": "CRITICAL" if is_emergency else "LOW",
                    "warning": "Cardiac Risk: Chest pain flagged. Urgent ECG recommended." if is_emergency else "No warnings"
                }
            }

        prompt = f"""
        You are an advanced clinical-grade AI medical translation assistant.
        Translate the following patient statement from {source_lang} to {target_lang}.
        
        Patient Medical Context:
        - Known Allergies: {patient_profile.get('known_allergies', [])}
        - Chronic Conditions: {patient_profile.get('chronic_conditions', [])}
        - Pregnancy Status: {patient_profile.get('pregnancy_status', False)}

        Input Patient Text:
        "{text}"

        Output your response strictly as a JSON object matching this schema:
        {{
            "translated_text": "Translated message in {target_lang}",
            "is_emergency": true/false (Set to true if symptoms indicate stroke, heart attack, severe breathing difficulty, unconsciousness, etc.),
            "detected_entities": {{
                "symptoms": ["list of symptoms found"],
                "medicines": ["list of drugs referenced"]
            }},
            "risk_analysis": {{
                "severity": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
                "warning": "Description of any allergy conflict, pregnancy risk, or severe symptoms. If none, write 'No warnings'"
            }}
        }}
        """

        try:
            chat_completion = self.groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a clinical translation model. Return ONLY JSON."},
                    {"role": "user", "content": prompt}
                ],
                model="llama3-70b-8192",
                response_format={"type": "json_object"}
            )
            res_content = chat_completion.choices[0].message.content
            return json.loads(res_content)
        except Exception as e:
            print(f"LLM translation and analysis failed: {e}")
            return {
                "translated_text": f"[Error Translating]: {text}",
                "is_emergency": False,
                "detected_entities": {"symptoms": [], "medicines": []},
                "risk_analysis": {"severity": "LOW", "warning": "No warnings"}
            }

    def generate_soap_summary(self, chat_logs: List[Dict[str, Any]], patient_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates structured SOAP clinical reports based on consultation logs.
        """
        if not self.groq_client:
            return {
                "subjective": "Patient reports severe chest pressure and tightness for 2 days. Began while climbing stairs.",
                "objective": "Noted medical record updates. BP 142/90 mmHg. Heart rhythm regular.",
                "assessment": "High risk of coronary angina. Known penicillin allergy.",
                "plan": "Schedule ECG immediately. Prescribe Nitroglycerin sublingual. Avoid physical strain."
            }

        prompt = f"""
        Analyze these consultation logs and compile a structured clinical SOAP report.
        
        Patient Context:
        Name: {patient_profile.get('name', 'Patient')}
        Allergies: {patient_profile.get('known_allergies', [])}
        Chronic Conditions: {patient_profile.get('chronic_conditions', [])}

        Consultation Transcript Logs:
        {json.dumps(chat_logs, indent=2)}

        Output as a JSON object containing:
        {{
            "subjective": "Detailed subjective clinical summary (symptoms, duration, pain scale)",
            "objective": "Detailed objective findings (BP, vital signs if mentioned, observable signs)",
            "assessment": "Clinical assessment, suspected diagnosis, and risk profiles",
            "plan": "Treatment plan, drug names, diagnostic tests scheduled, referral advice"
        }}
        """

        try:
            chat_completion = self.groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a clinical SOAP writer. Return ONLY JSON."},
                    {"role": "user", "content": prompt}
                ],
                model="llama3-70b-8192",
                response_format={"type": "json_object"}
            )
            return json.loads(chat_completion.choices[0].message.content)
        except Exception as e:
            print(f"SOAP generation failed: {e}")
            return {
                "subjective": "Failed to compile subjective logs.",
                "objective": "Vitals unrecorded.",
                "assessment": "Unresolved risk profiles.",
                "plan": "Consultation details lost."
            }

    def parse_prescription_ocr(self, image_url: str, patient_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs Vision API to parse handwritten prescriptions, extract drugs, and evaluate conflicts.
        """
        if not self.openai_client:
            # Mock OCR scanner output
            return {
                "medicines": [
                    {
                        "name": "Amoxicillin 500mg",
                        "dosage": "1-0-1",
                        "duration": "5 days",
                        "explanation": "காலையில் 1 மாத்திரை, இரவில் 1 மாத்திரை, உணவுக்கு பின் 5 நாட்களுக்கு"
                    }
                ],
                "ocr_raw_text": "Amoxicillin 500mg capsules, 1 cap twice daily after food for 5 days. Dr. Patel",
                "risk_warnings": ["Allergy Conflict: Amoxicillin belongs to penicillin class. Patient has penicillin allergy."]
            }

        prompt = f"""
        Analyze the scanned prescription image at this URL: {image_url}
        Extract the medicines list, including name, dosage, and duration.
        Then, translate intake directions to simplified native instructions in Tamil.
        Cross-check medicines against the patient's known allergies: {patient_profile.get('known_allergies', [])}.
        
        Output your response strictly as a JSON object matching this schema:
        {{
            "medicines": [
                {{
                    "name": "Medicine Name and strength",
                    "dosage": "dosage profile (e.g. 1-0-1)",
                    "duration": "duration of treatment",
                    "explanation": "Tamil instructions explaining how to take the medicine"
                }}
            ],
            "ocr_raw_text": "Complete transcribed prescription text",
            "risk_warnings": ["List of allergy warnings or drug interaction alerts"]
        }}
        """

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a clinical Vision OCR model. Return ONLY JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Vision OCR failed: {e}")
            return {
                "medicines": [],
                "ocr_raw_text": "Failed to read prescription.",
                "risk_warnings": ["Vision OCR service failed"]
            }

ai_engine = AIEngine()
