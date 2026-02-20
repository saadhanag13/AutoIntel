import joblib
import os


class ModelSaver:

    @staticmethod
    def save(model, preprocessor=None, save_dir="saved_models", model_name="best_model"):

        os.makedirs(save_dir, exist_ok=True)

        model_path = os.path.join(save_dir, f"{model_name}.pkl")
        joblib.dump(model, model_path)

        if preprocessor:
            preprocessor_path = os.path.join(save_dir, "preprocessor.pkl")
            joblib.dump(preprocessor, preprocessor_path)

        return {
            "model_path": model_path,
            "preprocessor_path": preprocessor_path if preprocessor else None
        }
