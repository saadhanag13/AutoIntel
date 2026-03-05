import os
os.environ["LOKY_MAX_CPU_COUNT"] = "1"

from ml_engine.engine import MLEngine
from insights.insight_generator import InsightGenerator
from typing import Callable


def run_training(df, target_column, progress_cb: Callable | None = None):
    """Run the full ML training pipeline.

    Args:
        df:          Uploaded dataset as a pandas DataFrame.
        target_column: Name of the target column.
        progress_cb: Optional callable(messages: list[str]) to report progress.
                     Called after each model finishes training.
    """

    def _progress(messages):
        if progress_cb:
            progress_cb(messages)

    _progress(["🔍 Detecting schema and problem type…"])

    report, models, best_model = MLEngine.train(
        df,
        target_column=target_column,
        mode="fast",
        progress_cb=_progress,
    )

    try:
        insights = InsightGenerator.generate(report)
        report["insights"] = insights
    except Exception as e:
        report["insights"] = {}
        print(f"Warning: InsightGenerator failed: {e}")

    return report
