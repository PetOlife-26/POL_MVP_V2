"""
Care Team routes — ported from Express routes/careTeam.js

POST /api/care-team                    — Create/update care team
GET  /api/care-team/{pet_profile_id}   — Fetch care team for a pet
"""

from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.supabase_client import supabase

router = APIRouter()


class CareTeamCreate(BaseModel):
    pet_profile_id: str
    clinic_name: Optional[str] = None
    vet_name: Optional[str] = None
    vet_contact: Optional[str] = None
    emergency_contact_name: str
    emergency_relationship: Optional[str] = None
    emergency_contact_number: str


@router.post("/")
async def save_care_team(body: CareTeamCreate):
    """Create or update care team details for a pet."""
    # Verify pet exists
    pet_result = (
        supabase.table("pet_profiles")
        .select("id")
        .eq("id", body.pet_profile_id)
        .execute()
    )

    if not pet_result.data:
        raise HTTPException(status_code=404, detail="Pet profile not found")

    upsert_data = {
        "pet_profile_id": body.pet_profile_id,
        "clinic_name": body.clinic_name,
        "vet_name": body.vet_name,
        "vet_contact": body.vet_contact,
        "emergency_contact_name": body.emergency_contact_name,
        "emergency_relationship": body.emergency_relationship,
        "emergency_contact_number": body.emergency_contact_number,
    }

    result = (
        supabase.table("care_team")
        .upsert(upsert_data, on_conflict="pet_profile_id")
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to save care team")

    return {
        "message": "Care team saved successfully",
        "data": result.data[0],
    }


@router.get("/{pet_profile_id}")
async def get_care_team(pet_profile_id: str):
    """Fetch care team for a specific pet profile."""
    result = (
        supabase.table("care_team")
        .select("*")
        .eq("pet_profile_id", pet_profile_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Care team not found for this pet")

    return result.data[0]
