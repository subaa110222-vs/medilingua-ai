from twilio.rest import Client
from ..config import settings

class TwilioService:
    def __init__(self):
        self.client = None
        if settings.TWILIO_SID and settings.TWILIO_AUTH_TOKEN:
            self.client = Client(settings.TWILIO_SID, settings.TWILIO_AUTH_TOKEN)

    def send_sms(self, to_phone: str, message: str) -> bool:
        """
        Dispatches standard SMS notifications.
        """
        if not self.client:
            print(f"[Twilio Mock SMS] Sending to {to_phone}: {message}")
            return True
        try:
            self.client.messages.create(
                body=message,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=to_phone
            )
            return True
        except Exception as e:
            print(f"Twilio SMS dispatch failed: {e}")
            return False

    def send_whatsapp(self, to_phone: str, message: str) -> bool:
        """
        Dispatches WhatsApp notifications.
        """
        formatted_to = f"whatsapp:{to_phone}" if not to_phone.startswith("whatsapp:") else to_phone
        if not self.client:
            print(f"[Twilio Mock WhatsApp] Sending to {formatted_to}: {message}")
            return True
        try:
            self.client.messages.create(
                body=message,
                from_=f"whatsapp:{settings.TWILIO_PHONE_NUMBER}",
                to=formatted_to
            )
            return True
        except Exception as e:
            print(f"Twilio WhatsApp dispatch failed: {e}")
            return False

twilio_service = TwilioService()
