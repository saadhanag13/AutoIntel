from backend.memory.memory_store import memory_store

class SessionManager:

    @staticmethod
    def add_user_message(session_id: str, message: str):
        memory_store.add_message(session_id, "user", message)

    @staticmethod
    def add_assistant_message(session_id: str, message: str):
        memory_store.add_message(session_id, "assistant", message)

    @staticmethod
    def get_conversation(session_id: str):
        return memory_store.get_session(session_id)

    @staticmethod
    def clear(session_id: str):
        memory_store.clear_session(session_id)
