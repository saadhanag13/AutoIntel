import pandas as pd
import os
from data_processing.schema_detector import SchemaDetector
from data_processing.cleaner import DataCleaner

current_dir = os.path.dirname(__file__)
file_path = os.path.join(current_dir, "sample.csv")

df = pd.read_csv(file_path)

schema = SchemaDetector.detect_schema(df)

cleaned_df, report = DataCleaner.clean(df, schema)

print("Cleaning Report:")
print(report)

print("\nCleaned Data:")
print(cleaned_df.head())
