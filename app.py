from flask import Flask, request, jsonify, render_template
import joblib
import pandas as pd

app = Flask(__name__)

model = joblib.load("Fraud_detection_pipeline.pkl")

TRANSACTION_TYPES = ["CASH_IN", "CASH_OUT", "DEBIT", "PAYMENT", "TRANSFER"]


@app.route("/")
def home():
    return render_template("index.html", transaction_types=TRANSACTION_TYPES)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)

    required = [
        "type",
        "amount",
        "oldbalanceOrg",
        "newbalanceOrig",
        "oldbalanceDest",
        "newbalanceDest",
    ]
    missing = [field for field in required if field not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    if data["type"] not in TRANSACTION_TYPES:
        return jsonify({"error": "Invalid transaction type"}), 400

    try:
        row = pd.DataFrame([{
            "type": data["type"],
            "amount": float(data["amount"]),
            "oldbalanceOrg": float(data["oldbalanceOrg"]),
            "newbalanceOrig": float(data["newbalanceOrig"]),
            "oldbalanceDest": float(data["oldbalanceDest"]),
            "newbalanceDest": float(data["newbalanceDest"]),
        }])
    except (TypeError, ValueError):
        return jsonify({"error": "Numeric fields must be valid numbers"}), 400

    prediction = int(model.predict(row)[0])
    probability = float(model.predict_proba(row)[0][1])

    return jsonify({
        "is_fraud": bool(prediction),
        "fraud_probability": round(probability, 4),
    })


if __name__ == "__main__":
    app.run(debug=True)
