import os
import traceback
from dotenv import load_dotenv
from supabase import create_client

# Explicitly load .env
load_dotenv()

url = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY") or os.environ.get("VITE_SUPABASE_ANON_KEY")

print(f"URL: {url}")

if not url or not key:
    print("ERROR: Missing URL or Key")
    exit(1)

try:
    print("Attempting to create client...")
    supabase = create_client(url, key)
    print("Client created successfully.")
    res = supabase.table("lessons").select("id").limit(1).execute()
    print(f"Query executed successfully! Found {len(res.data)} lessons.")
except Exception:
    print("An error occurred:")
    traceback.print_exc()
