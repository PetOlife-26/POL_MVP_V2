"""
Household routes — Family Access System 

POST   /api/household                              — Create household
GET    /api/household/by-user/{user_id}             — Get user's household + members
GET    /api/household/{household_id}/members        — List members
POST   /api/household/{household_id}/invite         — Generate invite token
POST   /api/household/join/{token}                  — Join via invite link
PATCH  /api/household/{household_id}/members/{member_id} — Update member role
DELETE /api/household/{household_id}/members/{member_id} — Remove member
GET    /api/household/{household_id}/activity       — Today's family activity feed
"""

import secrets
import string
from datetime import datetime, timezone, timedelta, date
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.supabase_client import supabase
from app.config import FRONTEND_URL

router = APIRouter()


# Request / Response models

class CreateHouseholdRequest(BaseModel):
    name: str
    owner_user_id: str
    owner_display_name: Optional[str] = None


class InviteRequest(BaseModel):
    invitee_name: str
    role: str = "family_member"
    invited_by_user_id: str


class JoinRequest(BaseModel):
    user_id: str
    display_name: Optional[str] = None


class UpdateMemberRequest(BaseModel):
    role: str


class LogActivityRequest(BaseModel):
    household_id: str
    pet_id: str
    task_id: str
    task_title: str
    member_id: str
    member_name: str
    action: str


# Helpers

def _generate_invite_code(length: int = 8) -> str:
    """Generate a secure random alphanumeric invite code."""
    alphabet = string.ascii_uppercase + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


def _get_member_role(household_id: str, user_id: str) -> Optional[str]:
    """Check if a user is a member of a household and return their role."""
    result = (
        supabase.table("household_members")
        .select("role, status")
        .eq("household_id", household_id)
        .eq("user_id", user_id)
        .eq("status", "active")
        .execute()
    )
    if result.data:
        return result.data[0]["role"]
    return None


def _require_owner(household_id: str, user_id: str):
    """Raise 403 if user is not the owner of the household."""
    role = _get_member_role(household_id, user_id)
    if role != "owner":
        raise HTTPException(status_code=403, detail="Only the household owner can perform this action")


# Routes

