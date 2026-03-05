# insights/narrative_builder.py

from backend.services.hf_client import query_llm


def _call_llm(prompt: str, fallback: str) -> str:
    """Call Llama-3 via HuggingFace router; return fallback on any error."""
    try:
        messages = [{"role": "user", "content": prompt}]
        result = query_llm(messages)
        return result["choices"][0]["message"]["content"].strip()
    except Exception:
        return fallback


class NarrativeBuilder:

    @staticmethod
    def build_model_summary(problem_type, best_model, best_score, primary_metric):
        fallback = (
            f"The system identified {best_model} as the best-performing "
            f"{problem_type} model based on {primary_metric}, achieving a score of "
            f"{round(best_score, 4)}."
        )
        prompt = (
            f"You are a data science analyst. Write one concise paragraph summarising "
            f"an AutoML result: problem type is {problem_type}, the winning model is "
            f"{best_model}, {primary_metric} score is {round(best_score, 4)}. "
            f"Be professional, insightful, and under 80 words."
        )
        return _call_llm(prompt, fallback)

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
        fallback = (
            f"The model demonstrates {level} predictive performance "
            f"based on the {metric_name} metric."
        )
        prompt = (
            f"You are a data science analyst. In one concise paragraph (under 80 words), "
            f"assess the predictive performance of a model that scored {round(score, 4)} "
            f"on the {metric_name} metric. Performance level: {level}. "
            f"Mention what this means for real-world use and any caveats."
        )
        return _call_llm(prompt, fallback)

    @staticmethod
    def build_feature_impact_summary(feature_importance):
        if not feature_importance:
            return "Feature importance information is not available."
        top_features = feature_importance[:5]
        feature_text = ", ".join(
            [f"{f['feature']} ({round(f['importance'], 3)})" for f in top_features]
        )
        fallback = (
            f"The most influential features driving predictions are: {feature_text}."
        )
        prompt = (
            f"You are a data science analyst. In one concise paragraph (under 100 words), "
            f"explain the business significance of the top predictive features: {feature_text}. "
            f"Describe what these features likely represent and why they drive predictions."
        )
        return _call_llm(prompt, fallback)

    @staticmethod
    def build_recommendation(score):
        if score >= 0.9:
            fallback = "The model is suitable for production deployment."
        elif score >= 0.8:
            fallback = "The model is reliable but may benefit from further tuning."
        else:
            fallback = "Additional feature engineering and model tuning are recommended."
        prompt = (
            f"You are a senior ML engineer. In one concise paragraph (under 80 words), "
            f"give a practical recommendation for a model that scored {round(score, 4)}. "
            f"Mention next steps: deployment readiness, tuning, or data collection needs."
        )
        return _call_llm(prompt, fallback)
