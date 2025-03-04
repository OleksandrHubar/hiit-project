document.addEventListener("DOMContentLoaded", function () {
  const participantButtons = document.getElementById("participantList");
  const exerciseButtons = document.getElementById("exerciseButtons");
  const logExerciseButton = document.getElementById("logExercise");
  const repsInput = document.getElementById("repsInput");
  const progressList = document.getElementById("progressList");
  const endWorkoutButton = document.getElementById("endWorkout");
  const backButton = document.getElementById("backButton");
  const globalTimer = document.getElementById("globalTimer");

  let selectedParticipant = null;
  let selectedExercise = null;
  let workoutProgress = [];

  let participants = JSON.parse(localStorage.getItem("participants")) || [];
  const selectedExercises = JSON.parse(localStorage.getItem("selectedExercises")) || [];
  const exerciseDatabase = JSON.parse(localStorage.getItem("exerciseDatabase")) || [];

  function updateGlobalTimer() {
      let startTime = Date.now();
      setInterval(() => {
          let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
          let minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
          let seconds = String(elapsedTime % 60).padStart(2, '0');
          globalTimer.textContent = `${minutes}:${seconds}`;
      }, 1000);
  }

  const participantColors = ["#FF5733", "#33FF57", "#3357FF", "#F4C724", "#8D33FF", "#FF33A8", "#33FFF2", "#FFC300"];

  function createParticipantButtons() {
      participantButtons.innerHTML = "";
      participants.forEach((participant, index) => {
          let participantDiv = document.createElement("div");
          participantDiv.classList.add("participant-entry");
          
          let button = document.createElement("button");
          button.textContent = `${participant.name} - ${parseFloat(participant.currentCalories.toFixed(1))}/${participant.targetCalories} kcal`;
          button.classList.add("participant-btn");

          button.style.backgroundColor = participantColors[index % participantColors.length];
          
          let progressCircle = document.createElement("div");
          progressCircle.classList.add("progress-circle");
          progressCircle.style.background = `conic-gradient(purple ${(participant.currentCalories / participant.targetCalories) * 360}deg, #ccc 0deg)`;

          button.addEventListener("click", function () {
              selectedParticipant = participants[index];
              document.querySelectorAll(".participant-btn").forEach(btn => {
                btn.classList.remove("selected");
                btn.style.border = "none"; // Прибираємо рамку у всіх
            });

              button.classList.add("selected");
              button.style.border = "5px solid white";

              console.log("Now selected:", selectedParticipant);
          });

          participantDiv.appendChild(progressCircle);
          participantDiv.appendChild(button);
          participantButtons.appendChild(participantDiv);
      });
  }

  function createExerciseButtons() {
      exerciseButtons.innerHTML = "";
      let exercises = exerciseDatabase.filter(exercise => selectedExercises.includes(exercise.name));
      exercises.forEach(exercise => {
          let button = document.createElement("button");
          button.textContent = exercise.name;
          button.classList.add("exercise-btn");
          
          button.addEventListener("click", function () {
              selectedExercise = exercise.name;
              document.querySelectorAll(".exercise-btn").forEach(btn => btn.classList.remove("selected"));
              button.classList.add("selected");
          });
          
          exerciseButtons.appendChild(button);
      });
  }

  logExerciseButton.addEventListener("click", function () {
      const reps = parseInt(repsInput.value);
      if (!selectedParticipant) {
          alert("Please select a participant before logging an exercise.");
          return;
      }
      if (!selectedExercise) {
          alert("Please select an exercise before logging repetitions.");
          return;
      }
      if (isNaN(reps) || reps <= 0) {
          alert("Please enter a valid number of repetitions.");
          return;
      }
      
      console.log("Logging exercise for:", selectedParticipant);
      
      const exerciseData = exerciseDatabase.find(ex => ex.name === selectedExercise);
      if (!exerciseData) {
          console.error("Exercise not found in database.");
          return;
      }

      const caloriesPerRep = exerciseData.calories[selectedParticipant.gender] || 0;
      const totalCaloriesBurned = reps * caloriesPerRep;

      selectedParticipant.currentCalories = parseFloat((selectedParticipant.currentCalories + totalCaloriesBurned).toFixed(1));




      // ❗ Додаємо запис у статистику гравця
    if (!selectedParticipant.exerciseStats) {
      selectedParticipant.exerciseStats = {};
    }
    if (!selectedParticipant.exerciseStats[selectedExercise]) {
        selectedParticipant.exerciseStats[selectedExercise] = {
            totalReps: 0,
            timesSelected: 0,
            caloriesBurned: 0
        };
  }
  
  selectedParticipant.exerciseStats[selectedExercise].totalReps += reps;
  selectedParticipant.exerciseStats[selectedExercise].timesSelected += 1;
  selectedParticipant.exerciseStats[selectedExercise].caloriesBurned += totalCaloriesBurned;
      
      let logEntry = `${selectedParticipant.name} performed ${reps} reps of ${selectedExercise} - ${parseFloat((totalCaloriesBurned).toFixed(1))} kcal`;

      workoutProgress.push(logEntry);
      
      let listItem = document.createElement("li");
      listItem.textContent = logEntry;
      progressList.appendChild(listItem);
      
      repsInput.value = "";
      updateParticipantProgress();

      document.querySelectorAll(".participant-btn").forEach(btn => {
        btn.classList.remove("selected");
        btn.style.border = "none";
      });
      selectedParticipant = null;

      // ❗ Очищаємо вибрану вправу
      document.querySelectorAll(".exercise-btn").forEach(btn => {
          btn.classList.remove("selected");
      });
      selectedExercise = null;
  });

  function updateParticipantProgress() {
    let completedCount = 0; // Лічильник завершених гравців

    document.querySelectorAll(".participant-entry").forEach((entry, index) => {
        let participant = participants[index];
        let button = entry.querySelector(".participant-btn");
        let progressCircle = entry.querySelector(".progress-circle");

        // Оновлення тексту та прогрес-бара
        button.textContent = `${participant.name} - ${parseFloat(participant.currentCalories.toFixed(1))}/${participant.targetCalories} kcal`;
        progressCircle.style.background = `conic-gradient(purple ${(participant.currentCalories / participant.targetCalories) * 360}deg, #ccc 0deg)`;

        // ❗ Якщо гравець досяг цільової кількості калорій
        if (participant.currentCalories >= participant.targetCalories) {
            completedCount++; // Додаємо до лічильника завершених гравців

            if (completedCount === 1) {
                button.style.backgroundColor = "gold"; // 1-й завершив - золото 🥇
            } else if (completedCount === 2) {
                button.style.backgroundColor = "silver"; // 2-й завершив - срібло 🥈
            } else if (completedCount === 3) {
                button.style.backgroundColor = "#cd7f32"; // 3-й завершив - бронза 🥉
            } else {
                button.style.backgroundColor = "green"; // Інші - просто зелений ✅
            }
            button.style.border = "3px solid white"; // Робимо рамку, щоб виділити
        }
    });

    // ❗ Якщо всі гравці завершили - пропонуємо закінчити гру
    if (completedCount === participants.length) {
        alert("All participants have completed their target! You can finish the workout.");
    }
}

  endWorkoutButton.addEventListener("click", function () {
      localStorage.setItem("workoutProgress", JSON.stringify(workoutProgress));
      localStorage.setItem("participants", JSON.stringify(participants));
      window.location.href = "results.html";
  });

  backButton.addEventListener("click", function () {
      window.location.href = "exercise_selection.html";
  });

  updateGlobalTimer();
  createParticipantButtons();
  createExerciseButtons();
});
