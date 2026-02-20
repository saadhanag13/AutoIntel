import numpy as np
from sklearn.metrics import (
    r2_score,
    mean_absolute_error,
    mean_squared_error,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)


class Evaluator:

    @staticmethod
    def evaluate_regression(y_true, y_pred):

        return {
            "R2": float(r2_score(y_true, y_pred)),
            "MAE": float(mean_absolute_error(y_true, y_pred)),
            "RMSE": float(np.sqrt(mean_squared_error(y_true, y_pred)))
        }

    @staticmethod
    def evaluate_classification(y_true, y_pred):

        return {
            "Accuracy": float(accuracy_score(y_true, y_pred)),
            "Precision": float(precision_score(y_true, y_pred, average="weighted")),
            "Recall": float(recall_score(y_true, y_pred, average="weighted")),
            "F1": float(f1_score(y_true, y_pred, average="weighted"))
        }
