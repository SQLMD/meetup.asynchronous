const donateButton = document.getElementById("donate-button");
const warning = document.getElementById("unsupported");
const success = document.getElementById("success");
const error = document.getElementById("error");

// Check if your browser support PaymentRequest API support

if (window.PaymentRequest) {
  // Use Payment Request API
  donateButton.style.display = "block";
  warning.style.display = "none";
  success.style.display = "none";
  error.style.display = "none";
} else {
  donateButton.style.display = "none";
  warning.style.display = "block";
  success.style.display = "none";
  error.style.display = "none";
}

const displaySuccessMessage = () => {
  success.style.display = "block";
};
const displayErrorMessage = () => {
  error.style.display = "block";
};
const paymentMethods = [
  {
    supportedMethods: ["basic-card"],
    data: {
      supportedNetworks: ["visa", "matercard"]
    }
  }
];

const paymentDetails = {
  total: {
    label: "What you pay",
    amount: {
      currency: "USD",
      value: 80
    }
  },
  displayItems: [
    {
      label: "Promo code",
      amount: {
        currency: "USD",
        value: -10
      }
    }
  ]
};

const options = {
  requestPayerName: true,
  requestPayerEmail: true
};

function paymentButton() {
  const paymentRequest = new PaymentRequest(
    paymentMethods,
    paymentDetails,
    options
  );

  paymentRequest
    .show()
    .then(paymentResponse => {
      return new Promise((res, rej) => {
        setTimeout(() => {
          console.log("paymentResponse", paymentResponse);
          res(paymentResponse);
        }, 5000);
      }).then(paymentResponse => {
        console.log("paymentResponse", paymentResponse);
        paymentResponse.complete("success");
        displaySuccessMessage();
      });
    })
    .catch(err => {
      // API error or user cancelled the payment
      console.log("Error:", err);
      displayErrorMessage();
    });
}
donateButton.addEventListener("click", paymentButton);
