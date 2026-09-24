from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import os
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv

## API Doc: https://docs.greenstream.cloud/

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

API_KEY = os.getenv("GREAN_STREAM_API_KEY")
BASE_URL = "https://api.greenstream.cloud"

headers = {
    "x-api-key": API_KEY,
    "Content-Type": "application/json"
}

now = datetime.now()

time_offsets = {
    "1h": int((now - timedelta(hours=1)).timestamp()),
    "3h": int((now - timedelta(hours=3)).timestamp()),
    "6h": int((now - timedelta(hours=6)).timestamp()),
    "12h": int((now - timedelta(hours=12)).timestamp()),
    "24h": int((now - timedelta(hours=24)).timestamp())
}

@app.get("/water_level")
def get_water_level(id, start):
    end = int(datetime.now().timestamp())

    params = {
        "id": id,
        "start": start,
        "end": end
    }

    response = requests.get(f"{BASE_URL}/site/messages", headers=headers, params=params)
    messages = response.json()
    stage_list = []
    event_date_list = []
    for message in messages:
        stage = message.get('stage')
        event_date = message.get('eventDate')
        stage_list.append(stage)
        event_date_list.append(event_date)
    
    return stage_list, event_date_list

@app.get("/api/three_water_level")
def three_water_level(idlist: list[str] = Query(...), start: int = Query(...)):
    end = int(datetime.now().timestamp())
    multiple_stages = []
    multiple_dates = []

    for id in idlist:
        params = {
        "id": id,
        "start": start,
        "end": end
        }

        response = requests.get(f"{BASE_URL}/site/messages", headers=headers, params=params)
        messages = response.json()
        stage_list = []
        event_date_list = []
        for message in messages:
            stage = message.get('stage')
            event_date = message.get('eventDate')
            stage_list.append(stage)
            event_date_list.append(event_date)
        multiple_stages.append(stage_list)
        multiple_dates.append(event_date_list)
    
    return {
        "ids": idlist,
        "stages": multiple_stages,
        "dates": multiple_dates
    }