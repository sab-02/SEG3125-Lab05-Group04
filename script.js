document.addEventListener("DOMContentLoaded", function () {

  const serviceSelect = document.getElementById("serviceSelect");
  const dateInput = document.getElementById("dateInput");
  const timeSelect = document.getElementById("timeSelect");
  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const stylistSelect = document.getElementById("stylistSelect");
  const confirmBtn = document.getElementById("confirmBtn");
  const bookingSummary = document.getElementById("bookingSummary");
  const confirmationMessage = document.getElementById("confirmationMessage");

  // Prevent Past Dates 
  const today = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("min", today);

  // Auto-format phone number
  phoneInput.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, "");
    
    if (value.length > 3 && value.length <= 6)
      value = value.slice(0,3) + "-" + value.slice(3);
    else if (value.length > 6)
      value = value.slice(0,3) + "-" + value.slice(3,6) + "-" + value.slice(6,10);

    this.value = value;
    checkFormValidity();
  });


  // Auto-format card number
  cardNumber.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, "").substring(0,16);
    value = value.match(/.{1,4}/g);
    this.value = value ? value.join(" ") : "";
    checkFormValidity();
  });


  // Auto-format expiry
  cardExpiry.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, "").substring(0,4);

    if (value.length >= 3)
      value = value.slice(0,2) + "/" + value.slice(2);

    this.value = value;
    checkFormValidity();
  });

  // Limit CVV to 3 digits
  cardCVV.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").substring(0,3);
    checkFormValidity();
  });

  // Name Validation Function
  function isValidName(name) {
  const regex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
  return regex.test(name.trim());
}
  // Email Validation Function
  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Phone Validation Function
  function isValidPhone(phone) {
    const regex = /^\d{3}-\d{3}-\d{4}$/;
    return regex.test(phone);
  }

  // Credit Card Validation Function
  function isValidCardNumber(card) {
    const regex = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/;
    return regex.test(card);
  }

  // Expiry Validation Function
  function isValidExpiry(expiry) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return regex.test(expiry);
  }

  // CVV Validation Function
  function isValidCVV(cvv) {
    const regex = /^\d{3}$/;
    return regex.test(cvv);
  }


  // Prevent Past Date/Time 
  function isFutureDateTime() {
    if (!dateInput.value || !timeSelect.value) return false;

    const selectedDateTime = new Date(`${dateInput.value}T${timeSelect.value}`);
    const now = new Date();

    return selectedDateTime > now;
  }

 
// Prevent Weekend Selection

dateInput.addEventListener("change", function () {

  dateInput.classList.remove("is-invalid");

  if (!dateInput.value) return;

  const selectedDate = new Date(dateInput.value + "T00:00:00");
  const day = selectedDate.getDay();

  const isWeekend = (day === 0 || day === 6);

  if (isWeekend) {
    dateInput.classList.add("is-invalid");
    dateInput.value = "";
  }

  updateSummary();
  checkFormValidity();
});

  // Update Summary
  function updateSummary() {
    const service = serviceSelect.value;
    const date = dateInput.value;
    const time = timeSelect.value;
    const stylist = stylistSelect.value;


    if (!service && !date && !time) {
      bookingSummary.innerHTML = `<p class="text-muted">No selection yet.</p>`;
      confirmBtn.disabled = true;
      return;
    }

    bookingSummary.innerHTML = `
      <div class="mb-3">
        <strong>Service:</strong><br>
        ${service || "—"}
      </div>
      <div class="mb-3">
        <strong>Stylist:</strong><br>
        ${stylist || "—"}
      </div>
      <div class="mb-3">
        <strong>Date:</strong><br>
        ${date || "—"}
      </div>
      <div class="mb-3">
        <strong>Time:</strong><br>
        ${time || "—"}
      </div>
    `;


    checkFormValidity();
  }

  // Enable Button Only When Valid
 function checkFormValidity() {

  const isNameValid = isValidName(nameInput.value);
  const isEmailValid = isValidEmail(emailInput.value);
  const isPhoneValid = isValidPhone(phoneInput.value);
  const isCardValid = isValidCardNumber(cardNumber.value);
  const isExpiryValid = isValidExpiry(cardExpiry.value);
  const isCVVValid = isValidCVV(cardCVV.value);

  // Remove previous invalid styles
  nameInput.classList.remove("is-invalid");
  emailInput.classList.remove("is-invalid");
  phoneInput.classList.remove("is-invalid");
  cardNumber.classList.remove("is-invalid");
  cardExpiry.classList.remove("is-invalid");
  cardCVV.classList.remove("is-invalid");

  // Show invalid styling only if user typed something wrong

  if (nameInput.value.length > 0 && !isNameValid)
    nameInput.classList.add("is-invalid");

  if (emailInput.value.length > 0 && !isEmailValid)
    emailInput.classList.add("is-invalid");

  if (phoneInput.value.length > 0 && !isPhoneValid)
    phoneInput.classList.add("is-invalid");

  if (cardNumber.value.length > 0 && !isCardValid)
    cardNumber.classList.add("is-invalid");

  if (cardExpiry.value.length > 0 && !isExpiryValid)
    cardExpiry.classList.add("is-invalid");

  if (cardCVV.value.length > 0 && !isCVVValid)
    cardCVV.classList.add("is-invalid");


  if (
    serviceSelect.value &&
    dateInput.value &&
    timeSelect.value &&
    isValidName(nameInput.value) &&
    isEmailValid &&
    isPhoneValid &&
    isCardValid &&
    isExpiryValid &&
    isCVVValid &&
    isFutureDateTime()
  ) {
    confirmBtn.disabled = false;
  } else {
    confirmBtn.disabled = true;
  }
}


  // Confirm Booking 
  confirmBtn.addEventListener("click", function () {

    const ref = "HS" + Math.floor(Math.random() * 100000);

    confirmationMessage.innerHTML = `
      <strong>Appointment Confirmed!</strong><br>
      Reference #: ${ref}<br>
      Confirmation sent to ${emailInput.value}
    `;

    confirmationMessage.classList.remove("d-none");
    confirmBtn.disabled = true;

    confirmationMessage.scrollIntoView({ behavior: "smooth" });
  });

  // Listeners 
  serviceSelect.addEventListener("change", updateSummary);
  dateInput.addEventListener("change", updateSummary);
  timeSelect.addEventListener("change", updateSummary);
  nameInput.addEventListener("input", checkFormValidity);
  emailInput.addEventListener("input", checkFormValidity);
  phoneInput.addEventListener("input", checkFormValidity);
  cardNumber.addEventListener("input", checkFormValidity);
  cardExpiry.addEventListener("input", checkFormValidity);
  cardCVV.addEventListener("input", checkFormValidity);
  stylistSelect.addEventListener("change", updateSummary);

});

//Ensure that service chosen is filled out on the form
const serviceButtons = document.querySelectorAll(".select-service");

serviceButtons.forEach(button => {
  button.addEventListener("click", function () {

    // Get service from button
    const selectedService = this.getAttribute("data-service");

    // Set dropdown value
    serviceSelect.value = selectedService;

    // Highlight selected card
    document.querySelectorAll(".service-card").forEach(card => {
      card.classList.remove("selected");
    });

    this.closest(".service-card").classList.add("selected");

    // Update summary
    updateSummary();
  });
});
