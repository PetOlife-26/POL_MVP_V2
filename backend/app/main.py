"""
PetOLife FastAPI Backend
========================
Replaces the Express.js backend.
Run with: uvicorn app.main:app --reload --port 8000
"""

import os
import platform
from collections import namedtuple

# Patch platform.uname to bypass WMI query hang on Windows
if os.name == "nt":
    try:
        UnameResult = namedtuple("uname_result", ["system", "node", "release", "version", "machine", "processor"])
        platform.uname = lambda: UnameResult(
            system="Windows",
            node="localhost",
            release="10",
            version="10.0.19045",
            machine="AMD64",
            processor="Intel64 Family 6 Model 158 Stepping 10, GenuineIntel"
        )
    except Exception:
        pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import PORT, FRONTEND_URL
from app.routers import auth, pet_profile, care_team, daily_tasks, household
from app.supabase_client import supabase


app = FastAPI(
    title="PetOLife API",
    description="Backend API for PetOLife — pet health profile management",
    version="1.0.0",
)

# CORS — allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(pet_profile.router, prefix="/api/pet-profile", tags=["Pet Profile"])
app.include_router(care_team.router, prefix="/api/care-team", tags=["Care Team"])
app.include_router(daily_tasks.router, prefix="/api/daily-tasks", tags=["Daily Tasks"])
app.include_router(household.router, prefix="/api/household", tags=["Household"])


@app.get("/")
async def root():
    return {"status": "PetOLife backend is running", "engine": "FastAPI"}


@app.on_event("startup")
async def startup_check():
    """Quick connectivity test on startup."""
    try:
        result = supabase.table("pet_profiles").select("id").limit(1).execute()
        print("[Supabase] Connection test OK — pet_profiles table exists")
    except Exception as e:
        print(f"[Supabase] Connection test FAILED: {e}")
        print(
            "[Supabase] Hint: Make sure you ran schema.sql in the Supabase SQL Editor "
            "and the SUPABASE_URL is correct (should look like: https://xxxxx.supabase.co)"
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)
