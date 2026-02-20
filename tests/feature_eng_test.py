import pandas as pd
import os
from data_processing.schema_detector import SchemaDetector
from data_processing.cleaner import DataCleaner
from data_processing.feature_eng import FeatureEngineer

current_dir = os.path.dirname(__file__)
file_path = os.path.join(current_dir, "sample.csv")

df = pd.read_csv(file_path)

# Schema
schema = SchemaDetector.detect_schema(df)

# Clean
cleaned_df, _ = DataCleaner.clean(df, schema)

# Feature Engineering
X, y, preprocessor = FeatureEngineer.build_features(
    cleaned_df,
    schema,
    target_column="Sales"
)

print("X shape:", X.shape)
print("y shape:", y.shape)
