class PromptBuilder:

    @staticmethod
    def build_system_prompt():
        return """
    You are an AI analytics assistant.
    You help with data insights, forecasting, and explanations.
    Be clear, concise, and structured.
    """

    @staticmethod
    def build_prompt(user_input: str, context: str = ""):
        system_prompt = PromptBuilder.build_system_prompt()

        full_prompt = f"""
    SYSTEM:
    {system_prompt}

    CONTEXT:
    {context}

    USER:
    {user_input}

    ASSISTANT:
    """
        return full_prompt
