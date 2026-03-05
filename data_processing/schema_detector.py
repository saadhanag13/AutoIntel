import pandas as pd


class SchemaDetector:

    @staticmethod
    def detect_schema(df: pd.DataFrame):

        schema = {
            "numeric_columns": [],
            "categorical_columns": [],
            "datetime_columns": [],
            "potential_targets": [],
            "is_time_series": False
        }

        for column in df.columns:

            if pd.api.types.is_numeric_dtype(df[column]):
                schema["numeric_columns"].append(column)

            elif pd.api.types.is_datetime64_any_dtype(df[column]):
                schema["datetime_columns"].append(column)

            else:
                # Try parsing as datetime — only classify if majority parses successfully
                try:
                    parsed = pd.to_datetime(df[column], format="mixed", errors="coerce")
                    valid_ratio = parsed.notna().mean()
                    if valid_ratio > 0.5:
                        schema["datetime_columns"].append(column)
                    else:
                        schema["categorical_columns"].append(column)
                except Exception:
                    schema["categorical_columns"].append(column)

        # Detect potential target (numeric column with variance)
        for col in schema["numeric_columns"]:
            if df[col].nunique() > 10:
                schema["potential_targets"].append(col)

        # Detect time-series dataset
        if len(schema["datetime_columns"]) > 0:
            schema["is_time_series"] = True

        return schema
