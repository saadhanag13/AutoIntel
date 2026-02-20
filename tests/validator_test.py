import pandas as pd
import os
from data_processing.validator import DataValidator

current_dir = os.path.dirname(__file__)
file_path = os.path.join(current_dir, "sample.csv")

df = pd.read_csv(file_path)

report = DataValidator.validate(df)

print(report)