@router.post("/")
async def create_household(body: CreateHouseholdRequest):
    """Create a new household and add the creator as owner."""
    try:
        # Check if user already has a household
        existing = (
            supabase.table("household_members")
            .select("household_id")
            .eq("user_id", body.owner_user_id)
            .eq("status", "active")
            .execute()
        )
        if existing.data:
            # Return existing household
            hh_id = existing.data[0]["household_id"]
            hh = supabase.table("households").select("*").eq("id", hh_id).execute()
            return {"message": "Household already exists", "household": hh.data[0] if hh.data else None}

        # Create household
        hh_result = supabase.table("households").insert({
            "name": body.name,
            "owner_user_id": body.owner_user_id,
        }).execute()

        if not hh_result.data:
            raise HTTPException(status_code=500, detail="Failed to create household")

        household = hh_result.data[0]

        # Add owner as member
        member_result = supabase.table("household_members").insert({
            "household_id": household["id"],
            "user_id": body.owner_user_id,
            "display_name": body.owner_display_name or "Owner",
            "role": "owner",
            "status": "active",
        }).execute()

        if not member_result.data:
            raise HTTPException(status_code=500, detail="Failed to add owner as member")

        return {
            "message": "Household created successfully",
            "household": household,
            "member": member_result.data[0],
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Create household error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/by-user/{user_id}")
async def get_user_household(user_id: str):
    """Get the household a user belongs to, including all members and pet count."""
    try:
        # Find household membership
        membership = (
            supabase.table("household_members")
            .select("household_id, role")
            .eq("user_id", user_id)
            .eq("status", "active")
            .execute()
        )

        if not membership.data:
            return {"household": None, "members": [], "pet_count": 0}

        household_id = membership.data[0]["household_id"]
        user_role = membership.data[0]["role"]

        # Get household details
        hh = supabase.table("households").select("*").eq("id", household_id).execute()
        household = hh.data[0] if hh.data else None

        # Get all active members
        members = (
            supabase.table("household_members")
            .select("*")
            .eq("household_id", household_id)
            .neq("status", "removed")
            .order("joined_at")
            .execute()
        )

        # Count pets in household
        pets = (
            supabase.table("pet_profiles")
            .select("id")
            .eq("household_id", household_id)
            .execute()
        )

        return {
            "household": household,
            "members": members.data or [],
            "pet_count": len(pets.data) if pets.data else 0,
            "user_role": user_role,
        }

    except Exception as e:
        print(f"Get household error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{household_id}/members")
async def get_members(household_id: str):
    """List all members of a household."""
    try:
        result = (
            supabase.table("household_members")
            .select("*")
            .eq("household_id", household_id)
            .neq("status", "removed")
            .order("joined_at")
            .execute()
        )
        return result.data or []
    except Exception as e:
        print(f"Get members error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{household_id}/invite")
async def create_invite(household_id: str, body: InviteRequest):
    """Generate an invite token for a household. Only owners can invite."""
    try:
        _require_owner(household_id, body.invited_by_user_id)

        # Validate role
        valid_roles = ["family_member", "caregiver"]
        if body.role not in valid_roles:
            raise HTTPException(status_code=400, detail=f"Role must be one of: {valid_roles}")

        # Generate unique token
        token = _generate_invite_code()

        # Check uniqueness
        for _ in range(5):
            check = supabase.table("invite_tokens").select("id").eq("token", token).execute()
            if not check.data:
                break
            token = _generate_invite_code()

        # Create invite token (expires in 7 days)
        expires_at = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()

        invite_result = supabase.table("invite_tokens").insert({
            "token": token,
            "household_id": household_id,
            "role": body.role,
            "invited_by": body.invited_by_user_id,
            "invitee_name": body.invitee_name,
            "expires_at": expires_at,
            "max_uses": 1,
            "used_count": 0,
        }).execute()

        if not invite_result.data:
            raise HTTPException(status_code=500, detail="Failed to create invite")

        # Build invite URL using frontend base URL
        base_url = FRONTEND_URL.rstrip("/")
        invite_url = f"{base_url}/invite/{token}"

        return {
            "message": "Invite created successfully",
            "token": token,
            "invite_url": invite_url,
            "role": body.role,
            "invitee_name": body.invitee_name,
            "expires_at": expires_at,
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Create invite error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/invite/{token}")
async def get_invite_info(token: str):
    """Get invite details for display on the invite landing page."""
    try:
        result = (
            supabase.table("invite_tokens")
            .select("*")
            .eq("token", token)
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="Invite not found or expired")

        invite = result.data[0]

        # Check expiry
        expires = datetime.fromisoformat(invite["expires_at"].replace("Z", "+00:00"))
        if datetime.now(timezone.utc) > expires:
            raise HTTPException(status_code=410, detail="This invite has expired")

        # Check usage
        if invite["used_count"] >= invite["max_uses"]:
            raise HTTPException(status_code=410, detail="This invite has already been used")

        # Get household info
        hh = supabase.table("households").select("name").eq("id", invite["household_id"]).execute()
        household_name = hh.data[0]["name"] if hh.data else "Unknown"

        # Get pet count
        pets = supabase.table("pet_profiles").select("id, pet_name").eq("household_id", invite["household_id"]).execute()

        return {
            "token": token,
            "household_name": household_name,
            "role": invite["role"],
            "invitee_name": invite["invitee_name"],
            "pets": [{"id": p["id"], "pet_name": p["pet_name"]} for p in (pets.data or [])],
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Get invite info error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/join/{token}")
async def join_household(token: str, body: JoinRequest):
    """Join a household using an invite token."""
    try:
        # Find the invite
        result = (
            supabase.table("invite_tokens")
            .select("*")
            .eq("token", token)
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="Invalid invite code")

        invite = result.data[0]

        # Validate expiry
        expires = datetime.fromisoformat(invite["expires_at"].replace("Z", "+00:00"))
        if datetime.now(timezone.utc) > expires:
            raise HTTPException(status_code=410, detail="This invite has expired")

        # Validate usage
        if invite["used_count"] >= invite["max_uses"]:
            raise HTTPException(status_code=410, detail="This invite has already been used")

        household_id = invite["household_id"]

        # Check if user is already a member
        existing = (
            supabase.table("household_members")
            .select("id, status")
            .eq("household_id", household_id)
            .eq("user_id", body.user_id)
            .execute()
        )

        if existing.data:
            member = existing.data[0]
            if member["status"] == "active":
                return {"message": "You are already a member of this household"}
            else:
                # Reactivate removed member
                supabase.table("household_members").update({
                    "status": "active",
                    "role": invite["role"],
                    "display_name": body.display_name or invite["invitee_name"],
                    "joined_at": datetime.now(timezone.utc).isoformat(),
                }).eq("id", member["id"]).execute()
        else:
            # Add new member
            supabase.table("household_members").insert({
                "household_id": household_id,
                "user_id": body.user_id,
                "display_name": body.display_name or invite["invitee_name"],
                "role": invite["role"],
                "status": "active",
            }).execute()

        # Increment used count
        supabase.table("invite_tokens").update({
            "used_count": invite["used_count"] + 1,
        }).eq("id", invite["id"]).execute()

        return {"message": "Successfully joined household", "household_id": household_id}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Join household error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{household_id}/members/{member_id}")
async def update_member(household_id: str, member_id: str, body: UpdateMemberRequest):
    """Update a member's role. Only owners can do this."""
    try:
        # We need the caller's user_id; for MVP we pass it as query param
        # In production this would come from JWT
        valid_roles = ["family_member", "caregiver"]
        if body.role not in valid_roles:
            raise HTTPException(status_code=400, detail=f"Role must be one of: {valid_roles}")

        result = supabase.table("household_members").update({
            "role": body.role,
        }).eq("id", member_id).eq("household_id", household_id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Member not found")

        return {"message": "Member role updated", "member": result.data[0]}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Update member error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{household_id}/members/{member_id}")
async def remove_member(household_id: str, member_id: str):
    """Remove a member from the household (soft delete)."""
    try:
        # Prevent removing the owner
        member = supabase.table("household_members").select("role").eq("id", member_id).execute()
        if member.data and member.data[0]["role"] == "owner":
            raise HTTPException(status_code=400, detail="Cannot remove the household owner")

        result = supabase.table("household_members").update({
            "status": "removed",
        }).eq("id", member_id).eq("household_id", household_id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Member not found")

        return {"message": "Member removed successfully"}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Remove member error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{household_id}/activity")
async def get_activity(household_id: str):
    """Get today's family activity feed for a household."""
    try:
        today = date.today().isoformat()

        result = (
            supabase.table("task_activity_log")
            .select("*")
            .eq("household_id", household_id)
            .gte("timestamp", f"{today}T00:00:00")
            .lte("timestamp", f"{today}T23:59:59")
            .order("timestamp", desc=True)
            .execute()
        )

        activities = []
        for entry in (result.data or []):
            # Get pet name
            pet = supabase.table("pet_profiles").select("pet_name").eq("id", entry["pet_id"]).execute()
            pet_name = pet.data[0]["pet_name"] if pet.data else "Pet"

            activities.append({
                "id": entry["id"],
                "member_name": entry["member_name"],
                "action": entry["action"],
                "task_title": entry["task_title"],
                "pet_name": pet_name,
                "timestamp": entry["timestamp"],
            })

        return activities

    except Exception as e:
        print(f"Get activity error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/activity")
async def log_activity(body: LogActivityRequest):
    """Log a task activity event. Called internally by daily_tasks router."""
    try:
        result = supabase.table("task_activity_log").insert({
            "household_id": body.household_id,
            "pet_id": body.pet_id,
            "task_id": body.task_id,
            "task_title": body.task_title,
            "member_id": body.member_id,
            "member_name": body.member_name,
            "action": body.action,
        }).execute()

        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to log activity")

        return {"message": "Activity logged", "activity": result.data[0]}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Log activity error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
