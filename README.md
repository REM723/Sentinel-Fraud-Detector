# Sentinel Fraud Detector

A Flask-based fraud detection demo for transaction data. This project exposes a simple web interface and API to score transactions using a pre-trained logistic regression pipeline saved as `Fraud_detection_pipeline.pkl`.

## Project Overview

The app lets users submit transaction details and returns:
- a fraud flag (`is_fraud`)
- a fraud probability score (`fraud_probability`)

The model is built to detect suspicious transactions based on:
- transaction type
- amount
- sender balance before/after
- receiver balance before/after

## Features

- Flask web app with live demo form
- JSON prediction endpoint at `/predict`
- Front-end UI powered by `templates/index.html` and `static/js/script.js`
- Uses `joblib` to load a serialized scikit-learn pipeline

## Requirements

- Python 3.8+ (recommended)
- Flask
- pandas
- joblib

## Dataset 
From Kaggle (Fraud Detection Dataset)
https://www.kaggle.com/datasets/amanalisiddiqui/fraud-detection-dataset


## Installation

1. Clone or open the repository.
2. Create and activate a virtual environment.

```bash
python -m venv venv
venv\Scripts\activate
```

3. Install dependencies.

```bash
pip install Flask pandas joblib
```

## Running the App

From the project root directory, run:

```bash
python app.py
```

Then open `http://127.0.0.1:5000/` in your browser.

## API Usage

### POST `/predict`

Request body (JSON):

```json
{
  "type": "TRANSFER",
  "amount": 1500.00,
  "oldbalanceOrg": 2000.00,
  "newbalanceOrig": 500.00,
  "oldbalanceDest": 100.00,
  "newbalanceDest": 1600.00
}
```

Response:

```json
{
  "is_fraud": false,
  "fraud_probability": 0.1234
}
```

## File Structure

- `app.py` — Flask application and prediction endpoint
- `templates/index.html` — front-end web interface
- `static/js/script.js` — AJAX form submission and result rendering
- `static/css/style.css` — app styling
- `Fraud_detection_pipeline.pkl` — serialized fraud detection model pipeline
- `AIML Dataset.csv` — dataset used for analysis or training reference
- `analysis_model.ipynb` — notebook for data exploration or model development

## Notes

- The app uses transaction types: `CASH_IN`, `CASH_OUT`, `DEBIT`, `PAYMENT`, `TRANSFER`.
- Make sure `Fraud_detection_pipeline.pkl` is present in the same directory as `app.py`.
- This demo is intended for prototype and demonstration purposes; validate carefully before using in production.

## License

Use and modify this repository freely for learning and experimentation.
