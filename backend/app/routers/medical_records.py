"""
Medical Records Router
Handles uploading, fetching, and deleting pet medical documents via Supabase Storage.
"""

import time
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.supabase_client import supabase

router = APIRouter()

def ensure_bucket_exists():
    try:
        buckets = supabase.storage.list_buckets()
        bucket_names = [b.name for b in buckets] if buckets else []
        if "medical-docs" not in bucket_names:
            supabase.storage.create_bucket("medical-docs", options={"public": True})
            print("[Storage] Created public bucket 'medical-docs'")
    except Exception as e:
        print(f"[Storage] Note during bucket check: {e}")

@router.post("/upload")
async def upload_medical_record(
    pet_profile_id: str = Form(...),
    title: str = Form(...),
    category: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        # Validate inputs
        if not pet_profile_id or not title or not category:
            raise HTTPException(status_code=400, detail="Missing required fields")

        ensure_bucket_exists()

        # 1) Upload to Storage Bucket 'medical-docs'
        timestamp = int(time.time() * 1000)
        safe_filename = file.filename.replace(" ", "_") if file.filename else "document"
        
        # Clean path: {pet_profile_id}/{timestamp}-{filename}
        storage_path = f"{pet_profile_id}/{timestamp}-{safe_filename}"
        
        file_bytes = await file.read()
        file_size = len(file_bytes)
        
        if file_size > 10 * 1024 * 1024: # 10MB limit
             raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")

        res = supabase.storage.from_("medical-docs").upload(
            storage_path,
            file_bytes,
            {"content-type": file.content_type}
        )

        # Get the public URL for the file
        public_url = supabase.storage.from_("medical-docs").get_public_url(storage_path)
        
        # 2) Fetch user_id tied to the pet_profile_id
        user_id = None
        try:
            pet_res = supabase.table("pet_profiles").select("user_id").eq("id", pet_profile_id).execute()
            if pet_res.data and len(pet_res.data) > 0:
                user_id = pet_res.data[0].get("user_id")
        except Exception as p_err:
            print(f"Notice: Could not fetch user_id for pet {pet_profile_id}: {p_err}")

        # Insert record into DB
        db_record = {
            "pet_profile_id": pet_profile_id,
            "title": title,
            "category": category,
            "file_url": public_url,
            "file_name": file.filename,
            "file_type": file.content_type,
            "file_size": file_size,
            "storage_path": storage_path
        }
        if user_id:
            db_record["user_id"] = user_id

        try:
            db_res = supabase.table("medical_records").insert(db_record).execute()
        except Exception as ins_err:
            # Fallback if user_id column doesn't exist in DB schema yet
            if user_id and "user_id" in str(ins_err):
                db_record.pop("user_id", None)
                db_res = supabase.table("medical_records").insert(db_record).execute()
            else:
                raise ins_err
        
        if not db_res.data:
            # If DB insert fails, try to clean up the uploaded file
            try:
                supabase.storage.from_("medical-docs").remove([storage_path])
            except:
                pass
            raise HTTPException(status_code=500, detail="Failed to save record metadata to database")
            
        return {
            "message": "Upload successful",
            "record": db_res.data[0]
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Medical upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to upload document: {str(e)}")

@router.get("/{pet_profile_id}")
async def get_medical_records(pet_profile_id: str):
    """Fetch all medical records for a specific pet."""
    try:
        res = (
            supabase.table("medical_records")
            .select("*")
            .eq("pet_profile_id", pet_profile_id)
            .order("created_at", desc=True)
            .execute()
        )
        return res.data or []
    except Exception as e:
        print(f"Fetch records error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch records: {str(e)}")

@router.delete("/{record_id}")
async def delete_medical_record(record_id: str):
    """Delete a medical record from both DB and Storage."""
    try:
        # 1) Get the storage path before deleting from DB
        res = supabase.table("medical_records").select("storage_path").eq("id", record_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Record not found")
            
        storage_path = res.data[0]["storage_path"]
        
        # 2) Delete from Storage
        try:
             supabase.storage.from_("medical-docs").remove([storage_path])
        except Exception as storage_err:
             print(f"Warning: Failed to delete file from storage: {storage_err}")
             # Continue to delete from DB even if storage delete fails
        
        # 3) Delete from DB
        db_res = supabase.table("medical_records").delete().eq("id", record_id).execute()
        
        return {"message": "Record deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete record error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete record: {str(e)}")
