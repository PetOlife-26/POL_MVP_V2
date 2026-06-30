"""
Shared authentication dependency for FastAPI routes.
Extracts and validates the user_id from the JWT Bearer token.
"""

from typing import Optional
from fastapi import Header, HTTPException
from app.supabase_client import supabase


async def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    """
    FastAPI dependency that extracts the authenticated user's ID from the
    Authorization Bearer token. Raises 401 if the token is missing or invalid.
    
    Usage in a route:
        @router.get("/")
        async def my_route(user_id: str = Depends(get_current_user_id)):
            ...
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header is required")

    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization

    try:
        result = supabase.auth.get_user(token)
        if result.user is None:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return result.user.id
    except HTTPException:
        raise
    except Exception as e:
        print(f"[Auth Dependency] Token validation error: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")
