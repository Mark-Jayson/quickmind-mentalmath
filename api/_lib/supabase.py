import os
from supabase import create_client

_client = None

def get_supabase():
    global _client
    if _client is None:
        url = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
        key = os.environ.get("SUPABASE_KEY") or os.environ.get("VITE_SUPABASE_ANON_KEY")
        
        print(f"DEBUG: SUPABASE_URL present: {bool(os.environ.get('SUPABASE_URL'))}")
        print(f"DEBUG: VITE_SUPABASE_URL present: {bool(os.environ.get('VITE_SUPABASE_URL'))}")
        
        if not url or not key:
            raise ValueError(f"Supabase URL or Key missing. (URL: {bool(url)}, Key: {bool(key)})")
            
        _client = create_client(url, key)
    return _client
