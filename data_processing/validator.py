import pandas as pd
import numpy as np


class DataValidator:

    @staticmethod
    def validate(df: pd.DataFrame) -> dict:
        report = {}

        # 1️⃣ Missing Value Ratio
        missing_ratio = (df.isnull().sum() / len(df)).to_dict()
        report["missing_ratio"] = missing_ratio

        # 2️⃣ Duplicate Rows
        duplicates = df.duplicated().sum()
        report["duplicate_rows"] = int(duplicates)

        # 3️⃣ Constant Columns
        constant_columns = [
            col for col in df.columns if df[col].nunique() <= 1
        ]
        report["constant_columns"] = constant_columns

        # 4️⃣ High Cardinality Categoricals
        high_cardinality = {}
        for col in df.select_dtypes(include=["object"]).columns:
            unique_count = df[col].nunique()
            if unique_count > 0.5 * len(df):  # 50% unique threshold
                high_cardinality[col] = unique_count

        report["high_cardinality_columns"] = high_cardinality

        # 5️⃣ Basic Outlier Detection (IQR)
        outlier_summary = {}

        numeric_cols = df.select_dtypes(include=[np.number]).columns

        for col in numeric_cols:
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1

            lower = Q1 - 1.5 * IQR
            upper = Q3 + 1.5 * IQR

            outliers = df[(df[col] < lower) | (df[col] > upper)].shape[0]
            outlier_summary[col] = int(outliers)

        report["outliers"] = outlier_summary

        return report
