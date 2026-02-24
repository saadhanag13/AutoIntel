from ml_engine.engine import MLEngine

def run_training(df, target_column):

    report, models, best_model = MLEngine.train(
        df,
        target_column= target_column,
        mode="advanced"
    )

    return report