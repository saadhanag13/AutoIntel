# insights/narrative_builder.py

class NarrativeBuilder:

    @staticmethod
    def build_model_summary(problem_type, best_model, best_score, primary_metric):
        return (
            f"The system identified {best_model} as the best-performing "
            f"{problem_type} model based on {primary_metric}, achieving a score of "
            f"{round(best_score, 4)}."
        )

    @staticmethod
    def build_performance_assessment(score, metric_name):
        if score >= 0.9:
            level = "excellent"
        elif score >= 0.8:
            level = "strong"
        elif score >= 0.7:
            level = "moderate"
        else:
            level = "weak"

        return (
            f"The model demonstrates {level} predictive performance "
            f"based on the {metric_name} metric."
        )

    @staticmethod
    def build_feature_impact_summary(feature_importance):
        if not feature_importance:
            return "Feature importance information is not available."

        top_features = feature_importance[:3]

        feature_text = ", ".join(
            [f"{f['feature']} ({round(f['importance'], 3)})" for f in top_features]
        )

        return (
            f"The most influential features driving predictions are: {feature_text}."
        )

    @staticmethod
    def build_recommendation(score):
        if score >= 0.9:
            return "The model is suitable for production deployment."
        elif score >= 0.8:
            return "The model is reliable but may benefit from further tuning."
        else:
            return "Additional feature engineering and model tuning are recommended."
