from agents.base_agent import BaseAgent
from backend.services.llm_service import LLMService
from tools.data_tools import DataTools
from tools.insight_tools import InsightTools


class AnalyticsAgent(BaseAgent):

    def __init__(self):
        super().__init__("AnalyticsAgent")

    def run(self, task: str, df=None):

        # If dataset available → run analytics tools
        if df is not None:
            summary = DataTools.dataset_summary(df)
            correlations = InsightTools.correlation_matrix(df)

            return {
                "agent": self.name,
                "summary": summary,
                "correlations": correlations
            }

        # Otherwise → LLM reasoning
        prompt = f"""
        You are a data analytics expert.

        Analyze the following request and provide a clear analytical response:

        {task}
        """
        return LLMService.generate_response(prompt)
