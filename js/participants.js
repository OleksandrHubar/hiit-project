document.addEventListener("DOMContentLoaded", function () {
  const numParticipantsInput = document.getElementById("numParticipants");
  const continueButton = document.getElementById("continueButton");
  const participantsForm = document.getElementById("participantsForm");
  const backButton = document.getElementById("backButton");

  // Повернення на стартову сторінку
  backButton.addEventListener("click", function () {
      window.location.href = "../index.html";
  });

  continueButton.addEventListener("click", function () {
      const numParticipants = parseInt(numParticipantsInput.value);

      if (numParticipants > 0 && numParticipants <= 10) {
          participantsForm.innerHTML = ""; // Очищаємо форму
          participantsForm.classList.remove("hidden");

          for (let i = 1; i <= numParticipants; i++) {
              const participantDiv = document.createElement("div");
              participantDiv.classList.add("participant-entry");
              participantDiv.innerHTML = `
                  <h3>Participant ${i}</h3>
                  <input type="text" class="participant-name" placeholder="Enter name" required>
                  <select class="participant-gender">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                  </select>
                  <input type="number" class="participant-calories" placeholder="Target Calories" min="10" required>
              `;
              participantsForm.appendChild(participantDiv);
          }

          const nextButton = document.createElement("button");
          nextButton.textContent = "Next";
          nextButton.id = "nextButton";
          participantsForm.appendChild(nextButton);

          nextButton.addEventListener("click", function () {
              const participants = [];
              document.querySelectorAll(".participant-entry").forEach(entry => {
                  const name = entry.querySelector(".participant-name").value.trim();
                  const gender = entry.querySelector(".participant-gender").value;
                  const calories = parseInt(entry.querySelector(".participant-calories").value);

                  if (name && calories >= 10) {
                      participants.push({ 
                          name, 
                          gender, 
                          targetCalories: calories, 
                          currentCalories: 0 
                      });
                  }
              });

              if (participants.length === numParticipants) {
                  localStorage.setItem("participants", JSON.stringify(participants));
                  window.location.href = "exercise_selection.html";
              } else {
                  alert("Please fill in all fields and ensure calories are at least 10.");
              }
          });
      } else {
          alert("Please enter a number between 1 and 10.");
      }
  });
});
