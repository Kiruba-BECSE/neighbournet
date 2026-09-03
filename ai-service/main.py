from fastapi import FastAPI, File, UploadFile
from ultralytics import YOLO
from PIL import Image
import io

app = FastAPI()

MODEL_PATH = "yolov8n.pt"  # swap with a pothole/garbage-trained model later
model = YOLO(MODEL_PATH)

RELEVANT_CLASSES = {
    "pothole": "Road",
    "car": "Road",
    "truck": "Road",
    "trash": "Sanitation",
    "person": None  # ignored
}

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    results = model.predict(image, conf=0.25)
    detections = []

    for r in results:
        for box in r.boxes:
            cls_name = model.names[int(box.cls[0])]
            confidence = float(box.conf[0])
            detections.append({"object": cls_name, "confidence": round(confidence, 2)})

    if not detections:
        return {"object": "unknown", "confidence": 0.0, "detections": []}

    top = max(detections, key=lambda d: d["confidence"])
    return {"object": top["object"], "confidence": top["confidence"], "detections": detections}


@app.get("/")
def root():
    return {"status": "AI service running"}