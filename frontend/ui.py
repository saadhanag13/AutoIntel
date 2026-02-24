import streamlit as st
import requests
import pandas as pd
import json

API_BASE = "http://127.0.0.1:8000"

st.set_page_config(
    page_title="AI Analytics Platform",
    layout="wide"
)

st.title("AI Analytics Platform")
st.caption("Fabric-Style Intelligent Analytics Dashboard")

# ---------------------------------------------------
# SESSION STATE INITIALIZATION
# ---------------------------------------------------
if "report" not in st.session_state:
    st.session_state.report = None

if "columns" not in st.session_state:
    st.session_state.columns = []

# ---------------------------------------------------
# SIDEBAR - DATA CONTROLS
# ---------------------------------------------------
st.sidebar.header("Data Controls")

uploaded_file = st.sidebar.file_uploader("Upload CSV Dataset", type=["csv"])

if uploaded_file is not None:
    with st.sidebar:
        with st.spinner("Uploading dataset..."):
            response = requests.post(
                f"{API_BASE}/ml/upload",
                files={"file": uploaded_file}
            )

        if response.status_code == 200:
            data = response.json()
            st.success("Dataset uploaded successfully")
            st.session_state.columns = data["columns"]
        else:
            st.error("Upload failed")

# Target selection
if st.session_state.columns:
    target_column = st.sidebar.selectbox(
        "Select Target Column",
        st.session_state.columns
    )

    if st.sidebar.button("Train Model"):
        with st.spinner("Training ML models..."):
            train_response = requests.post(
                f"{API_BASE}/ml/train",
                params={"target_column": target_column}
            )

        if train_response.status_code == 200:
            st.session_state.report = train_response.json()
            st.success("Training completed")
        else:
            st.error("Training failed")

# ---------------------------------------------------
# MAIN DASHBOARD
# ---------------------------------------------------
if st.session_state.report:

    report = st.session_state.report

    st.markdown("---")

    # ---------------- KPI CARDS ----------------
    col1, col2, col3, col4 = st.columns(4)

    col1.metric("Best Model", report.get("best_model", "-"))
    col2.metric("Score", round(report.get("best_score", 0), 4))
    col3.metric("Problem Type", report.get("problem_type", "-"))
    col4.metric("Primary Metric", report.get("primary_metric", "-"))

    st.markdown("---")

    # ---------------- MODEL COMPARISON ----------------
    st.subheader("Model Comparison")

    comparison = report.get("model_comparison", {})
    if comparison:
        df_scores = pd.DataFrame(comparison).T
        st.bar_chart(df_scores)

    # ---------------- FEATURE IMPORTANCE ----------------
    st.subheader("Feature Importance")

    feature_importance = report.get("feature_importance", [])
    if feature_importance:
        importance_df = pd.DataFrame(feature_importance)
        st.dataframe(importance_df, use_container_width=True)

    # ---------------- AI BUSINESS INSIGHTS ----------------
    st.subheader("AI Business Insights")

    if "ai_insights" in report:
        insights = report["ai_insights"]

        st.markdown("### Model Summary")
        st.write(insights.get("MODEL_SUMMARY", ""))

        st.markdown("### Performance Assessment")
        st.write(insights.get("PERFORMANCE_ASSESSMENT", ""))

        st.markdown("### Feature Impact")
        st.write(insights.get("FEATURE_IMPACT_SUMMARY", ""))

        st.markdown("### Recommendation")
        st.write(insights.get("RECOMMENDATION", ""))
    else:
        st.info("No AI insights available.")

    st.markdown("---")

    # ---------------- RAG / COPILOT PANEL ----------------
    st.subheader("Ask AI About Your Dataset")

    user_query = st.text_input("Ask a business question")

    if user_query:
        with st.spinner("Generating AI response..."):
            rag_response = requests.post(
                f"{API_BASE}/rag/query",
                json={"query": user_query}
            )

        if rag_response.status_code == 200:
            answer = rag_response.json()
            st.write(answer)
        else:
            st.error("RAG service unavailable")

else:
    st.info("Upload a dataset and train a model to view analytics dashboard.")