
import unittest
from unittest.mock import MagicMock, patch, AsyncMock
import sys
import os
import asyncio

# Mock supabase before imports
sys.modules["supabase"] = MagicMock()

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.lessons.progress import complete_lesson, LessonComplete

class TestLessons(unittest.TestCase):
    def setUp(self):
        self.mock_request = MagicMock()
        # request.json is async
        self.mock_request.json = AsyncMock(return_value={"lesson_id": "test_lesson", "quiz_score": 100})

    @patch('api.lessons.progress.get_supabase')
    @patch('api.lessons.progress.get_current_user', new_callable=AsyncMock)
    def test_complete_lesson_awards_badge(self, mock_get_user, mock_get_supabase):
        # Setup Mocks
        mock_supabase = MagicMock()
        mock_get_supabase.return_value = mock_supabase
        
        mock_get_user.return_value = {"id": "user_123"}
        
        # Create explicit chain for clarity
        # We need mock_supabase.table to return a mock that handles calls for different tables
        # But MagicMock returns same object by default.
        # We can use side_effect to return specific mocks if needed, or just rely on shared mock returning expected data.
        
        # Shared chain approach:
        mock_table = mock_supabase.table.return_value
        mock_select = mock_table.select.return_value
        mock_eq = mock_select.eq.return_value
        mock_single = mock_eq.single.return_value
        mock_execute = mock_single.execute.return_value
        
        # Set return data for 'lessons' query
        # api logic: lesson = ...execute() -> lesson.data
        mock_execute.data = {"badge_id": "badge_123"} 
        # Also need execute().data for other queries to be safe (or at least not crash)
        # For upsert: returns data list (optional usage in API)
        mock_table.upsert.return_value.execute.return_value.data = [{"id": "progress_123"}]
        
        # Execute
        response = asyncio.run(complete_lesson(self.mock_request))

        # Verify
        self.assertEqual(response.status_code, 201)
        
        table_calls = [c.args[0] for c in mock_supabase.table.call_args_list if c.args]
        # table_calls should contain 'user_lesson_progress', 'lessons', 'user_badges', 'badges', 'profiles'
        self.assertIn("user_badges", table_calls)
        
if __name__ == '__main__':
    unittest.main()
