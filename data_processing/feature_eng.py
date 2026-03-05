import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline


class FeatureEngineer:

    @staticmethod
    def build_features(
        df: pd.DataFrame,
        schema: dict,
        target_column: str
    ):
        """
        Prepares ML-ready features.

        Returns:
            X_transformed
            y
            fitted_preprocessor
            feature_names
        """

        df = df.copy()

        if target_column not in df.columns:
            raise ValueError(f"Target column '{target_column}' not found in dataframe.")

        # ----------------------------
        # 1️⃣ Separate Target
        # ----------------------------
        y = df[target_column]
        X = df.drop(columns=[target_column])

        # ----------------------------
        # 2️⃣ Handle Datetime Columns
        # ----------------------------
        datetime_cols = schema.get("datetime_columns", [])

        for col in datetime_cols:
            if col in X.columns:
                X[col] = pd.to_datetime(X[col], errors="coerce")
                X[f"{col}_year"] = X[col].dt.year
                X[f"{col}_month"] = X[col].dt.month
                X[f"{col}_day"] = X[col].dt.day
                X[f"{col}_dayofweek"] = X[col].dt.dayofweek
                X = X.drop(columns=[col])

        # ----------------------------
        # 3️⃣ Identify Column Types
        # ----------------------------
        numeric_cols = X.select_dtypes(include=["int64", "float64"]).columns.tolist()
        categorical_cols = X.select_dtypes(include=["object"]).columns.tolist()

        # ----------------------------
        # 4️⃣ Create Transformers
        # ----------------------------
        numeric_transformer = Pipeline(
            steps=[
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler())
            ]
        )

        categorical_transformer = Pipeline(
            steps=[
                ("imputer", SimpleImputer(strategy="most_frequent")),
                ("encoder", OneHotEncoder(handle_unknown="ignore"))
            ]
        )

        # ----------------------------
        # 5️⃣ Column Transformer
        # ----------------------------
        transformers = []
        if numeric_cols:
            transformers.append(("num", numeric_transformer, numeric_cols))
        if categorical_cols:
            transformers.append(("cat", categorical_transformer, categorical_cols))

        preprocessor = ColumnTransformer(transformers=transformers)

        # ----------------------------
        # 6️⃣ Fit & Transform
        # ----------------------------
        X_transformed = preprocessor.fit_transform(X)

        # Extract feature names
        feature_names = FeatureEngineer.get_feature_names(preprocessor)

        return X_transformed, y, preprocessor, feature_names

    @staticmethod
    def get_feature_names(preprocessor):
        """
        Robustly extract feature names after ColumnTransformer transformation.
        """

        feature_names = []

        for name, transformer, columns in preprocessor.transformers_:

            # Skip dropped columns
            if transformer == "drop":
                continue

            # Skip if no columns
            if len(columns) == 0:
                continue

            # If pipeline (numeric or categorical)
            if hasattr(transformer, "named_steps"):

                # Categorical pipeline
                if "encoder" in transformer.named_steps:
                    encoder = transformer.named_steps["encoder"]
                    encoded_names = encoder.get_feature_names_out(columns)
                    feature_names.extend(encoded_names)

                # Numeric pipeline
                else:
                    feature_names.extend(columns)

            else:
                feature_names.extend(columns)

        return feature_names
