import pandas as pd
import os
from data_processing.schema_detector import SchemaDetector
from data_processing.cleaner import DataCleaner
from data_processing.eda import EDAAnalyzer

current_dir = os.path.dirname(__file__)
file_path = os.path.join(current_dir, "sample.csv")

df = pd.read_csv(file_path)

schema = SchemaDetector.detect_schema(df)
cleaned_df, _ = DataCleaner.clean(df, schema)

eda_report = EDAAnalyzer.analyze(cleaned_df, target_column="Sales")

print("EDA Report Keys:")
print(eda_report.keys())

print("\nTarget Correlation Ranking:")
print(eda_report["target_correlation_ranking"])
