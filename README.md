# WaterLevelDashboard


## Getting Started

You can run the project locally.

---

## Prerequisites

- Python 3.8+
- Node.js 16+

---

## Installation

1. **Clone the codebase:**
   ```bash
   git clone https://github.com/mjlee041/WaterLevelDashboard.git
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```
3. **Set up `.env` file** - add the following variable:
   - `GREAN_STREAM_API_KEY`

---

## Run Instructions

1. **Start the frontend** (in its own terminal tab):
   ```bash
   npm start
   ```

2. **Start the backend** (in its own terminal tab):
   ```bash
   uvicorn api:app --reload
   ```
---

## Local Access

| Service | URL |
|---|---|
| Frontend | http://localhost:3000/ |
| Backend Swagger UI | http://127.0.0.1:8000/docs |
