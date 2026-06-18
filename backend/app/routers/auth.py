"""
Auth routes — Supabase Auth with Google OAuth + email/password.

POST /api/auth/signup     — Email+password signup
POST /api/auth/login      — Email+password login
GET  /api/auth/google     — Returns Google OAuth redirect URL
GET  /api/auth/callback   — OAuth callback handler
GET  /api/auth/me         — Get current user from access token
"""

from typing import Optional

from fastapi import APIRouter, HTTPException, Request, Header
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


@router.post("/signup")
async def signup(body: SignupRequest):
    """Create a new user account with email/phone and password."""
    try:
        if not body.email and not body.phone:
            raise HTTPException(status_code=400, detail="Either email or phone must be provided")
            
        # Use admin client to bypass email sending rate limits and instantly verify
        admin_payload = {
            "password": body.password,
            "email_confirm": True,
            "phone_confirm": True,
            "user_metadata": {
                "full_name": body.full_name or "",
            }
        }
        if body.email:
            admin_payload["email"] = body.email
        if body.phone:
            admin_payload["phone"] = body.phone
            
        result = supabase.auth.admin.create_user(admin_payload)
        
        if result.user is None:
            raise HTTPException(status_code=400, detail="Signup failed — invalid details.")

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
            
        # We create a temporary client so we don't mutate the global client's auth state.
        # This ensures the global backend client always acts as service_role (bypassing RLS).
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
    """
    Returns the Google OAuth URL for the frontend to redirect to.
    The user will be redirected back to /api/auth/callback after Google login.
    """
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
