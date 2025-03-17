document.addEventListener("DOMContentLoaded", function () {
  showLoading();

  const participantButtons = document.getElementById("participantList");
  const exerciseButtons = document.getElementById("exerciseButtons");
  const openRepsForm = document.getElementById("openRepsForm");
  const repsModal = document.getElementById("repsModal");
  const repsForm = document.getElementById("repsForm");
  const progressList = document.getElementById("progressList");
  const weightSelectorContainer = document.getElementById("weightSelectorContainer");
  const weightSelector = document.getElementById("weightSelector");
  const decreaseWeightButton = document.getElementById("decreaseWeight");
  const increaseWeightButton = document.getElementById("increaseWeight");
  const endWorkoutButton = document.getElementById("endWorkout");
  const backButton = document.getElementById("backButton");
  const globalTimer = document.getElementById("globalTimer");
  const closeModalButtons = document.querySelectorAll(".close-modal");

  let selectedParticipant = null;
  let selectedExercise = null;
  let workoutProgress = [];
  let currentReps = 0;

  let participants = safeGetFromStorage("participants") || [];
  const selectedExercises = safeGetFromStorage("selectedExercises") || [];
  const exerciseDatabase = safeGetFromStorage("exerciseDatabase") || [];

  let timerInterval;
  let startTime;
  let pausedTime = 0;
  let isPaused = false;

  // Валідація даних учасників
  participants = participants.filter(participant => validateData(participant, 'participant'));

  function updateGlobalTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      if (!isPaused) {
        let elapsedTime = Math.floor((Date.now() - startTime + pausedTime) / 1000);
        let minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
        let seconds = String(elapsedTime % 60).padStart(2, '0');
        globalTimer.textContent = `${minutes}:${seconds}`;
      }
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
      let allExercises = [];

      // Додаємо всі вправи з кожної категорії
      Object.values(exerciseDatabase).forEach(category => {
          allExercises = allExercises.concat(category.filter(exercise => selectedExercises.includes(exercise.name)));
      });

      allExercises.forEach(exercise => {
          let button = document.createElement("button");
          button.textContent = exercise.name;
          button.classList.add("exercise-btn");

          button.addEventListener("click", function () {
              selectedExercise = exercise.name;
              selectedWeight = null;
              document.querySelectorAll(".exercise-btn").forEach(btn => btn.classList.remove("selected"));
              button.classList.add("selected");

              if (exercise.weights) {
                  weightSelectorContainer.style.display = "block";
                  weightSelector.innerHTML = "";

                  exercise.weights.forEach(weight => {
                      let option = document.createElement("option");
                      option.value = weight;
                      option.textContent = `${weight} kg`;
                      weightSelector.appendChild(option);
                  });

                  selectedWeight = parseFloat(weightSelector.value);
              } else {
                  weightSelectorContainer.style.display = "none";
              }
          });

          exerciseButtons.appendChild(button);
      });
  }

  // Змінюємо вагу при зміні у випадаючому списку
  weightSelector.addEventListener("change", function () {
    selectedWeight = parseFloat(weightSelector.value);
  });

  // Кнопка "-" (Зменшити вагу)
  decreaseWeightButton.addEventListener("click", function () {
    if (!selectedExercise) return;
    
    let exerciseData = null;
    // Шукаємо дані вправи в базі даних
    Object.values(exerciseDatabase).forEach(category => {
      let foundExercise = category.find(ex => ex.name === selectedExercise);
      if (foundExercise) {
        exerciseData = foundExercise;
      }
    });
    
    if (!exerciseData || !exerciseData.weights) return;
    
    let weights = exerciseData.weights;
    let currentIndex = weights.indexOf(selectedWeight);
    
    if (currentIndex > 0) {
      selectedWeight = weights[currentIndex - 1];
      weightSelector.value = selectedWeight;
    }
  });

  // Кнопка "+" (Збільшити вагу)
  increaseWeightButton.addEventListener("click", function () {
    if (!selectedExercise) return;
    
    let exerciseData = null;
    // Шукаємо дані вправи в базі даних
    Object.values(exerciseDatabase).forEach(category => {
      let foundExercise = category.find(ex => ex.name === selectedExercise);
      if (foundExercise) {
        exerciseData = foundExercise;
      }
    });
    
    if (!exerciseData || !exerciseData.weights) return;
    
    let weights = exerciseData.weights;
    let currentIndex = weights.indexOf(selectedWeight);
    
    if (currentIndex < weights.length - 1) {
      selectedWeight = weights[currentIndex + 1];
      weightSelector.value = selectedWeight;
    }
  });

  // Відкриття модального вікна
  openRepsForm.addEventListener("click", function () {
    if (!selectedParticipant) {
      alert("Please select a participant first.");
      return;
    }
    if (!selectedExercise) {
      alert("Please select an exercise first.");
      return;
    }
    repsModal.classList.add("active");
  });

  // Закриття модального вікна
  closeModalButtons.forEach(button => {
    button.addEventListener("click", function () {
      repsModal.classList.remove("active");
    });
  });

  // Закриття при кліку поза формою
  repsModal.addEventListener("click", function (e) {
    if (e.target === repsModal) {
      repsModal.classList.remove("active");
    }
  });

  // Обробка відправки форми
  repsForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const reps = parseInt(document.getElementById("repsInput").value);
    
    if (isNaN(reps) || reps <= 0 || reps > 1000) {
      showMessage("Please enter a valid number of repetitions (1-1000).", "error");
      return;
    }
    
    if (!selectedParticipant) {
      alert("Please select a participant first.");
      return;
    }
    if (!selectedExercise) {
      alert("Please select an exercise first.");
      return;
    }
    
    console.log("Logging exercise for:", selectedParticipant);
    
    let exerciseData = null;

    // Проходимо по всіх категоріях та шукаємо вправу
    Object.values(exerciseDatabase).forEach(category => {
      let foundExercise = category.find(ex => ex.name === selectedExercise);
      if (foundExercise) {
        exerciseData = foundExercise;
      }
    });

    if (!exerciseData) {
      console.error("Exercise not found in database.");
      return;
    }

    let caloriesPerRep = exerciseData.calories[selectedParticipant.gender] || 0;

    // Якщо у вправи є ваги - враховуємо множник калорій на 1 кг
    if (exerciseData.weights && selectedWeight !== null) {
      caloriesPerRep += selectedWeight * exerciseData.calories_per_kg;
    }

    const totalCaloriesBurned = reps * caloriesPerRep;

    selectedParticipant.currentCalories = parseFloat((selectedParticipant.currentCalories + totalCaloriesBurned).toFixed(1));

    // Додаємо запис у статистику гравця
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
    
    let logEntry = `${selectedParticipant.name} performed ${reps} reps of ${selectedExercise}` + 
      (selectedWeight ? ` (${selectedWeight} kg)` : "") + 
      ` - ${parseFloat((totalCaloriesBurned).toFixed(1))} kcal`;

    workoutProgress.push(logEntry);
    
    let listItem = document.createElement("li");
    listItem.textContent = logEntry;
    progressList.appendChild(listItem);
    
    // Закриваємо модальне вікно та очищаємо форму
    repsModal.classList.remove("active");
    repsForm.reset();
    
    // Оновлюємо прогрес
    updateParticipantProgress();

    // Очищаємо вибір учасника
    document.querySelectorAll(".participant-btn").forEach(btn => {
      btn.classList.remove("selected");
      btn.style.border = "none";
    });
    selectedParticipant = null;

    // Очищаємо вибір вправи
    document.querySelectorAll(".exercise-btn").forEach(btn => {
      btn.classList.remove("selected");
    });
    selectedExercise = null;

    hideLoading();
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

  // Обробка помилок при збереженні прогресу
  function saveProgress() {
    if (!safeSaveToStorage("workoutProgress", workoutProgress)) {
      alert("Error saving workout progress. Please try again.");
      return false;
    }
    if (!safeSaveToStorage("participants", participants)) {
      alert("Error saving participants data. Please try again.");
      return false;
    }
    return true;
  }

  // Оновлений обробник завершення тренування
  endWorkoutButton.addEventListener("click", function() {
    if (confirm("Are you sure you want to finish the workout?")) {
      showLoading();
      if (saveProgress()) {
        showMessage("Workout completed successfully!", "success");
        setTimeout(() => {
          window.location.href = "results.html";
        }, 1000);
      } else {
        showMessage("Error saving workout data. Please try again.", "error");
        hideLoading();
      }
    }
  });

  backButton.addEventListener("click", function () {
      window.location.href = "exercise_selection.html";
  });

  // Додаємо кнопку паузи
  const pauseButton = document.createElement("button");
  pauseButton.id = "pauseTimer";
  pauseButton.textContent = "⏸️";
  pauseButton.style.marginLeft = "10px";
  pauseButton.style.padding = "5px 10px";
  pauseButton.style.fontSize = "16px";
  globalTimer.parentNode.insertBefore(pauseButton, globalTimer.nextSibling);

  pauseButton.addEventListener("click", function() {
    if (isPaused) {
      isPaused = false;
      startTime = Date.now();
      pauseButton.textContent = "⏸️";
    } else {
      isPaused = true;
      pausedTime += Date.now() - startTime;
      pauseButton.textContent = "▶️";
    }
  });

  // Зберігаємо час при закритті сторінки
  window.addEventListener("beforeunload", function() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    localStorage.setItem("workoutTime", Date.now() - startTime + pausedTime);
  });

  // Відновлюємо час при завантаженні сторінки
  const savedTime = localStorage.getItem("workoutTime");
  if (savedTime) {
    pausedTime = parseInt(savedTime);
  }

  updateGlobalTimer();
  createParticipantButtons();
  createExerciseButtons();

  // Додаємо підказки для кнопок
  const tooltips = {
    'openRepsForm': 'Click to enter the number of repetitions',
    'endWorkout': 'Finish the current workout session',
    'backButton': 'Return to previous page',
    'pauseTimer': 'Pause/Resume the timer'
  };

  Object.entries(tooltips).forEach(([id, text]) => {
    const element = document.getElementById(id);
    if (element) {
      element.title = text;
      element.setAttribute('aria-label', text);
    }
  });

  // Додаємо підтвердження при виході зі сторінки
  window.addEventListener("beforeunload", function(e) {
    if (workoutProgress.length > 0) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  });

  hideLoading();
});

