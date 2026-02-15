
import unittest
from unittest.mock import MagicMock, patch
import sys
import os
import asyncio

# Mock supabase before importing modules that need it
sys.modules["supabase"] = MagicMock()

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.mathlympics.submit import check_milestones, SessionSubmit

class TestMathlympics(unittest.TestCase):
    def setUp(self):
        self.mock_supabase = MagicMock()
        self.user_id = "test_user"

    def test_check_milestones_first_session(self):
        # Setup
        session = SessionSubmit(
            category="2x1",
            set_size=10,
            score=10,
            accuracy=1.0, 
            total_time_ms=10000,
            avg_time_ms=1000,
            detail=[]
        )

        # Mock DB responses
        self.mock_supabase.table().select().eq().execute.return_value.count = 1
        self.mock_supabase.table().select().eq().single().execute.return_value.data = {"xp_reward": 10}
        self.mock_supabase.table().select().eq().single().execute.return_value.data = {"xp": 100}

        # Execute async function
        asyncio.run(check_milestones(self.mock_supabase, self.user_id, session))

        # Verify
        calls = self.mock_supabase.table().insert.call_args_list
        badge_ids = []
        for call in calls:
            arg = call[0][0] 
            if 'badge_id' in arg:
                badge_ids.append(arg['badge_id'])
                
        self.assertIn('mathlympics_first_session', badge_ids)
        self.assertIn('mathlympics_2x1_perfect', badge_ids)
        self.assertIn('mathlympics_speed_demon', badge_ids)
        self.assertNotIn('mathlympics_40_set', badge_ids)

    def test_check_milestones_marathon(self):
        # Setup
        session = SessionSubmit(
            category="2x1",
            set_size=40,
            score=40,
            accuracy=0.9,
            total_time_ms=60000,
            avg_time_ms=1500,
            detail=[]
        )

        # Mock DB responses
        self.mock_supabase.table().select().eq().execute.return_value.count = 2 
        self.mock_supabase.table().select().eq().single().execute.return_value.data = {"xp_reward": 50}
        self.mock_supabase.table().select().eq().single().execute.return_value.data = {"xp": 100}

        # Execute
        asyncio.run(check_milestones(self.mock_supabase, self.user_id, session))

        # Verify
        calls = self.mock_supabase.table().insert.call_args_list
        badge_ids = [call[0][0]['badge_id'] for call in calls if 'badge_id' in call[0][0]]
        
        self.assertIn('mathlympics_40_set', badge_ids)
        self.assertNotIn('mathlympics_first_session', badge_ids)

if __name__ == '__main__':
    unittest.main()
