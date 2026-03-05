from backend.llm.prompt_builder import PromptBuilder
from backend.memory.session_memory import SessionManager
from backend.services.hf_client import query_llm


class LLMService:

    @staticmethod
    def generate_response(session_id: str, user_input: str, context: str = ""):

        # add user message
        SessionManager.add_user_message(session_id, user_input)

        history = SessionManager.get_conversation(session_id)

        # build prompt
        prompt = PromptBuilder.build_prompt(user_input, context)

        messages = history + [{"role": "user", "content": prompt}]

        result = query_llm(messages)

        try:
            ai_message = result["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Error from LLM API: {str(result)}"

        SessionManager.add_assistant_message(session_id, ai_message)

        return ai_message
