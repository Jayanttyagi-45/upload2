from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import urllib.request
import json
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = FastAPI(title="Video Upload Webhook Listener")

# Configure CORS so the Next.js frontend can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for deployment flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContactForm(BaseModel):
    name: str
    email: str
    subject: str
    message: str

@app.get("/")
def read_root():
    return {"status": "Backend is running!"}

@app.get("/api/videos")
async def get_videos():
    # Providing highly reliable, working public URLs for playback testing without 403 errors
    return [
        {
            "id": "1",
            "title": "Big Buck Bunny Trailer.mp4",
            "size": "11 MB",
            "duration": "00:33",
            "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/640px-Big_buck_bunny_poster_big.jpg",
            "url": "https://media.w3.org/2010/05/bunny/trailer.mp4"
        },
        {
            "id": "2",
            "title": "Sintel Trailer.mp4",
            "size": "4 MB",
            "duration": "00:52",
            "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Sintel_Poster.jpg/640px-Sintel_Poster.jpg",
            "url": "https://media.w3.org/2010/05/sintel/trailer.mp4"
        }
    ]

@app.post("/api/contact")
async def handle_contact_form(form: ContactForm):
    try:
        sendgrid_api_key = os.getenv("SENDGRID_API_KEY")
        sender_email = os.getenv("SENDGRID_SENDER_EMAIL")
        
        if sendgrid_api_key and sender_email and sendgrid_api_key != "your_api_key_here":
            # Send real email using SendGrid HTTP API (Port 443 - NEVER blocked by Render)
            url = "https://api.sendgrid.com/v3/mail/send"
            headers = {
                "Authorization": f"Bearer {sendgrid_api_key}",
                "Content-Type": "application/json"
            }
            data = {
                "personalizations": [{"to": [{"email": form.email}]}],
                "from": {"email": sender_email},
                "subject": f"Contact Form: {form.subject}",
                "content": [{"type": "text/plain", "value": f"Message from {form.name} ({form.email}):\n\n{form.message}"}]
            }
            
            req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers, method="POST")
            with urllib.request.urlopen(req) as response:
                print(f"\n✅ SendGrid Email successfully sent! Status Code: {response.status}")

        # Also log it to the terminal
        print("\n" + "*"*50)
        print("📧 NEW CONTACT FORM SUBMISSION RECEIVED:")
        print(f"Name: {form.name}")
        print(f"Email: {form.email}")
        print(f"Subject: {form.subject}")
        print(f"Message: {form.message}")
        print("*"*50 + "\n")
        
        return {"status": "success", "message": "Email received successfully"}
    except Exception as e:
        print(f"Error handling contact form: {e}")
        raise HTTPException(status_code=500, detail="Failed to send message")

# This is the exact endpoint Supabase will hit when an upload reaches 100%
@app.post("/webhooks/supabase")
async def handle_supabase_webhook(request: Request):
    try:
        # Supabase sends us a JSON payload describing the new file
        payload = await request.json()
        
        # We extract the 'record' dictionary from the payload
        record = payload.get("record", {})
        
        # Get the important details about the video
        bucket_id = record.get("bucket_id")
        file_path = record.get("name")
        file_size_bytes = record.get("metadata", {}).get("size", 0)
        
        # Convert bytes to Megabytes for easier reading
        file_size_mb = round(file_size_bytes / (1024 * 1024), 2)
        
        print("\n" + "="*50)
        print("🎉 SUCCESS: NEW VIDEO RECEIVED FROM SUPABASE!")
        print(f"Bucket: {bucket_id}")
        print(f"File Path: {file_path}")
        print(f"File Size: {file_size_mb} MB")
        print("="*50 + "\n")
        
        # TODO: This is where you write your Python logic!
        # Example: 
        # 1. Update SQL Database (status = 'completed')
        # 2. Trigger an AI model or compression script
        
        # We must return a 200 OK so Supabase knows we got the message
        return {"status": "success", "message": "Video logged successfully"}
        
    except Exception as e:
        print(f"❌ Webhook Error: {str(e)}")
        # Even if we fail, we return a response so Supabase doesn't retry infinitely
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    # Runs the server locally on port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
