const entryContainer = document.getElementById('entry-container');
const printButton = document.querySelector(".print");


function updateZebra() {
  const rows = entryContainer.querySelectorAll(".form-fields");
  rows.forEach((row, index) => {
    row.classList.remove("even", "odd");
    row.classList.add((index + 1) % 2 === 0 ? "even" : "odd");
  });
}


updateZebra();


entryContainer.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  const row = button.closest(".form-fields");
  const submitDiv = entryContainer.querySelector(".form-submit");

  if (button.classList.contains("add")) {
    const newRow = row.cloneNode(true);
    newRow.querySelectorAll("input, select").forEach(input => input.value = "");
    newRow.querySelector(".output").textContent = "";
    entryContainer.insertBefore(newRow, submitDiv);
    updateZebra();
  }

  if (button.classList.contains("minus")) {
    const allRows = entryContainer.querySelectorAll(".form-fields");
    if (allRows.length > 1) {
      row.remove();
      updateZebra();
    }
  }

  if (button.classList.contains("reset")) {
    row.querySelectorAll("input, select").forEach(input => input.value = "");
    const outputDiv = row.querySelector(".output");
    if (outputDiv) outputDiv.textContent = "";
  }
});

// Handle Submit
entryContainer.querySelector(".submit").addEventListener("click", (e) => {
  e.preventDefault();
  const rows = entryContainer.querySelectorAll(".form-fields");
  rows.forEach(row => {
    const reagent = row.querySelector(".reagents").value;
    const expirationDate = row.querySelector(".expirationdate").value;
    const expirationTime = row.querySelector(".expirationtime").value;

    const now = new Date();
    const expiration = new Date(`${expirationDate}T${expirationTime}`);
    const diffMs = expiration - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    row.querySelector(".output").textContent = diffHours;
    console.log("Reagent:", reagent, "Hours Remaining:", diffHours);
  });
});


printButton.addEventListener("click", () => {
  window.print();
});