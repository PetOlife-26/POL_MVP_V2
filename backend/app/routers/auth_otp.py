from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
import re
from app.supabase_client import supabase
from app.config import FRONTEND_URL
router = APIRouter()
def validate_phone(phone: str) -> str:
    cleaned = re.sub(r'[\s\-\(\)]', '', phone)
    if cleaned.startswith('+91'):
        return cleaned
    elif cleaned.startswith('91') and len(cleaned) == 12:
        return f'+{cleaned}'
    elif len(cleaned) == 10 and cleaned[0] in ['6','7','8','9']:
        return f'+91{cleaned}'
    raise HTTPException(status_code=400, detail="Invalid phone number. Use 10 digits starting with 6/7/8/9")
class SendOTPRequest(BaseModel):
    phone: str
class VerifyOTPRequest(BaseModel):
    phone: str
    token: str
@router.post("/otp/send")
async def send_otp(body: SendOTPRequest):
    try:
        phone = validate_phone(body.phone)
        result = supabase.auth.sign_in_with_otp({"phone": phone})
        return {"message": f"OTP sent to {phone}", "phone": phone}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send OTP: {str(e)}")
@router.post("/otp/verify")
async def verify_otp(body: VerifyOTPRequest):
    try:
        phone = validate_phone(body.phone)
        result = supabase.auth.verify_otp({
            "phone": phone,
            "token": body.token,
            "type": "sms"
        })
        if result.session is None:
            raise HTTPException(status_code=401, detail="Invalid or expired OTP")
        return {
            "message": "OTP verified successfully",
            "access_token": result.session.access_token,
            "refresh_token": result.session.refresh_token,
            "user": {
                "id": result.user.id,
                "phone": result.user.phone,
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")
@router.get("/google")
async def google_oauth():
    try:
        result = supabase.auth.sign_in_with_oauth({
            "provider": "google",
            "options": {"redirect_to": f"{FRONTEND_URL}/home"}
        })
        if result and result.url:
            return {"url": result.url}
        raise HTTPException(status_code=503, detail="Google OAuth not configured")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Google OAuth error: {str(e)}")
@router.get("/me")
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization header")
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    try:
        result = supabase.auth.get_user(token)
        if result.user is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {
            "id": result.user.id,
            "email": result.user.email,
            "phone": result.user.phone,
            "user_metadata": result.user.user_metadata,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
