from agents.analytics_agent import AnalyticsAgent
from agents.ml_pred_agent import MLPredictionAgent
from agents.insight_agent import InsightAgent
from agents.data_clean_agent import DataCleaningAgent
from rag.rag_src.rag_agent import RAGAgent


class AgentManager:

    def __init__(self):
        self.analytics_agent = AnalyticsAgent()
        self.ml_agent = MLPredictionAgent()
        self.insight_agent = InsightAgent()
        self.cleaning_agent = DataCleaningAgent()
        self.rag_agent = RAGAgent()

    def route(self, user_input: str, df= None, target_column= None):

        text = user_input.lower()

        if "predict" in text or "forecast" in text or "model" in text:
            return self.ml_agent.run(user_input, df, target_column)

        if "clean" in text or "missing" in text or "preprocess" in text:
            return self.cleaning_agent.run(user_input, df)

        if "insight" in text or "explain" in text or "why" in text:
            return self.insight_agent.run(user_input, df, target_column)

        if "context" in text or "knowledge" in text or "document" in text:
            return self.rag_agent.run(user_input)

        # default fallback → analytics
        return self.analytics_agent.run(user_input, df)
