# insights/insight_generator.py

from insights.narrative_builder import NarrativeBuilder


class InsightGenerator:

    @staticmethod
    def generate(report):

        problem_type = report.get("problem_type")
        best_model = report.get("best_model")
        best_score = report.get("best_score")
        primary_metric = report.get("primary_metric")
        feature_importance = report.get("feature_importance", [])

        insights = {
            "model_summary": NarrativeBuilder.build_model_summary(
                problem_type, best_model, best_score, primary_metric
            ),
            "performance_assessment": NarrativeBuilder.build_performance_assessment(
                best_score, primary_metric
            ),
            "feature_impact_summary": NarrativeBuilder.build_feature_impact_summary(
                feature_importance
            ),
            "recommendation": NarrativeBuilder.build_recommendation(best_score),
        }

        return insights
