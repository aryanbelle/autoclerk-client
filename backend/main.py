from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from groq import Groq
from pathlib import Path

load_dotenv(dotenv_path=Path(__file__).resolve().parent / '.env')

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
groq_api_key = os.environ.get("GROQ_API_KEY")
if not groq_api_key:
    raise RuntimeError("GROQ_API_KEY environment variable is not set")
client = Groq(api_key=groq_api_key)

from pydantic import BaseModel
from typing import List, Dict

class ChatRequest(BaseModel):
    prompt: str
    history: List[Dict[str, str]] = []

@app.post("/chat")
async def chat_with_llm(request: ChatRequest):
    try:
        messages = [
            {
                "role": "system",
                "content": "You are Autoclerk, a friendly AI assistant specialized in finance and office automation. "
            }
        ] + request.history + [
            {
                "role": "user",
                "content": request.prompt,
            }
        ]

        chat_completion = client.chat.completions.create(
            messages=messages,
            # model="llama3-70b-8192",  # Still using Llama model but with Autoclerk identity
            model="openai/gpt-oss-20b"
        )
        return {"response": chat_completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))