import os
from supabase import create_client

_client = None

def get_supabase():
    global _client
    if _client is None:
        url = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
        # Try Service Role Key, then SUPABASE_KEY, then VITE_SUPABASE_ANON_KEY
        key = (
            os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or 
            os.environ.get("SUPABASE_KEY") or 
            os.environ.get("VITE_SUPABASE_ANON_KEY")
        )

        if not url or not key:
            raise ValueError("Supabase URL or Key missing from environment variables.")

        _client = create_client(url, key)
    return _client
