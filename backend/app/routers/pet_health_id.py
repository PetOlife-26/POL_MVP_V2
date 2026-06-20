"""
Pet Health ID Generator + API Routes
=====================================
Format: CITYCODE-PETTYPE-000001
Examples: CBE-D-000001, BLR-C-000003

City Codes: CBE (Coimbatore), BLR (Bangalore), MAA (Chennai), HYD (Hyderabad)
Pet Types: D (Dog), C (Cat), O (Other)
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.supabase_client import supabase

router = APIRouter()

CITY_CODES = {
    "coimbatore": "CBE",
    "bangalore": "BLR",
    "bengaluru": "BLR",
    "chennai": "MAA",
    "hyderabad": "HYD",
}

PET_TYPE_CODES = {
    "dog": "D",
    "cat": "C",
    "other": "O",
    "bird": "O",
    "rabbit": "O",
}

def get_city_code(city_name: str) -> str:
    return CITY_CODES.get(city_name.lower().strip(), city_name[:3].upper())

def get_pet_type_code(pet_type: str) -> str:
    return PET_TYPE_CODES.get(pet_type.lower().strip(), "O")

def get_next_sequence(city_code: str, pet_type_code: str) -> int:
    prefix = f"{city_code}-{pet_type_code}-"
    try:
        result = (
            supabase.table("pet_health_ids")
            .select("sequence_number")
            .like("health_id", f"{prefix}%")
            .order("sequence_number", desc=True)
            .limit(1)
            .execute()
        )
        if result.data and len(result.data) > 0:
            return result.data[0]["sequence_number"] + 1
        return 1
    except Exception as e:
        print(f"[PetHealthID] Sequence error: {e}")
        return 1

def generate_pet_health_id(city_name: str, pet_type: str) -> str:
    city_code = get_city_code(city_name)
    pet_type_code = get_pet_type_code(pet_type)
    sequence = get_next_sequence(city_code, pet_type_code)
    health_id = f"{city_code}-{pet_type_code}-{sequence:06d}"
    print(f"[PetHealthID] Generated: {health_id}")
    return health_id

def store_pet_health_id(health_id: str, pet_profile_id: str) -> bool:
    try:
        parts = health_id.split("-")
        result = (
            supabase.table("pet_health_ids")
            .insert({
                "health_id": health_id,
                "pet_profile_id": pet_profile_id,
                "city_code": parts[0],
                "pet_type_code": parts[1],
                "sequence_number": int(parts[2]),
            })
            .execute()
        )
        return bool(result.data)
    except Exception as e:
        print(f"[PetHealthID] Store error: {e}")
        return False

def generate_and_store(city_name: str, pet_type: str, pet_profile_id: str) -> str:
    health_id = generate_pet_health_id(city_name, pet_type)
    if not store_pet_health_id(health_id, pet_profile_id):
        raise Exception(f"Failed to store health ID: {health_id}")
    try:
        supabase.table("pet_profiles").update({
            "petolife_id": health_id
        }).eq("id", pet_profile_id).execute()
    except Exception as e:
        print(f"[PetHealthID] Warning: {e}")
    return health_id


# ============ API ROUTES ============

class GenerateHealthIdRequest(BaseModel):
    city: str
    pet_type: str
    pet_profile_id: Optional[str] = None

@router.post("/generate")
async def generate_health_id(body: GenerateHealthIdRequest):
    try:
        city = body.city.strip()
        pet_type = body.pet_type.strip()

        valid_cities = ["coimbatore", "bangalore", "bengaluru", "chennai", "hyderabad"]
        if city.lower() not in valid_cities:
            raise HTTPException(status_code=400, detail=f"Invalid city. Use: {', '.join(valid_cities)}")

        valid_types = ["dog", "cat", "other"]
        if pet_type.lower() not in valid_types:
            raise HTTPException(status_code=400, detail=f"Invalid pet type. Use: {', '.join(valid_types)}")

        if body.pet_profile_id:
            health_id = generate_and_store(city, pet_type, body.pet_profile_id)
            return {
                "message": "Health ID generated and saved",
                "health_id": health_id,
                "city": city,
                "pet_type": pet_type,
                "saved": True
            }
        else:
            health_id = generate_pet_health_id(city, pet_type)
            return {
                "message": "Health ID generated (not saved - no pet_profile_id)",
                "health_id": health_id,
                "city": city,
                "pet_type": pet_type,
                "saved": False
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.get("/preview/{city}/{pet_type}")
async def preview_health_id(city: str, pet_type: str):
    try:
        health_id = generate_pet_health_id(city, pet_type)
        return {
            "preview": health_id,
            "city": city,
            "pet_type": pet_type,
            "note": "This is a preview - not saved yet"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
