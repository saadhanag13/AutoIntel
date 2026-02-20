import pandas as pd
import numpy as np


class DataCleaner:

    @staticmethod
    def clean(
        df: pd.DataFrame,
        schema: dict,
        config: dict | None = None
    ) -> tuple[pd.DataFrame, dict]:
        """
        Cleans dataframe based on schema and optional configuration.
        Returns:
            cleaned_df: pd.DataFrame
            report: dict
        """

        # ----------------------------
        # Default Configuration
        # ----------------------------
        if config is None:
            config = {
                "numeric_impute_strategy": "median",   # mean / median
                "categorical_impute_strategy": "mode", # mode / constant
                "drop_duplicates": True,
                "drop_constant_columns": True,
                "handle_outliers": False               # True = remove using IQR
            }

        df = df.copy()
        report = {}

        # ----------------------------
        # 1️⃣ Remove Duplicates
        # ----------------------------
        if config.get("drop_duplicates", True):
            before = len(df)
            df = df.drop_duplicates()
            after = len(df)
            report["duplicates_removed"] = int(before - after)

        # ----------------------------
        # 2️⃣ Drop Constant Columns
        # ----------------------------
        if config.get("drop_constant_columns", True):
            constant_cols = [
                col for col in df.columns if df[col].nunique() <= 1
            ]
            df = df.drop(columns=constant_cols, errors="ignore")
            report["constant_columns_removed"] = constant_cols

        # ----------------------------
        # 3️⃣ Handle Missing Values
        # ----------------------------
        numeric_cols = schema.get("numeric_columns", [])
        categorical_cols = schema.get("categorical_columns", [])

        # Numeric Imputation
        for col in numeric_cols:
            if col in df.columns:
                if config.get("numeric_impute_strategy") == "mean":
                    df[col] = df[col].fillna(df[col].mean())
                else:  # default median
                    df[col] = df[col].fillna(df[col].median())

        # Categorical Imputation
        for col in categorical_cols:
            if col in df.columns:
                if config.get("categorical_impute_strategy") == "mode":
                    mode_value = df[col].mode()
                    if not mode_value.empty:
                        df[col] = df[col].fillna(mode_value[0])
                    else:
                        df[col] = df[col].fillna("Unknown")
                else:
                    df[col] = df[col].fillna("Unknown")

        report["missing_values_remaining"] = int(df.isnull().sum().sum())

        # ----------------------------
        # 4️⃣ Parse Datetime Columns
        # ----------------------------
        for col in schema.get("datetime_columns", []):
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors="coerce")

        # ----------------------------
        # 5️⃣ Handle Outliers (Optional)
        # ----------------------------
        if config.get("handle_outliers", False):
            outlier_report = {}
            for col in numeric_cols:
                if col in df.columns:
                    Q1 = df[col].quantile(0.25)
                    Q3 = df[col].quantile(0.75)
                    IQR = Q3 - Q1

                    lower = Q1 - 1.5 * IQR
                    upper = Q3 + 1.5 * IQR

                    before = len(df)
                    df = df[(df[col] >= lower) & (df[col] <= upper)]
                    after = len(df)

                    outlier_report[col] = int(before - after)

            report["outliers_removed"] = outlier_report

        # ----------------------------
        # Final Shape
        # ----------------------------
        report["final_shape"] = tuple(df.shape)

        return df, report
