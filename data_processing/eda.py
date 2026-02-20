import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor


class EDAAnalyzer:

    @staticmethod
    def analyze(df: pd.DataFrame, target_column: str) -> dict:
        """
        Performs exploratory data analysis.
        Returns structured insights dictionary.
        """

        if target_column not in df.columns:
            raise ValueError(f"Target column '{target_column}' not found.")

        report = {}

        # --------------------------------
        # 1️⃣ Summary Statistics
        # --------------------------------
        numeric_df = df.select_dtypes(include=[np.number])
        summary_stats = numeric_df.describe().to_dict()
        report["summary_statistics"] = summary_stats

        # --------------------------------
        # 2️⃣ Correlation Matrix
        # --------------------------------
        correlation_matrix = numeric_df.corr().to_dict()
        report["correlation_matrix"] = correlation_matrix

        # --------------------------------
        # 3️⃣ Target Correlation Ranking
        # --------------------------------
        if target_column in numeric_df.columns:
            target_corr = (
                numeric_df.corr()[target_column]
                .drop(target_column)
                .abs()
                .sort_values(ascending=False)
            )

            report["target_correlation_ranking"] = target_corr.to_dict()
        else:
            report["target_correlation_ranking"] = {}

        # --------------------------------
        # 4️⃣ Feature Importance Proxy
        # --------------------------------
        try:
            X = numeric_df.drop(columns=[target_column])
            y = numeric_df[target_column]

            model = RandomForestRegressor(
                n_estimators=100,
                random_state=42
            )
            model.fit(X, y)

            importance = dict(
                zip(X.columns, model.feature_importances_)
            )

            # Sort by importance
            importance = dict(
                sorted(
                    importance.items(),
                    key=lambda item: item[1],
                    reverse=True
                )
            )

            report["feature_importance"] = importance

        except Exception:
            report["feature_importance"] = {}

        # --------------------------------
        # 5️⃣ Basic Dataset Info
        # --------------------------------
        report["dataset_shape"] = tuple(df.shape)
        report["numeric_column_count"] = len(numeric_df.columns)
        report["categorical_column_count"] = len(
            df.select_dtypes(include=["object"]).columns
        )

        return report
