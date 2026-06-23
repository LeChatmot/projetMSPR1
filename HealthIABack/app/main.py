from fastapi import FastAPI, UploadFile, File
from food import guess_image

app = FastAPI()


@app.post("/analyze")
async def analyze(image: UploadFile = File(...)):
    return await guess_image(image)