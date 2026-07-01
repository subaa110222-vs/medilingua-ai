import requests
import json
import base64
from typing import Dict, Any, Optional

BHASHINI_ULCA_URL = "https://meity-auth.ulcacognitive.org/ulca/apis/v0/model/getModelsPipeline"
BHASHINI_INFERENCE_URL = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"

class BhashiniService:
    def __init__(self, user_id: str = "", apiKey: str = "", authorization: str = ""):
        self.user_id = user_id
        self.apiKey = apiKey
        self.authorization = authorization

    def translate_text(self, text: str, source_lang: str, target_lang: str) -> str:
        """
        Translates text from source Indian language to target Indian language using Bhashini.
        Fails back to mock translation if keys are not set.
        """
        if not self.apiKey or not self.user_id:
            # Mock translator fallback
            return self._mock_translation(text, source_lang, target_lang)

        headers = {
            "Content-Type": "application/json",
            "userID": self.user_id,
            "ulcaApiKey": self.apiKey,
            "Authorization": self.authorization
        }

        payload = {
            "pipelineTasks": [
                {
                    "taskType": "translation",
                    "config": {
                        "language": {
                            "sourceLanguage": self._map_lang_code(source_lang),
                            "targetLanguage": self._map_lang_code(target_lang)
                        }
                    }
                }
            ],
            "inputData": {
                "input": [{"source": text}]
            }
        }

        try:
            res = requests.post(BHASHINI_INFERENCE_URL, json=payload, headers=headers, timeout=5)
            if res.status_code == 200:
                data = res.json()
                translated = data["pipelineResponse"][0]["output"][0]["target"]
                return translated
        except Exception as e:
            print(f"Bhashini translate request failed: {e}")
            
        return self._mock_translation(text, source_lang, target_lang)

    def text_to_speech(self, text: str, target_lang: str) -> Optional[str]:
        """
        Converts translated text into natural audio using Bhashini TTS.
        Returns a base64 encoded audio string or None.
        """
        if not self.apiKey:
            return None

        headers = {
            "Content-Type": "application/json",
            "userID": self.user_id,
            "ulcaApiKey": self.apiKey,
            "Authorization": self.authorization
        }

        payload = {
            "pipelineTasks": [
                {
                    "taskType": "tts",
                    "config": {
                        "language": {
                            "sourceLanguage": self._map_lang_code(target_lang)
                        },
                        "gender": "female"
                    }
                }
            ],
            "inputData": {
                "input": [{"source": text}]
            }
        }

        try:
            res = requests.post(BHASHINI_INFERENCE_URL, json=payload, headers=headers, timeout=5)
            if res.status_code == 200:
                data = res.json()
                audio_content = data["pipelineResponse"][0]["audio"][0]["audioContent"]
                return audio_content
        except Exception as e:
            print(f"Bhashini TTS request failed: {e}")
            
        return None

    def _map_lang_code(self, lang: str) -> str:
        mapping = {
            "Tamil": "ta",
            "Telugu": "te",
            "Kannada": "kn",
            "Malayalam": "ml",
            "Hindi": "hi",
            "Bengali": "bn",
            "Marathi": "mr",
            "Gujarati": "gu",
            "Punjabi": "pa",
            "Odia": "or",
            "Assamese": "as",
            "Urdu": "ur",
            "English": "en"
        }
        return mapping.get(lang, "en")

    def _mock_translation(self, text: str, src: str, tgt: str) -> str:
        # Simple static rules for offline mock demonstration
        txt_lower = text.lower()
        if src == "Tamil" and "வலி" in text:
            return "Doctor, I have severe pain in my chest."
        if src == "English" and "pain" in txt_lower:
            return "உங்களுக்கு நெஞ்சு வலி எப்போது தொடங்கியது?" # "When did you get chest pain?"
        if src == "Hindi" and "खांसी" in text:
            return "Doctor, I have a dry cough for three days."
        return f"[Translated from {src} to {tgt}]: {text}"

bhashini_service = BhashiniService()
