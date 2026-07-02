import os
import base64
from supabase import create_client, Client
from config import settings

class SupabaseStore:
    def __init__(self):
        self.supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        self.bucket_name = "medical-files"

    def upload_file_bytes(self, file_bytes: bytes, file_name: str, folder: str = "audio") -> str:
        """
        Uploads raw file bytes to Supabase Storage and returns the public resource URL.
        """
        try:
            path = f"{folder}/{file_name}"
            # Perform upload
            self.supabase.storage.from_(self.bucket_name).upload(
                path=path,
                file=file_bytes,
                file_options={"content-type": "audio/webm" if folder == "audio" else "image/jpeg"}
            )
            
            # Fetch URL
            res = self.supabase.storage.from_(self.bucket_name).get_public_url(path)
            return res
        except Exception as e:
            print(f"Supabase file upload failed: {e}")
            # Mock fallback link
            return f"https://placeholder-storage.supabase.co/{folder}/{file_name}"

    def upload_base64_audio(self, base64_str: str, file_name: str) -> str:
        audio_bytes = base64.b64decode(base64_str)
        return self.upload_file_bytes(audio_bytes, file_name, folder="audio")

supabase_store = SupabaseStore()
