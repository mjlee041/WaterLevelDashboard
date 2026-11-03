from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import os
import requests
import httpx
import asyncio
from datetime import datetime
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

sensor_elevation = {
    "30440647-4152-4dea-94b6-c623a4c76eb4": 4599,
    "9ad953f0-2259-47e4-9d16-f46fea05badc": 4275,
    "867c5ecb-6b7b-4d78-8c11-933d71704df0": 5757,
    "f1571f66-5b53-4767-81a1-d3f0daa6c573": 3645,
    "ffc52330-32a7-4996-b78d-49bb8ddc39dd": 3308,
    "92279f85-e876-4f43-8e8b-38e36a213dd5": 5530,
    "9cfeef25-f451-4e05-84a0-abf588601ac2": 2876,
    "6a79c2e0-62b9-4a70-acf4-80117cc3d2f3": 4266,
    "d5cd5d7d-3e7e-4ce5-8742-88fa440cf1fa": 3420,
    "05b03e11-aea9-4d74-a4fa-dd9b557a8025": 2949,
    "9cb2d88e-2b29-4b97-bf51-fc786bf06762": 3485,
    "6c891fca-c758-470e-8a81-fb82fb0b5d0c": 3743,
    "33035148-e0aa-4323-a325-bffbb209518b": 3392,
    "d02977db-887c-49f3-9d4e-7420daea6886": 3463,
}


@app.get("/water_level")
def get_water_level(id, start):
    end = int(datetime.now().timestamp())

    params = {
        "id": id,
        "start": start,
        "end": end,
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
            senix = message.get('senix')
            event_date = message.get('eventDate')
            stage_list.append(sensor_elevation[params["id"]] - senix['mm'])
            event_date_list.append(event_date)
        multiple_stages.append(stage_list)
        multiple_dates.append(event_date_list)
    
    return {
        "ids": idlist,
        "stages": multiple_stages,
        "dates": multiple_dates
    }

@app.get("/api/fetch_less_points")
async def fetch_less_points(idlist: list[str] = Query(...), start: int = Query(...)):
    end = int(datetime.now().timestamp())
    

    # Dividing time into 3-day chunks since my assumption is that the endpoint allows to fectch the maximum of 3 days.
    # This is because when I pulled 1 week of data, it only fetched 3 days of data.
    CHUNK_SECONDS = 3 * 24 * 60 * 60
    intervals = []
    curr = start
    while curr < end:
        intervals.append((curr, min(curr + CHUNK_SECONDS, end)))
        curr += CHUNK_SECONDS

    # Timeout configuration since the default timeout (5 seconds) crashed the endpoint.
    # This is just a bandage. After some trials, we can get rid of this or shorten the timeout since it might affect performance.
    timeout_config = httpx.Timeout(30.0, connect=10.0)
    limits_config = httpx.Limits(max_keepalive_connections=20, max_connections=50)

    # Parallel Async clients 
    async with httpx.AsyncClient(timeout=timeout_config, limits=limits_config) as client:
        multiple_stages = []
        multiple_dates = []

        for sensor_id in idlist:
            tasks = [
                client.get(
                    f"{BASE_URL}/site/messages",
                    headers=headers,
                    params={"id": sensor_id, "start": s, "end": e}
                )
                for s, e in intervals
            ]
            # Parallel requests. return_exceptions prevents one slow chunk to crash the endpoint
            results = await asyncio.gather(*tasks, return_exceptions=True)

            stage_list = []
            event_date_list = []

            for res in results:
                for msg in res.json():
                    event_date = msg.get('eventDate')

                    # Hourly data
                    if event_date and event_date[14:16] == '00':
                        senix = msg.get('senix', {})
                        stage_list.append(sensor_elevation[sensor_id] - senix.get('mm'))
                        event_date_list.append(event_date)

            multiple_stages.append(stage_list)
            multiple_dates.append(event_date_list)

    return {
        "ids": idlist,
        "stages": multiple_stages,
        "dates": multiple_dates
    }