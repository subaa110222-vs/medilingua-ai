# MediLingua AI - Hackathon Judge Q&A Playbook

This playbook prepares the team for potential cross-examination by technical, clinical, and business judges at the India Runs Ideathon 2026.

---

## 1. Technical & AI Questions

### Q1: How do you handle regional Indian dialects and slang that general translation models miss?
* **Answer**: "General translation models look for standard literary syntax. MediLingua AI solves this in two ways:
  1. **Government Integration**: We leverage India's official **Bhashini API**, which is explicitly trained on conversational datasets from rural districts.
  2. **Contextual LLM Translation**: Instead of simple direct translation, our system passes speech transcripts to a medical-domain-prompted Llama-3-70B model. The prompt instructs the LLM to map regional descriptions of pain (e.g., Tamil 'நெஞ்சை அடைப்பது போல் இருக்கு' meaning 'feels like my chest is being squeezed') to clinical terminology ('tightness/pressure in chest') rather than translating it literally."

### Q2: Speech-to-Speech translation is notoriously slow. How do you keep latency low enough for a fluid doctor-patient conversation?
* **Answer**: "We optimize for low latency through three architectures:
  1. **WebSocket Streaming**: We stream audio in tiny WebM/PCM chunks instead of waiting for the user to finish speaking.
  2. **Groq Inference**: We run our STT (Whisper-large-v3-turbo) and LLM translation on Groq hardware, which delivers token generation speeds exceeding 250 tokens/sec.
  3. **Parallel Pipeline**: As soon as the first sentence transcript is generated, we begin translation and TTS synthesis, overlapping execution so the perceived latency between turns is under 1.2 seconds."

### Q3: How does the Offline Mode actually work in a remote village clinic without internet access?
* **Answer**: "In offline mode, we shift execution from the cloud APIs to a localized **Edge Server Gateway** (a low-cost mini-PC or laptop placed in the PHC clinic). 
  - The Edge Server runs a quantized **Whisper-Tiny** model for STT.
  - A local quantized **Llama-3-8B-Instruct** model via Ollama handles the translation and entity recognition.
  - Local **Espeak-NG / ONNX TTS** converts the text back to speech.
  - Data syncs back to the central database as soon as a rural worker connects to a 3G/4G network at the end of the day."

---

## 2. Clinical & Safety Questions

### Q4: If the AI makes a translation mistake, it could result in the wrong dosage or misdiagnosis. Who is liable, and how do you prevent medical errors?
* **Answer**: "AI does not replace the doctor; it assists them. We have built-in safety guardrails:
  1. **Co-pilot Mode**: The doctor sees both the translated text and the extracted clinical entities (symptoms, drugs, dosage) on screen. They must approve the auto-generated prescription.
  2. **Patient Double-Check**: Before a prescription is saved, the system displays the dosage instructions in the patient's language on the tablet or screen, and reads it aloud (e.g., 'Take 1 tablet after food'). The patient confirms they understand.
  3. **Entity Verification**: If there's an ambiguity (e.g., 'Take after food' translated incorrectly), the doctor can manually edit the prescription immediately in the app interface."

### Q5: How does the AI detect medical risks like drug allergies or pregnancy risks?
* **Answer**: "When a patient profile is selected, their medical history (chronic diseases, allergies, pregnancy status) is loaded into the active session context. When the doctor speaks a drug name (e.g., 'Amoxicillin'), the backend's Named Entity Recognition (NER) parser extracts the drug name and cross-references it with the patient's allergy array. If a conflict is found (e.g., Penicillin allergy), it flags a prominent visual alert on the doctor's dashboard: *'Allergy Risk: Amoxicillin is a penicillin derivative!'*"

---

## 3. Business & Scalability Questions

### Q6: How do you plan to scale this inside the government primary healthcare system?
* **Answer**: "We align directly with the **Ayushman Bharat Digital Mission (ABDM)**. We store data using ABDM standards (FHIR compliant records) and integrate with the Ayushman Bharat Health Account (ABHA ID). This allows doctors to pull patient profiles instantly. By offering a subscription model per district health network, we integrate with state-sponsored e-health setups, making it zero-cost to individual rural patients."

### Q7: What is your plan to expand to other regional languages?
* **Answer**: "Our backend is decoupled from the language translation engine. By relying on Bhashini and Groq APIs, adding support for a new language only requires updating the UI language selector. The underlying prompt system automatically translates any new language supported by the LLM and STT models, ensuring we can cover 22 scheduled Indian languages with minimal code changes."
