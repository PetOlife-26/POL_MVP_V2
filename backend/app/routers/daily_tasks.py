"""
Daily Tasks routes — Care Journey Engine

GET  /api/daily-tasks/{pet_id}/today              — Get/generate today's tasks
PUT  /api/daily-tasks/{pet_id}/complete/{task_id}  — Mark task completed
PUT  /api/daily-tasks/{pet_id}/skip/{task_id}      — Mark task skipped
GET  /api/daily-tasks/{pet_id}/streak              — Get streak and care points
"""

from datetime import date, datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.supabase_client import supabase
from app.utils.pet_tasks import get_tasks_for_species, get_wellness_message, get_mood_level


class CustomTaskRequest(BaseModel):
    title: str


router = APIRouter()

CARE_POINTS_PER_DAY = 10


def _today() -> str:
    """Return today's date as ISO string."""
    return date.today().isoformat()


def _get_pet(pet_id: str) -> dict:
    """Fetch a pet profile by UUID. Raises 404 if not found."""
    result = supabase.table("pet_profiles").select("*").eq("id", pet_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Pet profile not found")
    return result.data[0]


def _ensure_streak_row(pet_id: str) -> dict:
    """Get or create a streak row for this pet."""
    result = (
        supabase.table("daily_streaks")
        .select("*")
        .eq("pet_profile_id", pet_id)
        .execute()
    )
    if result.data:
        return result.data[0]

    # Create new streak row
    insert = supabase.table("daily_streaks").insert({
        "pet_profile_id": pet_id,
        "current_streak": 0,
        "longest_streak": 0,
        "total_care_points": 0,
        "last_completed_date": None,
    }).execute()

    if not insert.data:
        raise HTTPException(status_code=500, detail="Failed to create streak record")
    return insert.data[0]


def _log_task_activity(pet: dict, task_id: str, task_title: str, action: str, member_id: str = None, member_name: str = None):
    """Log a task activity event to the household activity feed."""
    household_id = pet.get("household_id")
    if not household_id:
        return  # Pet not linked to a household yet
    try:
        # If no member info provided, try to find the owner
        if not member_id or not member_name:
            owner = (
                supabase.table("household_members")
                .select("id, display_name")
                .eq("household_id", household_id)
                .eq("role", "owner")
                .execute()
            )
            if owner.data:
                member_id = member_id or owner.data[0]["id"]
                member_name = member_name or owner.data[0]["display_name"] or "Owner"
            else:
                return  # No owner found, skip logging

        supabase.table("task_activity_log").insert({
            "household_id": household_id,
            "pet_id": pet["id"],
            "task_id": task_id,
            "task_title": task_title,
            "member_id": member_id,
            "member_name": member_name,
            "action": action,
        }).execute()
    except Exception as e:
        print(f"Activity log warning (non-fatal): {e}")


@router.get("/{pet_id}/today")
async def get_today_tasks(pet_id: str):
    """
    Get today's tasks for a pet.
    If no tasks exist for today, auto-generate them from the species template.
    """
    pet = _get_pet(pet_id)
    today = _today()
    pet_name = pet.get("pet_name", "your pet")
    pet_type = pet.get("pet_type", "other")

    # Check if tasks for today already exist
    existing = (
        supabase.table("daily_task_logs")
        .select("*")
        .eq("pet_profile_id", pet_id)
        .eq("task_date", today)
        .order("created_at")
        .execute()
    )

    if existing.data and len(existing.data) > 0:
        tasks = existing.data
    else:
        # Generate tasks from species template
        template = get_tasks_for_species(pet_type)
        rows = []
        for t in template:
            rows.append({
                "pet_profile_id": pet_id,
                "task_date": today,
                "task_id": t["id"],
                "task_title": t["title"],
                "task_icon": t["icon"],
                "task_question": t["question"].replace("{pet_name}", pet_name),
                "confirm_text": t["confirm_text"],
                "skip_text": t["skip_text"],
                "suggested_time": t["suggested_time"],
                "status": "pending",
            })

        insert_result = supabase.table("daily_task_logs").insert(rows).execute()
        if not insert_result.data:
            raise HTTPException(status_code=500, detail="Failed to generate today's tasks")
        tasks = insert_result.data

    # Calculate wellness score
    total = len(tasks)
    completed = sum(1 for t in tasks if t["status"] == "completed")
    score = round((completed / total) * 100) if total > 0 else 0
    mood = get_mood_level(score)
    message = get_wellness_message(score, pet_name)

    # Get streak info
    streak = _ensure_streak_row(pet_id)

    return {
        "pet_id": pet_id,
        "pet_name": pet_name,
        "date": today,
        "tasks": tasks,
        "wellness": {
            "score": score,
            "completed": completed,
            "total": total,
            "mood": mood,
            "message": message,
        },
        "streak": {
            "current": streak.get("current_streak", 0),
            "longest": streak.get("longest_streak", 0),
            "care_points": streak.get("total_care_points", 0),
        },
    }


@router.put("/{pet_id}/complete/{task_id}")
async def complete_task(pet_id: str, task_id: str, member_id: str = None, member_name: str = None):
    """Mark a task as completed for today."""
    pet = _get_pet(pet_id)
    today = _today()
    pet_name = pet.get("pet_name", "your pet")

    # Find the task
    result = (
        supabase.table("daily_task_logs")
        .select("*")
        .eq("pet_profile_id", pet_id)
        .eq("task_date", today)
        .eq("task_id", task_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Task not found for today")

    task_row = result.data[0]

    # Update task status
    supabase.table("daily_task_logs").update({
        "status": "completed",
        "completed_at": datetime.now(timezone.utc).isoformat(),
    }).eq("id", task_row["id"]).execute()

    # Log activity if pet has a household
    _log_task_activity(pet, task_id, task_row.get("task_title", ""), "completed", member_id, member_name)

    # Recalculate wellness score
    all_tasks = (
        supabase.table("daily_task_logs")
        .select("*")
        .eq("pet_profile_id", pet_id)
        .eq("task_date", today)
        .execute()
    )

    tasks = all_tasks.data or []
    total = len(tasks)
    completed = sum(1 for t in tasks if t["status"] == "completed" or (t["task_id"] == task_id))
    # The task we just completed might not be updated in the select yet, so we count it
    if task_row["status"] != "completed":
        # We just changed it but the select might have the old value
        completed = sum(1 for t in tasks if t["status"] == "completed")
        # Add 1 if the current task wasn't already counted
        if task_row["status"] != "completed":
            completed += 1
    else:
        completed = sum(1 for t in tasks if t["status"] == "completed")

    score = round((completed / total) * 100) if total > 0 else 0

    # If ALL tasks are completed, update streak
    all_completed = completed >= total
    streak_data = _ensure_streak_row(pet_id)

    if all_completed:
        last_date = streak_data.get("last_completed_date")
        current_streak = streak_data.get("current_streak", 0)
        longest_streak = streak_data.get("longest_streak", 0)
        total_points = streak_data.get("total_care_points", 0)

        # Check if yesterday was completed (streak continuity)
        from datetime import timedelta
        yesterday_str = (date.today() - timedelta(days=1)).isoformat()

        if last_date == today:
            # Already counted today
            pass
        else:
            if last_date == yesterday_str:
                current_streak += 1
            else:
                current_streak = 1  # Reset streak

            if current_streak > longest_streak:
                longest_streak = current_streak

            total_points += CARE_POINTS_PER_DAY

            supabase.table("daily_streaks").update({
                "current_streak": current_streak,
                "longest_streak": longest_streak,
                "total_care_points": total_points,
                "last_completed_date": today,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }).eq("pet_profile_id", pet_id).execute()

            streak_data["current_streak"] = current_streak
            streak_data["longest_streak"] = longest_streak
            streak_data["total_care_points"] = total_points

    mood = get_mood_level(score)
    message = get_wellness_message(score, pet_name)

    return {
        "status": "completed",
        "task_id": task_id,
        "all_completed": all_completed,
        "wellness": {
            "score": score,
            "completed": completed,
            "total": total,
            "mood": mood,
            "message": message,
        },
        "streak": {
            "current": streak_data.get("current_streak", 0),
            "longest": streak_data.get("longest_streak", 0),
            "care_points": streak_data.get("total_care_points", 0),
        },
    }


@router.put("/{pet_id}/skip/{task_id}")
async def skip_task(pet_id: str, task_id: str, member_id: str = None, member_name: str = None):
    """Mark a task as skipped for today."""
    pet = _get_pet(pet_id)
    today = _today()
    pet_name = pet.get("pet_name", "your pet")

    result = (
        supabase.table("daily_task_logs")
        .select("*")
        .eq("pet_profile_id", pet_id)
        .eq("task_date", today)
        .eq("task_id", task_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Task not found for today")

    task_row = result.data[0]

    supabase.table("daily_task_logs").update({
        "status": "skipped",
        "completed_at": datetime.now(timezone.utc).isoformat(),
    }).eq("id", task_row["id"]).execute()

    # Log activity if pet has a household
    _log_task_activity(pet, task_id, task_row.get("task_title", ""), "skipped", member_id, member_name)

    # Recalculate
    all_tasks = (
        supabase.table("daily_task_logs")
        .select("*")
        .eq("pet_profile_id", pet_id)
        .eq("task_date", today)
        .execute()
    )

    tasks = all_tasks.data or []
    total = len(tasks)
    completed = sum(1 for t in tasks if t["status"] == "completed")
    score = round((completed / total) * 100) if total > 0 else 0

    return {
        "status": "skipped",
        "task_id": task_id,
        "wellness": {
            "score": score,
            "completed": completed,
            "total": total,
            "mood": get_mood_level(score),
            "message": get_wellness_message(score, pet_name),
        },
    }


@router.get("/{pet_id}/streak")
async def get_streak(pet_id: str):
    """Get the current streak and care points for a pet."""
    _get_pet(pet_id)  # Verify pet exists
    streak = _ensure_streak_row(pet_id)

    return {
        "pet_id": pet_id,
        "current_streak": streak.get("current_streak", 0),
        "longest_streak": streak.get("longest_streak", 0),
        "total_care_points": streak.get("total_care_points", 0),
        "last_completed_date": streak.get("last_completed_date"),
    }


@router.post("/{pet_id}/custom")
async def add_custom_task(pet_id: str, body: CustomTaskRequest):
    """Add a custom task for today. Auto-generates standard templates first if missing."""
    pet = _get_pet(pet_id)
    today = _today()
    pet_name = pet.get("pet_name", "your pet")
    pet_type = pet.get("pet_type", "other")

    # 1. Check if daily tasks exist for today; if not, generate from template
    existing = (
        supabase.table("daily_task_logs")
        .select("*")
        .eq("pet_profile_id", pet_id)
        .eq("task_date", today)
        .execute()
    )

    if not existing.data or len(existing.data) == 0:
        template = get_tasks_for_species(pet_type)
        rows = []
        for t in template:
            rows.append({
                "pet_profile_id": pet_id,
                "task_date": today,
                "task_id": t["id"],
                "task_title": t["title"],
                "task_icon": t["icon"],
                "task_question": t["question"].replace("{pet_name}", pet_name),
                "confirm_text": t["confirm_text"],
                "skip_text": t["skip_text"],
                "suggested_time": t["suggested_time"],
                "status": "pending",
            })
        supabase.table("daily_task_logs").insert(rows).execute()

    # 2. Insert the custom task
    import uuid
    custom_id = f"custom_{uuid.uuid4().hex[:8]}"
    new_task = {
        "pet_profile_id": pet_id,
        "task_date": today,
        "task_id": custom_id,
        "task_title": body.title.strip(),
        "task_icon": "icon-default",
        "task_question": "Did you complete this task?",
        "confirm_text": "Yes, Done",
        "skip_text": "Skip",
        "suggested_time": "Anytime",
        "status": "pending",
    }

    insert_result = supabase.table("daily_task_logs").insert(new_task).execute()
    if not insert_result.data:
        raise HTTPException(status_code=500, detail="Failed to add custom task")

    task_data = insert_result.data[0]

    # 3. Retrieve all daily tasks to recalculate wellness metrics
    all_tasks = (
        supabase.table("daily_task_logs")
        .select("*")
        .eq("pet_profile_id", pet_id)
        .eq("task_date", today)
        .order("created_at")
        .execute()
    )

    tasks = all_tasks.data or []
    total = len(tasks)
    completed = sum(1 for t in tasks if t["status"] == "completed")
    score = round((completed / total) * 100) if total > 0 else 0

    mood = get_mood_level(score)
    message = get_wellness_message(score, pet_name)
    streak = _ensure_streak_row(pet_id)

    return {
        "task": task_data,
        "wellness": {
            "score": score,
            "completed": completed,
            "total": total,
            "mood": mood,
            "message": message,
        },
        "streak": {
            "current": streak.get("current_streak", 0),
            "longest": streak.get("longest_streak", 0),
            "care_points": streak.get("total_care_points", 0),
        },
    }

