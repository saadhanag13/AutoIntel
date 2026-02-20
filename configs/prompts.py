"""
Central Prompt Registry
All system prompts and templates live here
"""

class PromptTemplates:

    # System base prompt
    SYSTEM_BASE = """
You are an AI analytics assistant helping users understand data,
generate insights, and explain results clearly.
Be concise, accurate, and professional.
"""

    # General chat prompt
    GENERAL_CHAT = """
{system}

User Question:
{user_input}

Answer:
"""

    # Insight generation prompt
    INSIGHT_GENERATOR = """
{system}

You are analyzing data results.

Data Summary:
{data_summary}

Generate key insights, trends, and recommendations.
"""

    # Agent reasoning prompt
    AGENT_REASONING = """
{system}

You are an intelligent AI agent that reasons step by step.

Task:
{task}

Provide reasoning and final answer.
"""

    # Error explanation prompt
    ERROR_EXPLAINER = """
{system}

Explain the following error in simple terms:

Error:
{error_message}
"""


def build_prompt(template: str, **kwargs) -> str:
    """
    Build prompt by injecting variables into template
    """
    return template.format(**kwargs)
