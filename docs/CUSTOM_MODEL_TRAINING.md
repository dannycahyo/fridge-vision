# Custom Food Detection Model Training Pipeline

## Step 1: Environment Setup

```bash
# Create conda environment
conda create -n food-detection python=3.8
conda activate food-detection

# Install dependencies
pip install torch torchvision ultralytics
pip install tensorflow tensorflowjs
pip install roboflow supervision
```

## Step 2: Dataset Preparation

```python
# download_food_dataset.py
import roboflow

# Use Food detection dataset from Roboflow
rf = roboflow.Roboflow(api_key="YOUR_API_KEY")
project = rf.workspace("food-detection").project("food-ingredients")
dataset = project.version(1).download("yolov8")

# Or use Food101 dataset
from torchvision.datasets import Food101
dataset = Food101(root='./data', download=True)
```

## Step 3: Model Training

```python
# train_food_model.py
from ultralytics import YOLO

# Load pre-trained YOLOv8 model
model = YOLO('yolov8n.pt')

# Train on food dataset
results = model.train(
    data='food_dataset.yaml',  # Dataset configuration
    epochs=100,
    imgsz=640,
    batch=16,
    name='food-detection-v1'
)

# Export to ONNX for web deployment
model.export(format='onnx', optimize=True)
```

## Step 4: Convert to TensorFlow.js

```python
# convert_to_tfjs.py
import tensorflow as tf
from tensorflow.python.tools import freeze_graph
import tensorflowjs as tfjs

# Convert ONNX to TensorFlow SavedModel
import tf2onnx

# Convert to TensorFlow.js
tfjs.converters.save_keras_model(
    model,
    './web_model',
    quantization_bytes=1  # Optimize for web
)
```

## Step 5: Integration

```typescript
// Replace COCO-SSD import with custom model
import * as tf from '@tensorflow/tfjs';

const loadCustomFoodModel = async () => {
  const model = await tf.loadLayersModel(
    '/models/food-detection/model.json',
  );
  return model;
};

// Preprocess image for custom model
const preprocessImage = (
  imageElement: HTMLImageElement | HTMLVideoElement,
) => {
  return tf.browser
    .fromPixels(imageElement)
    .resizeNearestNeighbor([640, 640])
    .div(255.0)
    .expandDims(0);
};

// Run inference
const predict = async (model: tf.LayersModel, imageElement: any) => {
  const preprocessed = preprocessImage(imageElement);
  const predictions = (await model.predict(
    preprocessed,
  )) as tf.Tensor;
  return predictions;
};
```

## Dataset Recommendations

### Food101 Dataset

- **Classes:** 101 food categories
- **Images:** 101,000 images
- **Use Case:** General food classification
- **Download:** `torchvision.datasets.Food101`

### UEC FOOD-256 Dataset

- **Classes:** 256 food categories
- **Images:** 25,600 images
- **Focus:** Japanese cuisine
- **Better for:** Ingredient-level detection

### Open Images Food Subset

- **Classes:** 1000+ food-related classes
- **Images:** 100,000+ annotated food images
- **Annotations:** Bounding boxes included
- **Best for:** Object detection training

### Custom Kitchen Ingredients Dataset

```python
# Create custom dataset for kitchen-specific ingredients
ingredients_classes = [
    'apple', 'banana', 'tomato', 'onion', 'carrot', 'potato',
    'egg', 'milk', 'cheese', 'bread', 'chicken', 'beef',
    'lettuce', 'bell_pepper', 'cucumber', 'broccoli',
    'garlic', 'ginger', 'lemon', 'lime', 'avocado', 'mushroom'
]

# Use transfer learning from Food101
model = YOLO('yolov8n.pt')
model.train(
    data='kitchen_ingredients.yaml',
    epochs=50,
    classes=ingredients_classes
)
```

## Performance Optimization for Web

```javascript
// Model optimization techniques
const optimizedModel = {
  // 1. Quantization
  quantization: 'int8', // Reduce model size by 75%

  // 2. Pruning
  pruning: 0.5, // Remove 50% of weights

  // 3. Input optimization
  inputSize: [416, 416], // Smaller input = faster inference

  // 4. Batch processing
  batchSize: 1, // Single image processing
};
```

## Cost-Benefit Analysis

| Solution               | Development Time | Accuracy | Cost             | Maintenance |
| ---------------------- | ---------------- | -------- | ---------------- | ----------- |
| Google Vision API      | 1-2 days         | 95%+     | $1.50/1000 calls | Low         |
| Pre-trained Food Model | 1 week           | 80-85%   | Free             | Medium      |
| Custom Trained Model   | 1-2 months       | 90%+     | Training costs   | High        |
