"""
Auth routes — Supabase Auth with Google OAuth + email/password.

POST /api/auth/signup              — Email+password signup
POST /api/auth/login               — Email+password login
GET  /api/auth/google              — Returns Google OAuth redirect URL
GET  /api/auth/me                  — Get current user from access token
POST /api/auth/register-interest   — Early-access interest form (landing page)
"""

from typing import Optional, Literal
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from app.supabase_client import supabase
from app.config import FRONTEND_URL

router = APIRouter()


class SignupRequest(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str
    full_name: Optional[str] = None


class LoginRequest(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str


class RegisterInterestRequest(BaseModel):
    type: Literal["pet_parent", "veterinarian"]
    # Shared
    name: Optional[str] = None
    mobile: Optional[str] = None
    email: Optional[str] = None
    city: Optional[str] = None
    earlyAccess: Optional[bool] = True
    # Pet-parent only
    petType: Optional[str] = None
    hasPet: Optional[bool] = None
    # Vet only
    doctorName: Optional[str] = None
    clinicName: Optional[str] = None


@router.post("/signup")
async def signup(body: SignupRequest):
    """Create a new user account with email/phone and password."""
    try:
        if not body.email and not body.phone:
            raise HTTPException(status_code=400, detail="Either email or phone must be provided")

        admin_payload = {
            "password": body.password,
            "email_confirm": True,
            "phone_confirm": True,
            "user_metadata": {
                "full_name": body.full_name or "",
            },
        }
        if body.email:
            admin_payload["email"] = body.email
        if body.phone:
            admin_payload["phone"] = body.phone

        result = supabase.auth.admin.create_user(admin_payload)

        if result.user is None:
            raise HTTPException(status_code=400, detail="Signup failed — invalid details.")

        # Save to user_profiles so pet public page can show owner contact info
        try:
            supabase.table("user_profiles").upsert({
                "id": result.user.id,
                "full_name": body.full_name or "",
                "phone": body.phone or "",
                "email": body.email or "",
            }).execute()
        except Exception as profile_err:
            print(f"[Auth] Warning: Could not save user_profile: {profile_err}")

        return {
            "message": "Account created successfully",
            "user": {
                "id": result.user.id,
                "email": result.user.email,
                "user_metadata": result.user.user_metadata,
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        print(f"Signup error: {error_msg}")
        raise HTTPException(status_code=400, detail=error_msg)


@router.post("/login")
async def login(body: LoginRequest):
    """Log in with email/phone and password."""
    try:
        if not body.email and not body.phone:
            raise HTTPException(status_code=400, detail="Either email or phone must be provided")

        credentials = {"password": body.password}
        if body.email:
            credentials["email"] = body.email
        if body.phone:
            credentials["phone"] = body.phone

        # Temporary client so global service_role client auth state is never mutated
        from supabase import create_client
        from app.config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
        temp_supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

        result = temp_supabase.auth.sign_in_with_password(credentials)

        if result.session is None:
            raise HTTPException(status_code=401, detail="Invalid email or password.")

        return {
            "message": "Login successful",
            "access_token": result.session.access_token,
            "refresh_token": result.session.refresh_token,
            "user": {
                "id": result.user.id,
                "email": result.user.email,
                "user_metadata": result.user.user_metadata,
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        print(f"Login error: {error_msg}")
        raise HTTPException(status_code=401, detail=error_msg)


@router.get("/google")
async def google_oauth():
    """Returns the Google OAuth URL for the frontend to redirect to."""
    try:
        result = supabase.auth.sign_in_with_oauth(
            {
                "provider": "google",
                "options": {
                    "redirect_to": f"{FRONTEND_URL}/home",
                },
            }
        )

        if result and result.url:
            return {"url": result.url}

        raise HTTPException(
            status_code=503,
            detail="Google OAuth is not configured. Please set up Google provider in Supabase Dashboard.",
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Google OAuth error: {e}")
        raise HTTPException(
            status_code=503,
            detail="Google OAuth is not configured yet. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env and configure Google provider in Supabase Dashboard.",
        )


@router.get("/me")
async def get_current_user(authorization: Optional[str] = Header(None)):
    """Get current user profile from the access token."""
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization header provided")

    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization

    try:
        result = supabase.auth.get_user(token)

        if result.user is None:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        return {
            "id": result.user.id,
            "email": result.user.email,
            "user_metadata": result.user.user_metadata,
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Get user error: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@router.post("/register-interest")
async def register_interest(body: RegisterInterestRequest):
    """
    Store early-access registration interest from the landing page modal.
    Used by both Pet Parent and Veterinarian interest forms.
    """
    try:
        display_name = body.doctorName if body.type == "veterinarian" else body.name
        record = {
            "type": body.type,
            "name": display_name,
            "clinic_name": body.clinicName,
            "mobile": body.mobile,
            "email": body.email,
            "city": body.city,
            "pet_type": body.petType,
            "early_access": body.earlyAccess if body.earlyAccess is not None else True,
        }
        supabase.table("early_access_registrations").insert(record).execute()
        return {"message": "Thanks! You're on the early access list. We'll reach out soon."}
    except Exception as e:
        print(f"[register-interest] Error saving record: {e}")
        return {"message": "Thanks! You're on the early access list. We'll reach out soon."}
