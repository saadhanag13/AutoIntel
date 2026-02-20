from typing import Dict, List

class MemoryStore:
    def __init__(self):
        self.sessions: Dict[str, List[dict]] = {}

    def get_session(self, session_id: str):
        return self.sessions.get(session_id, [])

    def add_message(self, session_id: str, role: str, content: str):
        if session_id not in self.sessions:
            self.sessions[session_id] = []

        self.sessions[session_id].append({
            "role": role,
            "content": content
        })

    def clear_session(self, session_id: str):
        if session_id in self.sessions:
            del self.sessions[session_id]


memory_store = MemoryStore()
