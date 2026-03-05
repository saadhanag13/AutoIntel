from sklearn.linear_model import LinearRegression, Ridge, LogisticRegression
from sklearn.ensemble import (
    RandomForestRegressor,
    GradientBoostingRegressor,
    RandomForestClassifier,
    GradientBoostingClassifier,
    AdaBoostClassifier,
)
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC


class ModelSelector:

    @staticmethod
    def get_models(problem_type="regression", mode="fast"):

        # ----------------------------
        # REGRESSION MODELS
        # ----------------------------
        if problem_type == "regression":
            return {
                "LinearRegression": LinearRegression(),
                "Ridge": Ridge(),
                # n_jobs=1 → no subprocess spawning (loky ProcessPool crashes on Windows
                # inside a uvicorn/ASGI process; threading backend is used instead)
                "RandomForest": RandomForestRegressor(random_state=42, n_jobs=1),
                "GradientBoosting": GradientBoostingRegressor(random_state=42),
            }

        # ----------------------------
        # CLASSIFICATION MODELS
        # ----------------------------
        elif problem_type == "classification":

            # Fast mode models
            # n_jobs=1 on all models that support it — prevents joblib from
            # spawning loky worker processes, which crash on Windows inside ASGI.
            models = {
                "LogisticRegression": LogisticRegression(max_iter=1000),
                "RandomForestClassifier": RandomForestClassifier(random_state=42, n_jobs=1),
                "GradientBoostingClassifier": GradientBoostingClassifier(random_state=42),
            }

            # Advanced mode models
            if mode == "advanced":
                models.update({
                    "SVC": SVC(probability=True),
                    "KNeighborsClassifier": KNeighborsClassifier(),
                    "DecisionTreeClassifier": DecisionTreeClassifier(random_state=42),
                    "AdaBoostClassifier": AdaBoostClassifier(random_state=42),
                })

            return models

    @staticmethod
    def get_param_grids(problem_type="regression"):

        # ----------------------------
        # REGRESSION PARAM GRIDS
        # ----------------------------
        if problem_type == "regression":
            return {
                "Ridge": {
                    "alpha": [0.1, 1.0, 10.0]
                },
                "RandomForest": {
                    "n_estimators": [100, 200],
                    "max_depth": [None, 5, 10]
                },
                "GradientBoosting": {
                    "n_estimators": [100, 200],
                    "learning_rate": [0.05, 0.1]
                }
            }

        # ----------------------------
        # CLASSIFICATION PARAM GRIDS
        # ----------------------------
        elif problem_type == "classification":
            return {
                "LogisticRegression": {
                    "C": [0.1, 1, 10]
                },
                "RandomForestClassifier": {
                    "n_estimators": [100, 200],
                    "max_depth": [None, 5, 10]
                },
                "GradientBoostingClassifier": {
                    "n_estimators": [100, 200],
                    "learning_rate": [0.05, 0.1]
                },
                "SVC": {
                    "C": [0.1, 1, 10],
                    "kernel": ["linear", "rbf"]
                },
                "KNeighborsClassifier": {
                    "n_neighbors": [3, 5, 7]
                },
                "DecisionTreeClassifier": {
                    "max_depth": [None, 5, 10]
                },
                "AdaBoostClassifier": {
                    "n_estimators": [50, 100]
                }
            }
