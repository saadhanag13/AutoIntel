from agents.base_agent import BaseAgent
from tools.clean_tools import DataTools


class DataCleaningAgent(BaseAgent):

    def __init__(self):
        super().__init__("DataCleaningAgent")

    def run(self, task: str, df=None):

        if df is not None:
            df = DataTools.fill_missing(df)
            df = DataTools.remove_duplicates(df)

            return {
                "agent": self.name,
                "message": "Dataset cleaned successfully",
                "shape": df.shape
            }

        prompt = f"""
        You are a data preprocessing expert.

        Explain how to clean and preprocess data for:

        {task}
        """
        return self.run_llm(prompt)
