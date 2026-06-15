const form = document.getElementById("predict-form");
const resultBox = document.getElementById("result");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    type: document.getElementById("type").value,
    amount: document.getElementById("amount").value,
    oldbalanceOrg: document.getElementById("oldbalanceOrg").value,
    newbalanceOrig: document.getElementById("newbalanceOrig").value,
    oldbalanceDest: document.getElementById("oldbalanceDest").value,
    newbalanceDest: document.getElementById("newbalanceDest").value,
  };

  submitBtn.disabled = true;
  submitBtn.querySelector(".btn__text").textContent = "Analyzing...";

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      renderError(data.error || "Something went wrong. Please try again.");
      return;
    }

    renderResult(data);
  } catch (err) {
    renderError("Could not reach the prediction service.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector(".btn__text").textContent = "Analyze transaction";
  }
});

function renderResult(data) {
  const probability = data.fraud_probability;
  const isFraud = data.is_fraud;
  const percent = (probability * 100).toFixed(2);

  const statusClass = isFraud ? "result__status--fraud" : "result__status--safe";
  const barClass = isFraud ? "result__bar-fill--fraud" : "result__bar-fill--safe";
  const statusText = isFraud ? "Flagged as fraudulent" : "Looks legitimate";
  const note = isFraud
    ? "This transaction shares strong patterns with confirmed fraud cases, such as unusual balance changes relative to the amount moved. Consider holding it for review."
    : "This transaction matches typical legitimate activity based on its type, amount, and balance changes.";

  resultBox.innerHTML = `
    <div class="result">
      <div class="result__status ${statusClass}">
        <span class="result__dot"></span>
        ${statusText}
      </div>
      <div class="result__score">${percent}%</div>
      <div class="result__score-label">Estimated fraud probability</div>
      <div class="result__bar">
        <div class="result__bar-fill ${barClass}" style="width: ${percent}%"></div>
      </div>
      <div class="result__note">${note}</div>
    </div>
  `;
}

function renderError(message) {
  resultBox.innerHTML = `
    <div class="result">
      <div class="result__icon">!</div>
      <p class="result__error">${message}</p>
    </div>
  `;
}
