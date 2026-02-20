import pandas as pd

class DataTools:

    @staticmethod
    def load_csv(file_path: str):
        df = pd.read_csv(file_path)
        return df

    @staticmethod
    def dataset_summary(df):
        return {
            "rows": df.shape[0],
            "columns": df.shape[1],
            "column_names": list(df.columns),
            "missing_values": df.isnull().sum().to_dict(),
            "describe": df.describe().to_dict()
        }
