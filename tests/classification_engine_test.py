import pandas as pd
import os

from data_processing.feature_eng import FeatureEngineer
from ml_engine.engine import MLEngine
from insights.insight_generator import InsightGenerator

# ----------------------------
# Load Dataset
# ----------------------------

# current_dir = os.path.dirname(__file__)
# file_path = os.path.join(current_dir, "classification_sample.csv")

# df = pd.read_csv(file_path)

df = pd.DataFrame({
    "Age": [25, 32, 40, 28, 35, 50, 23, 45],
    "Income": [30000, 50000, 80000, 32000, 70000, 90000, 28000, 85000],
    "Purchased": [0, 1, 1, 0, 1, 1, 0, 1]
})

# ----------------------------
# Dummy Schema (since this dataset has no datetime)
# ----------------------------
schema = {
    "datetime_columns": []
}

# ----------------------------
# Feature Engineering
# ----------------------------
X_transformed, y, preprocessor, feature_names = FeatureEngineer.build_features(
    df=df,
    schema=schema,
    target_column="Purchased"
)

# ----------------------------
# Train ML Engine
# ----------------------------
report, models, best_model = MLEngine.train(
    X=X_transformed,
    y=y,
    feature_names=feature_names,
    config={"advanced": True}
)

# ----------------------------
# Print Report
# ----------------------------
print("\n=== Classification ML Report ===")
print(report)

insights = InsightGenerator.generate(report)

print("\n=== AI Insights ===")
for key, value in insights.items():
    print(f"\n{key.upper()}:")
    print(value)