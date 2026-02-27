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

  // Email Validation Function
  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Prevent Past Date/Time 
  function isFutureDateTime() {
    if (!dateInput.value || !timeSelect.value) return false;

    const selectedDateTime = new Date(`${dateInput.value}T${timeSelect.value}`);
    const now = new Date();

    return selectedDateTime > now;
  }

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

  const isEmailValid = isValidEmail(emailInput.value);

  // Remove all validation styling first
  emailInput.classList.remove("is-invalid");

  // Only show error if user typed something and it's invalid
  if (emailInput.value.length > 0 && !isEmailValid) {
    emailInput.classList.add("is-invalid");
  }

  if (
  serviceSelect.value &&
  dateInput.value &&
  timeSelect.value &&
  nameInput.value.trim().length > 1 &&
  isEmailValid &&
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
