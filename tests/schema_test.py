import pandas as pd
import os
from data_processing.schema_detector import SchemaDetector

# Get absolute path to sample.csv
current_dir = os.path.dirname(__file__)
file_path = os.path.join(current_dir, "sample.csv")

df = pd.read_csv(file_path)

schema = SchemaDetector.detect_schema(df)
print(schema)
