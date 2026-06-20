## 🐾 PetOLife Backend — README for Irfan

---

### ✅ 3 Modules Completed

| # | Module | What It Does |
|---|--------|-------------|
| 1 | **OTP Login** | Send OTP to phone → Verify → Login. Google OAuth also included |
| 2 | **Pet Health ID** | Auto-generates ID in format `CITYCODE-PETTYPE-000001` (e.g., CBE-D-000001) |
| 3 | **Location Collection** | User enters pincode → System auto-fetches City & State via India Post API |

---

### 🗄️ Database (Supabase)

New tables added to existing database:

- **`user_profiles`** — Stores phone, name, auth provider (phone/google)
- **`pet_health_ids`** — Stores generated health IDs with city/type/sequence
- **`user_addresses`** — Stores pincode, city, state
- **`pet_profiles`** — Added new columns: `user_id`, `pet_health_id`, `city`, `state`, `pincode`

**All existing data preserved.** ✅

---

### 📁 File Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py                    — Environment variables
│   ├── supabase_client.py           — Supabase connection
│   ├── main.py                      — Main server (FastAPI)
│   └── routers/
│       ├── __init__.py
│       ├── auth_otp.py              — OTP + Google login routes
│       ├── location.py              — Pincode → City/State route
│       └── pet_health_id.py         — Health ID generation + API routes
├── .env_example                     — Copy this to .env
├── requirements.txt                 — Python dependencies
└── test_frontend.html               — Test page (all features)
```

---

### 🔑 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/test` | Opens test frontend page |
| POST | `/api/auth/otp/send` | Send OTP to phone |
| POST | `/api/auth/otp/verify` | Verify OTP & login |
| GET | `/api/auth/google` | Google OAuth redirect |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/location/pincode/{pincode}` | Get city/state from pincode |
| POST | `/api/location/lookup` | Same as above (POST) |
| POST | `/api/pet-health-id/generate` | Generate health ID |
| GET | `/api/pet-health-id/preview/{city}/{type}` | Preview next ID |

---

### 🚀 Setup & Run (Step by Step)

**Step 1: Clone or extract the zip**
```bash
cd mine\backend
```

**Step 2: Create `.env` file**
```bash
copy .env_example .env
notepad .env
```
Fill in your Supabase credentials:
```
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:5173
PORT=8000
```

**Step 3: Install dependencies**
```bash
pip install -r requirements.txt
```

**Step 4: Start server**
```bash
python -m uvicorn app.main:app --reload --port 8000
```

**Step 5: Open test page**
- Open browser → go to `http://localhost:8000/test`
- Test all features from there!

---

### ⚠️ Important Notes for Irfan

1. **Supabase Phone Auth** — Must be enabled in Supabase Dashboard → Authentication → Providers → Phone (needs Twilio for real SMS)
2. **Supabase Google Auth** — Enable in Dashboard → Providers → Google
3. **`.env` file is NOT included** in zip — create it from `.env_example`
4. **Test page URL** — Always use `http://localhost:8000/test` (NOT double-click the HTML file)
5. **Server must be running** — Keep the terminal open while testing

---

### 🧪 Quick Test

Once server is running, open `http://localhost:8000/test`:
- ✅ Backend Connection — auto-tests on load
- 📍 Pincode Lookup — enter `641001` → shows Coimbatore, Tamil Nadu
- 🏷️ Pet Health ID — select Bangalore + Dog → generates `BLR-D-000001`
- 📱 OTP Login — enter phone → send OTP (needs Twilio for SMS)
- 🔐 Google Login — click button (needs Google OAuth setup)

---

**Built by Akash** 🎯