// Функція для валідації даних
function validateData(data, type) {
  switch(type) {
    case 'participant':
      if (!data.name || typeof data.name !== 'string') return false;
      if (typeof data.currentCalories !== 'number' || data.currentCalories < 0) return false;
      if (typeof data.targetCalories !== 'number' || data.targetCalories <= 0) return false;
      if (!['male', 'female'].includes(data.gender)) return false;
      return true;
    case 'exercise':
      if (!data.name || typeof data.name !== 'string') return false;
      if (typeof data.calories !== 'object') return false;
      if (typeof data.calories.male !== 'number' || data.calories.male < 0) return false;
      if (typeof data.calories.female !== 'number' || data.calories.female < 0) return false;
      return true;
    default:
      return false;
  }
}

// Функція для безпечного збереження в localStorage
function safeSaveToStorage(key, data) {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage: ${error.message}`);
    return false;
  }
}

// Функція для безпечного отримання з localStorage
function safeGetFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error.message}`);
    return null;
  }
}

// Функція для показу індикатора завантаження
function showLoading() {
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loadingIndicator";
  loadingDiv.innerHTML = `
    <div class="loading-spinner"></div>
    <div class="loading-text">Loading...</div>
  `;
  document.body.appendChild(loadingDiv);
}

// Функція для приховування індикатора завантаження
function hideLoading() {
  const loadingDiv = document.getElementById("loadingIndicator");
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

// Функція для показу повідомлення
function showMessage(message, type = 'info') {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message message-${type}`;
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}
