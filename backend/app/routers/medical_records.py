"""
Medical Records Router
Handles uploading, fetching, and deleting pet medical documents via Supabase Storage.
"""

import time
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.supabase_client import supabase

router = APIRouter()

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

        # 1) Upload to Storage Bucket 'medical-docs'
        timestamp = int(time.time() * 1000)
        # Clean filename to avoid URL issues
        safe_filename = file.filename.replace(" ", "_") if file.filename else "document"
        
        # Path structure: {category}/{pet_profile_id}/{timestamp}-{filename}
        # e.g., Vaccination_Record/123e4567-e89b-12d3-a456-426614174000/1684332000-vax.pdf
        # Clean category for path (replace spaces with underscores)
        safe_category = category.replace(" ", "_")
        storage_path = f"{safe_category}/{pet_profile_id}/{timestamp}-{safe_filename}"
        
        file_bytes = await file.read()
        file_size = len(file_bytes)
        
        if file_size > 5 * 1024 * 1024: # 5MB limit
             raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")

        # Ensure the bucket exists manually in Supabase UI before this runs!
        res = supabase.storage.from_("medical-docs").upload(
            storage_path,
            file_bytes,
            {"content-type": file.content_type}
        )

        # Get the public URL for the file
        public_url = supabase.storage.from_("medical-docs").get_public_url(storage_path)
        
        # 2) Insert record into DB
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
        
        db_res = supabase.table("medical_records").insert(db_record).execute()
        
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
