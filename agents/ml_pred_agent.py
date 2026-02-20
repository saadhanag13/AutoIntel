from agents.base_agent import BaseAgent
from tools.ml_tools import MLTools


class MLPredictionAgent(BaseAgent):

    def __init__(self):
        super().__init__("MLPredictionAgent")

    def run(self, task: str, df=None, target_column=None):

        if df is not None and target_column is not None:
            result = MLTools.train_regression(df, target_column)

            return {
                "agent": self.name,
                "model_result": result
            }

        prompt = f"""
        You are a machine learning engineer.

        Provide a prediction strategy or explanation for the following task:

        {task}
        """
        return self.run_llm("ml-session", prompt)
