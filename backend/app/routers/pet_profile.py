"""
Pet Profile routes — ported from Express routes/petProfile.js

POST /api/pet-profile          — Create pet profile with photo upload
GET  /api/pet-profile/{id}     — Fetch by UUID
GET  /api/pet-profile/by-petolife-id/{petolife_id} — Fetch by PetOLife ID (QR scan)
"""

import json
import time
from typing import Optional

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel

class PetProfileUpdate(BaseModel):
    pet_name: Optional[str] = None
    breed: Optional[str] = None
    gender: Optional[str] = None
    birth_date: Optional[str] = None
    weight: Optional[float] = None
    color: Optional[str] = None
    blood_group: Optional[str] = None

from app.supabase_client import supabase
from app.utils.generate_petolife_id import generate_petolife_id

router = APIRouter()


@router.post("/")
async def create_pet_profile(
    pet_type: str = Form(...),
    pet_name: str = Form(...),
    user_id: Optional[str] = Form(None),
    breed: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    birth_date: Optional[str] = Form(None),
    weight: Optional[str] = Form(None),
    color: Optional[str] = Form(None),
    blood_group: Optional[str] = Form(None),
    identification_marks: Optional[str] = Form(None),
    pet_ids: Optional[str] = Form(None),  # JSON string: [{"idName":"...", "idNumber":"..."}]
    pet_photo: Optional[UploadFile] = File(None),
):
    """Create a new pet profile with photo upload + PetOLife ID generation."""
    print("--- POST /api/pet-profile ---")
    print(f"pet_type={pet_type}, pet_name={pet_name}")

    if not pet_type or not pet_name:
        raise HTTPException(status_code=400, detail="pet_type and pet_name are required")

    # Parse pet_ids
    parsed_ids: list[dict] = []
    if pet_ids:
        try:
            parsed_ids = json.loads(pet_ids)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid pet_ids format")

    # Generate unique PetOLife ID
    petolife_id = generate_petolife_id(pet_type, parsed_ids)
    print(f"Generated PetOLife ID: {petolife_id}")

    # Upload photo to Supabase Storage if provided
    pet_photo_url = None
    if pet_photo and pet_photo.filename:
        file_name = f"{int(time.time() * 1000)}-{pet_photo.filename.replace(' ', '-')}"
        file_bytes = await pet_photo.read()
        print(f"Uploading photo: {file_name}")

        try:
            supabase.storage.from_("pet-photos").upload(
                file_name,
                file_bytes,
                {"content-type": pet_photo.content_type or "image/jpeg"},
            )
        except Exception as upload_err:
            print(f"Photo upload error: {upload_err}")
            raise HTTPException(
                status_code=500,
                detail=f"Photo upload failed: {str(upload_err)}",
            )

        url_data = supabase.storage.from_("pet-photos").get_public_url(file_name)
        pet_photo_url = url_data
        print(f"Photo URL: {pet_photo_url}")

    # Insert pet profile
    print("Inserting pet profile into database...")
    insert_data = {
        "petolife_id": petolife_id,
        "user_id": user_id or None,
        "pet_type": pet_type,
        "pet_name": pet_name,
        "breed": breed or None,
        "gender": gender or None,
        "birth_date": birth_date or None,
        "weight": float(weight) if weight else None,
        "color": color or None,
        "blood_group": blood_group or None,
        "identification_marks": identification_marks or None,
        "pet_photo_url": pet_photo_url,
    }

    result = supabase.table("pet_profiles").insert(insert_data).execute()

    if not result.data:
        print(f"Profile insert error: {result}")
        raise HTTPException(status_code=500, detail="Failed to create pet profile")

    profile = result.data[0]
    print(f"Profile created: {profile['id']}")

    # Insert pet IDs
    valid_ids = [
        item for item in parsed_ids
        if item.get("idName", "").strip() and item.get("idNumber", "").strip()
    ]

    if valid_ids:
        ids_to_insert = [
            {
                "pet_profile_id": profile["id"],
                "id_name": item["idName"],
                "id_number": item["idNumber"],
            }
            for item in valid_ids
        ]

        ids_result = supabase.table("pet_ids").insert(ids_to_insert).execute()
        if not ids_result.data:
            print(f"Pet IDs insert error: {ids_result}")
            raise HTTPException(status_code=500, detail="Failed to save pet IDs")

    print("--- Profile created successfully ---")
    return {
        "message": "Pet profile created successfully",
        "pet_profile_id": profile["id"],
        "petolife_id": profile["petolife_id"],
        "data": profile,
    }


@router.get("/")
async def get_all_profiles():
    """Fetch all pet profiles from the database."""
    try:
        result = supabase.table("pet_profiles").select("*").order("created_at", desc=True).execute()
        return result.data or []
    except Exception as e:
        print(f"Fetch profiles error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch profiles: {str(e)}")


@router.get("/by-user/{user_id}")
async def get_pets_by_user(user_id: str):
    """Fetch all pet profiles for a specific user."""
    try:
        result = (
            supabase.table("pet_profiles")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        return result.data or []
    except Exception as e:
        print(f"Fetch user pets error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch user pets: {str(e)}")


@router.get("/{profile_id}")
async def get_pet_profile(profile_id: str):
    """Fetch pet profile by UUID."""
    result = supabase.table("pet_profiles").select("*").eq("id", profile_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Pet profile not found")

    profile = result.data[0]

    # Fetch pet IDs
    ids_result = supabase.table("pet_ids").select("*").eq("pet_profile_id", profile_id).execute()

    return {**profile, "pet_ids": ids_result.data or []}


@router.patch("/{profile_id}")
async def update_pet_profile(profile_id: str, updates: PetProfileUpdate):
    """Update pet profile details in-place."""
    try:
        # Filter out None values so we only update provided fields
        update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
        if not update_data:
            return {"message": "No updates provided"}
            
        result = supabase.table("pet_profiles").update(update_data).eq("id", profile_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Pet profile not found or update failed")
            
        return {"message": "Pet profile updated successfully", "data": result.data[0]}
    except Exception as e:
        print(f"Update profile error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")


@router.get("/by-petolife-id/{petolife_id:path}")
async def get_by_petolife_id(petolife_id: str):
    """Fetch pet profile by PetOLife ID (for QR scan)."""
    result = (
        supabase.table("pet_profiles")
        .select("*")
        .eq("petolife_id", petolife_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Pet not found")

    profile = result.data[0]

    # Fetch pet IDs
    ids_result = (
        supabase.table("pet_ids")
        .select("*")
        .eq("pet_profile_id", profile["id"])
        .execute()
    )

    # Fetch care team
    care_result = (
        supabase.table("care_team")
        .select("*")
        .eq("pet_profile_id", profile["id"])
        .execute()
    )

    return {
        **profile,
        "pet_ids": ids_result.data or [],
        "care_team": care_result.data[0] if care_result.data else None,
    }
