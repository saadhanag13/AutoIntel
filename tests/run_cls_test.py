import traceback, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

try:
    import pandas as pd
    from ml_engine.engine import MLEngine

    current_dir = os.path.dirname(__file__)
    df = pd.read_csv(os.path.join(current_dir, "mushrooms.csv"))

    # Show what columns/dtypes reach FeatureEngineer
    from data_processing.schema_detector import SchemaDetector
    from data_processing.cleaner import DataCleaner
    from data_processing.feature_eng import FeatureEngineer

    schema = SchemaDetector.detect_schema(df)
    print("Schema numeric_columns:", schema.get("numeric_columns"))
    print("Schema categorical_columns:", schema.get("categorical_columns"))

    X_raw = df.drop(columns=["Edible"])
    numeric_cols = X_raw.select_dtypes(include=["int64","float64"]).columns.tolist()
    categorical_cols = X_raw.select_dtypes(include=["object"]).columns.tolist()
    print("numeric_cols from df:", numeric_cols)
    print("categorical_cols from df:", categorical_cols)

    report, models, best_model = MLEngine.train(
        df, target_column="Edible", mode="fast"
    )
    print("=== PASSED ===")
    print(report)

except Exception:
    traceback.print_exc()
