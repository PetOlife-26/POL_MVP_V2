from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional
from app.supabase_client import supabase
import time

router = APIRouter()

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None

def ensure_avatars_bucket_exists():
    try:
        buckets = supabase.storage.list_buckets()
        bucket_names = [b.name for b in buckets] if buckets else []
        if "avatars" not in bucket_names:
            supabase.storage.create_bucket("avatars", options={"public": True})
            print("[Storage] Created public bucket 'avatars'")
    except Exception as e:
        print(f"[Storage] Note during bucket check: {e}")

@router.get("/{user_id}")
async def get_user_profile(user_id: str):
    try:
        response = supabase.table("user_profiles").select("*").eq("id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User profile not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{user_id}")
async def update_user_profile(user_id: str, profile: UserProfileUpdate):
    try:
        update_data = {k: v for k, v in profile.dict().items() if v is not None}
        if not update_data:
            return {"message": "No data to update"}
            
        response = supabase.table("user_profiles").update(update_data).eq("id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User profile not found or update failed")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{user_id}/avatar")
async def upload_avatar(user_id: str, file: UploadFile = File(...)):
    try:
        ensure_avatars_bucket_exists()
        
        timestamp = int(time.time() * 1000)
        safe_filename = file.filename.replace(" ", "_") if file.filename else "avatar"
        storage_path = f"{user_id}/{timestamp}-{safe_filename}"
        
        file_bytes = await file.read()
        if len(file_bytes) > 5 * 1024 * 1024:
             raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")

        supabase.storage.from_("avatars").upload(
            storage_path,
            file_bytes,
            {"content-type": file.content_type}
        )

        public_url = supabase.storage.from_("avatars").get_public_url(storage_path)
        
        # Update user_profiles with new avatar_url
        supabase.table("user_profiles").update({"avatar_url": public_url}).eq("id", user_id).execute()
        
        return {"avatar_url": public_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
