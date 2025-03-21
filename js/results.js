document.addEventListener("DOMContentLoaded", function () {
  const resultsContainer = document.getElementById("resultsContainer");
  const restartButton = document.getElementById("restartButton");

  let participants = JSON.parse(localStorage.getItem("participants")) || [];
  let workoutProgress = JSON.parse(localStorage.getItem("workoutProgress")) || [];

  if (participants.length === 0) {
      resultsContainer.innerHTML = "<p>No data available. Start a new workout.</p>";
      return;
  }

  participants.sort((a, b) => b.currentCalories - a.currentCalories); // Сортуємо за кількістю калорій

  participants.forEach((participant, index) => {
      let placeColor = index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "#cd7f32" : "green";

      let participantDiv = document.createElement("div");
      participantDiv.classList.add("participant-result");
      participantDiv.style.border = `3px solid ${placeColor}`;

      let nameHeader = document.createElement("h2");
      nameHeader.textContent = `${participant.name} - ${participant.currentCalories} kcal`;
      participantDiv.appendChild(nameHeader);

      // Додаємо Progress Circle
      let progressCircle = document.createElement("div");
      progressCircle.classList.add("progress-circle");
      let progressPercentage = (participant.currentCalories / participant.targetCalories) * 360;
      progressCircle.style.background = `conic-gradient(purple ${progressPercentage}deg, #ccc 0deg)`;

      participantDiv.appendChild(progressCircle);

      let exerciseList = document.createElement("ul");

      let totalReps = 0; // Підрахунок всіх повторів

      if (participant.exerciseStats) {
          for (let exercise in participant.exerciseStats) {
              let stats = participant.exerciseStats[exercise];
              totalReps += stats.totalReps;
              let listItem = document.createElement("li");
              listItem.textContent = `${exercise}: ${stats.totalReps} reps (${stats.timesSelected} times) - ${stats.caloriesBurned.toFixed(2)} kcal`;
              exerciseList.appendChild(listItem);
          }
      }

      let totalCalories = document.createElement("p");
      totalCalories.textContent = `Total Calories Burned: ${participant.currentCalories}`;
      participantDiv.appendChild(totalCalories);

      let totalRepsElement = document.createElement("p");
      totalRepsElement.textContent = `Total Repetitions: ${totalReps}`;
      participantDiv.appendChild(totalRepsElement);

      participantDiv.appendChild(exerciseList);
      resultsContainer.appendChild(participantDiv);
  });

  restartButton.addEventListener("click", function () {
      localStorage.clear();
      window.location.href = "../index.html";
  });
});
