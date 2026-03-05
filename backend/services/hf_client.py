import os
import logging
import requests
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

HF_API_KEY = os.getenv("HF_TOKEN")

API_URL = "https://router.huggingface.co/v1/chat/completions"

# The model must be available on the HF Serverless Inference Router.
# See: https://huggingface.co/models?inference=warm&sort=trending
MODEL_ID = "meta-llama/Llama-3.1-8B-Instruct"

headers = {
    "Authorization": f"Bearer {HF_API_KEY}",
    "Content-Type": "application/json"
}

def query_llm(messages):
    payload = {
        "model": MODEL_ID,
        "messages": messages,
        "max_tokens": 2000,
        "temperature": 0.7
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    if not response.ok:
        logger.error("HF API error %s: %s", response.status_code, response.text)
        raise RuntimeError(
            f"LLM request failed [{response.status_code}]: {response.json().get('error', {}).get('message', response.text)}"
        )

    return response.json()
