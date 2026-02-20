from agents.base_agent import BaseAgent
from tools.insight_tools import InsightTools


class InsightAgent(BaseAgent):

    def __init__(self):
        super().__init__("InsightAgent")

    def run(self, task: str, df=None, target_column=None):

        if df is not None and target_column is not None:
            insights = InsightTools.top_correlations(df, target_column)

            return {
                "agent": self.name,
                "insights": insights
            }

        prompt = f"""
        You are a business intelligence expert.

        Generate insights and explain patterns for:

        {task}
        """
        return self.run_llm(prompt)
