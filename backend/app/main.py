from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from app.config import PORT, FRONTEND_URL
from app.routers import auth, location, pet_profile, pet_health_id, medical_records
from app.supabase_client import supabase

app = FastAPI(
    title="PetOLife API",
    description="Backend API for PetOLife — pet health profile management",
    version="2.0.0",
)

# Trust the X-Forwarded-Proto header set by Nginx so that FastAPI uses
# https:// (not http://) when generating any redirect URLs (e.g. trailing-slash
# 307 redirects from /api/pet-profile → /api/pet-profile/).
# This prevents Mixed Content errors on the frontend.
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

# CORS — keep the frontend origin and preserve the permissive behavior from the second file.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin
        for origin in {
            FRONTEND_URL,
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
            "*",
        }
        if origin
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers from both files
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(pet_profile.router, prefix="/api/pet-profile", tags=["Pet Profile"])
app.include_router(location.router, prefix="/api/location", tags=["Location"])
app.include_router(pet_health_id.router, prefix="/api/pet-health-id", tags=["Pet Health ID"])
app.include_router(medical_records.router, prefix="/api/medical-records", tags=["Medical Records"])


@app.get("/")
async def root():
    return {
        "status": "PetOLife backend is running",
        "engine": "FastAPI",
        "version": "2.0.0",
    }


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

    uvicorn.run(app, host="0.0.0.0", port=PORT, reload=True)
