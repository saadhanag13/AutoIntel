import numpy as np
from .model_selector import ModelSelector
from .trainer import Trainer
from data_processing.feature_extender import FeatureImportanceExtractor


class MLEngine:

    # @staticmethod
    # def detect_problem_type(y):

    #     if not np.issubdtype(y.dtype, np.number):
    #         return "classification", "Target is non-numeric."

    #     unique_values = y.nunique()
    #     total_samples = len(y)

    #     uniqueness_ratio = unique_values / total_samples

    #     # Binary classification
    #     if unique_values == 2:
    #         return "classification", "Binary target detected."

    #     # If values repeat heavily → classification
    #     if uniqueness_ratio < 0.2 and unique_values <= 20:
    #         return "classification", "Low uniqueness ratio with discrete values."

    #     # Otherwise → regression
    #     return "regression", "High uniqueness ratio detected."

    @staticmethod
    def detect_problem_type(y):

        # Convert pandas dtype safely
        if y.dtype == "object" or str(y.dtype).startswith("string"):
            return "classification", "Non-numeric target detected."

        if np.issubdtype(y.dtype, np.number):

            unique_values = y.nunique()
            total_samples = len(y)
            uniqueness_ratio = unique_values / total_samples

            if unique_values == 2:
                return "classification", "Binary target detected."

            if uniqueness_ratio < 0.2 and unique_values <= 20:
                return "classification", "Low uniqueness ratio with discrete values."

            return "regression", "Continuous numeric target detected."

        return "classification", "Fallback classification."



    @staticmethod
    def train(df, target_column, mode= "fast"):

        # if config is None:
        #     config = {"advanced": False}

        # advanced = config.get("advanced", False)

        if target_column not in df.columns:
            raise ValueError(f"Target column '{target_column}' not found in DataFrame.")

        X= df.drop(columns=[target_column])
        y= df[target_column]

        # validate target
        import pandas as pd
        if pd.api.types.is_datetime64_any_dtype(y):
            raise ValueError("Datetime column cannot be used as target variable.")

        problem_type, reason = MLEngine.detect_problem_type(y)

        # models = ModelSelector.get_models(
        #     problem_type=problem_type,
        #     mode="advanced" if advanced else "fast"
        # )

        # param_grids = ModelSelector.get_param_grids(problem_type) if advanced else None

        advanced = True if mode == "advanced" else False

        models = ModelSelector.get_models(
            problem_type=problem_type,
            mode=mode
        )

        param_grids = ModelSelector.get_param_grids(problem_type) if advanced else None

        results, trained_models = Trainer.train_models(
            models=models,
            X=X,
            y=y,
            problem_type=problem_type,
            mode="advanced" if advanced else "fast",
            param_grids=param_grids
        )

        primary_metric = "R2" if problem_type == "regression" else "Accuracy"

        best_model_name = max(results, key=lambda k: results[k][primary_metric])
        best_model = trained_models[best_model_name]

        report = {
            "problem_type": problem_type,
            "advanced_mode": advanced,
            "best_model": best_model_name,
            "best_score": results[best_model_name][primary_metric],
            "primary_metric": primary_metric,
            "model_comparison": results, 
            "feature_importance" : None, 
            "reason": reason
        }

        # ---------------------------
        # Feature Importance
        # ---------------------------

        # feature_importance = None

        # if feature_names is not None:
        #     feature_importance = FeatureImportanceExtractor.extract(
        #         best_model,
        #         feature_names
        #     )

        # report["feature_importance"] = feature_importance
        # report["feature_importance"] = None
        # report["reason"] = reason

        return report, trained_models, best_model

