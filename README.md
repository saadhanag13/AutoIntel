# AutoIntel
AutoML Data-to-Decision Intelligence Platform

backend command: uvicorn backend.main:app --reload

Analytics Agent: (Analyze sales performance) - Analyze data and provide insights - Explain patterns and trends - Generate reports and visualizations

ML Prediction Agent: (Predict revenue for next quarter) - Provide prediction strategies - Explain machine learning models - Generate code for predictions

Data Cleaning Agent: (How to handle missing values) - Clean and preprocess data - Handle missing values - Generate code for data cleaning

Insight Agent: (Explain customer churn patterns) - Provide insights and explanations - Explain patterns and trends - Generate reports and visualizations

http://127.0.0.1:8000/agent/run?prompt=What%20is%20demand%20forecasting? 
http://127.0.0.1:8000/llm/generate?prompt=Hello 
http://localhost:8000/rag/query?question=hello

python -m tests.schema_test 
python -m tests.validator_test