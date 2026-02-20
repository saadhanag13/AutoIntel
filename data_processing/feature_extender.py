import numpy as np


class FeatureImportanceExtractor:

    @staticmethod
    def extract(model, feature_names):

        # Tree-based models
        if hasattr(model, "feature_importances_"):
            importances = model.feature_importances_

        # Linear models
        elif hasattr(model, "coef_"):
            coef = model.coef_

            if coef.ndim > 1:
                coef = coef[0]

            importances = np.abs(coef)

        else:
            return None  # Model does not support importance

        # Normalize importance
        total = np.sum(importances)
        if total != 0:
            importances = importances / total

        # Map feature names
        feature_importance_list = [
            {
                "feature": feature_names[i],
                "importance": float(importances[i])
            }
            for i in range(len(feature_names))
        ]

        # Sort descending
        feature_importance_list = sorted(
            feature_importance_list,
            key=lambda x: x["importance"],
            reverse=True
        )

        return feature_importance_list
