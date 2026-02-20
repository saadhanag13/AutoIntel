from agents.analytics_agent import AnalyticsAgent

class AgentOrchestrator:

    def __init__(self):
        self.analytics_agent = AnalyticsAgent()

    def route(self, task: str):

        # Later we will add routing logic
        return self.analytics_agent.run(task)
