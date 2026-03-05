import os
# Force single-process execution for joblib/loky at the module level.
# This is a belt-and-suspenders measure alongside the env vars in main.py.
os.environ["LOKY_MAX_CPU_COUNT"] = "1"

from ml_engine.engine import MLEngine
from insights.insight_generator import InsightGenerator


def run_training(df, target_column):
    """Run the full ML training pipeline. Called from a sync FastAPI endpoint
    which FastAPI automatically schedules in a thread pool."""

    report, models, best_model = MLEngine.train(
        df,
        target_column=target_column,
        mode="fast",
    )

    try:
        insights = InsightGenerator.generate(report)
        report["insights"] = insights
    except Exception as e:
        report["insights"] = {}
        print(f"Warning: InsightGenerator failed: {e}")

    return report
