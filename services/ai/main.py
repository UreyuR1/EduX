from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import chat, rag, insights, messages

load_dotenv()

app = FastAPI(title="EduX AI Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(rag.router, prefix="/rag", tags=["rag"])
app.include_router(insights.router, prefix="/insights", tags=["insights"])
app.include_router(messages.router, prefix="/messages", tags=["messages"])


@app.get("/health")
async def health():
    return {"status": "ok"}
