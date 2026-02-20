import pandas as pd
import os

from data_processing.schema_detector import SchemaDetector
from data_processing.cleaner import DataCleaner
from data_processing.feature_eng import FeatureEngineer
from ml_engine.engine import MLEngine
from ml_engine.model_saver import ModelSaver
from insights.insight_generator import InsightGenerator

current_dir = os.path.dirname(__file__)
file_path = os.path.join(current_dir, "sample.csv")

df = pd.read_csv(file_path)

schema = SchemaDetector.detect_schema(df)
cleaned_df, _ = DataCleaner.clean(df, schema)

X, y, preprocessor, feature_names = FeatureEngineer.build_features(
    cleaned_df,
    schema,
    target_column="Sales"
)

report, models, best_model = MLEngine.train(
    X,
    y,
    feature_names=feature_names,
    config={"advanced": True}
)

save_path = ModelSaver.save(best_model)

# print("ML Report:", report)

print("\n=== Regression ML Report ===")
print(report)

insights = InsightGenerator.generate(report)

print("\n=== AI Insights ===")
for key, value in insights.items():
    print(f"\n{key.upper()}:")
    print(value)

print("Model Path:", save_path)

