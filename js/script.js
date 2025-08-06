document.addEventListener("DOMContentLoaded", () => {
  // Form fields
  const cardholderInput = document.getElementById("cardholder");
  const cardnumberInput = document.getElementById("cardnumber");
  const expmonthInput = document.getElementById("expmonth");
  const expyearInput = document.getElementById("expyear");
  const cvcInput = document.getElementById("cvc");
  const confirmBtn = document.querySelector(".confirm-btn");
  const form = document.querySelector(".card-form");

  // Card display elements
  const cardNumberDisplay = document.querySelector(".card-number");
  const cardNameDisplay = document.querySelector(".card-name");
  const cardMonthDisplay = document.querySelector(".card-month");
  const cardYearDisplay = document.querySelector(".card-year");
  const cardCvcDisplay = document.querySelector(".card-cvc");

  // Tracking touched fields
  const touchedFields = {
    cardholder: false,
    cardnumber: false,
    expmonth: false,
    expyear: false,
    cvc: false,
  };

  // Format card number
  function formatCardNumber(value) {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  // Update card preview display
  function updateCardDisplay() {
    cardNumberDisplay.textContent = cardnumberInput.value
      ? formatCardNumber(cardnumberInput.value)
      : "0000 0000 0000 0000";
    cardNameDisplay.textContent = cardholderInput.value
      ? cardholderInput.value.toUpperCase()
      : "JANE APPLESEED";
    cardMonthDisplay.textContent = expmonthInput.value
      ? expmonthInput.value.padStart(2, "0")
      : "00";
    cardYearDisplay.textContent = expyearInput.value
      ? expyearInput.value.padStart(2, "0")
      : "00";
    cardCvcDisplay.textContent = cvcInput.value ? cvcInput.value : "000";
  }

  // // Flip card on CVC focus
  // cvcInput.addEventListener("focus", () => {
  //   document.querySelector(".card-container").classList.add("flipped");
  // });

  // cvcInput.addEventListener("blur", () => {
  //   document.querySelector(".card-container").classList.remove("flipped");
  // });

  // Error handling helpers
  function showError(input, message) {
    input.classList.add("error");
    document.getElementById(input.id + "-error").textContent = message;
  }

  function clearError(input) {
    input.classList.remove("error");
    document.getElementById(input.id + "-error").textContent = "";
  }

  // Validation logic
  function validateForm(forceShowErrors = false) {
    let valid = true;

    // Cardholder
    if (!cardholderInput.value.trim()) {
      if (forceShowErrors || touchedFields.cardholder) {
        showError(cardholderInput, "Can't be blank");
      }
      valid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(cardholderInput.value)) {
      if (forceShowErrors || touchedFields.cardholder) {
        showError(cardholderInput, "Only letters and spaces allowed");
      }
      valid = false;
    } else {
      clearError(cardholderInput);
    }

    // Card number
    const cardNumberValue = cardnumberInput.value.replace(/\s/g, "");
    if (!cardnumberInput.value.trim()) {
      if (forceShowErrors || touchedFields.cardnumber) {
        showError(cardnumberInput, "Can't be blank");
      }
      valid = false;
    } else if (!/^\d[\d\s]*$/.test(cardnumberInput.value)) {
      if (forceShowErrors || touchedFields.cardnumber) {
        showError(cardnumberInput, "Only numbers are allowed");
      }
      valid = false;
    } else if (cardNumberValue.length !== 16) {
      if (forceShowErrors || touchedFields.cardnumber) {
        showError(cardnumberInput, "Card number must be 16 digits");
      }
      valid = false;
    } else {
      clearError(cardnumberInput);
    }

    // Exp month
    if (!expmonthInput.value.trim()) {
      if (forceShowErrors || touchedFields.expmonth) {
        showError(expmonthInput, "Can't be blank");
      }
      valid = false;
    } else if (!/^\d+$/.test(expmonthInput.value)) {
      if (forceShowErrors || touchedFields.expmonth) {
        showError(expmonthInput, "Only numbers are allowed");
      }
      valid = false;
    } else if (!/^(0[1-9]|1[0-2])$/.test(expmonthInput.value)) {
      if (forceShowErrors || touchedFields.expmonth) {
        showError(expmonthInput, "Invalid month");
      }
      valid = false;
    } else {
      clearError(expmonthInput);
    }

    // Exp year
    if (!expyearInput.value.trim()) {
      if (forceShowErrors || touchedFields.expyear) {
        showError(expyearInput, "Can't be blank");
      }
      valid = false;
    } else if (!/^\d+$/.test(expyearInput.value)) {
      if (forceShowErrors || touchedFields.expyear) {
        showError(expyearInput, "Only numbers are allowed");
      }
      valid = false;
    } else if (!/^\d{2}$/.test(expyearInput.value)) {
      if (forceShowErrors || touchedFields.expyear) {
        showError(expyearInput, "Invalid year");
      }
      valid = false;
    } else {
      clearError(expyearInput);
    }

    // CVC
    if (!cvcInput.value.trim()) {
      if (forceShowErrors || touchedFields.cvc) {
        showError(cvcInput, "Can't be blank");
      }
      valid = false;
    } else if (!/^\d+$/.test(cvcInput.value)) {
      if (forceShowErrors || touchedFields.cvc) {
        showError(cvcInput, "Only numbers are allowed");
      }
      valid = false;
    } else if (cvcInput.value.length !== 3) {
      if (forceShowErrors || touchedFields.cvc) {
        showError(cvcInput, "CVC must be 3 digits");
      }
      valid = false;
    } else {
      clearError(cvcInput);
    }

    confirmBtn.disabled = !valid;
    return valid;
  }

  // Input events: track touched + live update
  [
    cardholderInput,
    cardnumberInput,
    expmonthInput,
    expyearInput,
    cvcInput,
  ].forEach((input) => {
    input.addEventListener("input", () => {
      touchedFields[input.id] = true;
      updateCardDisplay();
      validateForm(); // Only shows errors if touched
    });
  });

  // Confirm button (form submission)
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const isValid = validateForm(true); // Show all errors
    if (!isValid) return;

    form.style.display = "none";
    document.querySelector(".complete-state").style.display = "flex";
  });

  // Continue button (reset form)
  document
    .querySelector(".continue-btn")
    .addEventListener("click", function () {
      form.reset();
      Object.keys(touchedFields).forEach((key) => (touchedFields[key] = false));
      updateCardDisplay();
      //validateForm(); // reset button disabled state
      confirmBtn.disabled = false;
      form.style.display = "flex";
      document.querySelector(".complete-state").style.display = "none";
    });

  // Just update card display on load (no validation)
  updateCardDisplay();
});
