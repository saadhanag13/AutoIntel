from sklearn.model_selection import (
    train_test_split, 
    GridSearchCV, 
    StratifiedKFold, 
    KFold
    )
from .evaluator import Evaluator
import numpy as np


class Trainer:

    @staticmethod
    def train_models(models, X, y, problem_type, mode="fast", param_grids=None, progress_cb=None):

        results = {}
        trained_models = {}

        # Only stratify when safe (every class has ≥ 2 samples)
        stratify_arg = None
        if problem_type == "classification":
            if hasattr(y, "value_counts"):
                min_class = y.value_counts().min()
            else:
                _, counts = np.unique(y, return_counts=True)
                min_class = counts.min()
            if min_class >= 2:
                stratify_arg = y

        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=42,
            stratify=stratify_arg
        )

        # ------------------------------------
# Dataset Size Warning
# ------------------------------------
        if len(y) < 20:
            print("⚠ Dataset is very small (<20 samples). Results may not generalize well.")

        if problem_type == "classification":
            unique_classes = len(np.unique(y))
            if unique_classes < 2:
                print("⚠ Classification requires at least 2 classes.")


        for idx, (name, model) in enumerate(models.items(), 1):

            print(f"\nTraining model: {name}")
            if progress_cb:
                trained_so_far = list(results.keys())
                msgs = [f"✅ {m}" for m in trained_so_far] + [f"⚙️  Training {name}… ({idx}/{len(models)})"]
                progress_cb(msgs)

            try:
                # ── Dynamic KNN Adjustment (CV-aware) ──────────────────────
                if name == "KNeighborsClassifier":
                    min_class_count = y_train.value_counts().min()
                    cv_splits = min(5, min_class_count)
                    min_fold_train_size = X_train.shape[0] - (X_train.shape[0] // cv_splits)

                    if param_grids and name in param_grids:
                        if "n_neighbors" in param_grids[name]:
                            param_grids[name]["n_neighbors"] = [
                                k for k in param_grids[name]["n_neighbors"]
                                if k <= min_fold_train_size
                            ]
                            if not param_grids[name]["n_neighbors"]:
                                print("⚠ No valid n_neighbors for CV folds. Skipping GridSearch.")
                                model.fit(X_train, y_train)
                                y_pred = model.predict(X_test)
                                from sklearn.metrics import accuracy_score
                                results[name] = {"Accuracy": accuracy_score(y_test, y_pred)}
                                trained_models[name] = model
                                continue

                # ── ADVANCED MODE → GridSearch ─────────────────────────────
                if mode == "advanced" and param_grids is not None:

                    if problem_type == "classification":
                        class_counts = y_train.value_counts()
                        min_class_count = class_counts.min()

                        if min_class_count < 2:
                            print("⚠ Too few samples per class. Skipping CV.")
                            model.fit(X_train, y_train)
                            best_model = model
                        else:
                            cv_splits = min(5, min_class_count)
                            cv_strategy = StratifiedKFold(n_splits=cv_splits)
                            grid = GridSearchCV(
                                model,
                                param_grids.get(name, {}),
                                cv=cv_strategy,
                                scoring="accuracy",
                                n_jobs=1,   # no subprocess spawning on Windows
                            )
                            grid.fit(X_train, y_train)
                            best_model = grid.best_estimator_

                    else:   # Regression
                        n_samples = len(y_train)
                        if n_samples < 5:
                            print("⚠ Too few samples. Skipping CV.")
                            model.fit(X_train, y_train)
                            best_model = model
                        else:
                            cv_splits = min(5, n_samples)
                            cv_strategy = KFold(n_splits=cv_splits)
                            grid = GridSearchCV(
                                model,
                                param_grids.get(name, {}),
                                cv=cv_strategy,
                                scoring="r2",
                                n_jobs=1,   # no subprocess spawning on Windows
                            )
                            grid.fit(X_train, y_train)
                            best_model = grid.best_estimator_

                # ── FAST MODE → Direct Fit ─────────────────────────────────
                else:
                    model.fit(X_train, y_train)
                    best_model = model

                # ── Evaluation ─────────────────────────────────────────────
                y_pred = best_model.predict(X_test)

                if problem_type == "classification":
                    from sklearn.metrics import accuracy_score
                    results[name] = {"Accuracy": accuracy_score(y_test, y_pred)}
                else:
                    from sklearn.metrics import r2_score
                    results[name] = {"R2": r2_score(y_test, y_pred)}

                trained_models[name] = best_model

            except Exception as e:
                print(f"\n⚠ Skipping {name}: {type(e).__name__}: {e}")
                continue

        if not results:
            raise RuntimeError(
                "All models failed to train. Check the dataset and target column."
            )

        return results, trained_models
