document.addEventListener("DOMContentLoaded", function () {
  const equipmentContainer = document.getElementById("equipmentContainer");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const exerciseContainer = document.getElementById("exerciseContainer");
  const selectedExercisesList = document.getElementById("selectedExercises");
  const nextButton = document.getElementById("nextButton");
  const backButton = document.getElementById("backButton");

  const allEquipment = [
    "TRX", "Dumbbells", "Kettlebell", "Barbell", "Box",
    "Jump Rope", "Battle Rope", "Resistance Bands", "Medicine Ball", "Pull-up Bar"
  ];
  let selectedEquipment = JSON.parse(localStorage.getItem("selectedEquipment")) || [...allEquipment];
  let selectedExercises = [];

  let exerciseDatabase = JSON.parse(localStorage.getItem("exerciseDatabase"));

  if (!exerciseDatabase || Object.keys(exerciseDatabase).length === 0) {
    console.warn("Exercise database not found in localStorage! Reloading...");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } else {
    console.log("Loaded exercise database:", exerciseDatabase);
  }

  // Відображення всього можливого спорядження
  equipmentContainer.innerHTML = "";
  allEquipment.forEach(equipment => {
    let button = document.createElement("button");
    button.textContent = equipment;
    button.classList.add("equipment-btn");

    if (!selectedEquipment.includes(equipment)) {
      button.classList.add("disabled", "inactive-equipment");
    }

    button.addEventListener("click", function () {
      if (selectedEquipment.includes(equipment)) {
        selectedEquipment = selectedEquipment.filter(item => item !== equipment);
        button.classList.add("disabled", "inactive-equipment");
      } else {
        selectedEquipment.push(equipment);
        button.classList.remove("disabled", "inactive-equipment");
      }
      localStorage.setItem("selectedEquipment", JSON.stringify(selectedEquipment));
      updateExercises();
    });

    equipmentContainer.appendChild(button);
  });

  // Додаємо лічильник вибраних вправ у HTML
  let selectedCount = document.createElement("p");
  selectedCount.id = "selectedCount";
  selectedCount.textContent = "Selected: 0";
  document.body.appendChild(selectedCount);

  categoryButtons.forEach(button => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      console.log("Selected category:", category);
      showExercisesByCategory(category);
    });
  });

  function showExercisesByCategory(category) {
    exerciseContainer.innerHTML = "";

    // Перевіряємо, чи існує така категорія
    let categoryExercises = exerciseDatabase[category] || [];

    // Фільтруємо вправи, які відповідають вибраному спорядженню
    categoryExercises = categoryExercises.filter(exercise =>
      exercise.equipment.length === 0 || exercise.equipment.some(eq => selectedEquipment.includes(eq))
    );

    console.log("Available exercises for", category, ":", categoryExercises);

    if (categoryExercises.length === 0) {
      let message = document.createElement("p");
      message.textContent = "No exercises available for this category.";
      exerciseContainer.appendChild(message);
      return;
    }

    categoryExercises.forEach(exercise => {
      let button = document.createElement("button");
      button.textContent = exercise.name;
      button.classList.add("exercise-btn");

      button.addEventListener("click", function () {
        if (selectedExercises.includes(exercise.name)) {
          selectedExercises = selectedExercises.filter(item => item !== exercise.name);
          button.classList.remove("selected");
        } else {
          selectedExercises.push(exercise.name);
          button.classList.add("selected");
        }
        updateSelectedCount();
        console.log("Selected exercises:", selectedExercises);
      });

      exerciseContainer.appendChild(button);
    });
  }

  function updateExercises() {
    const activeCategory = document.querySelector(".category-btn.active");
    if (activeCategory) {
      showExercisesByCategory(activeCategory.getAttribute("data-category"));
    }
  }

  function updateSelectedCount() {
    selectedCount.textContent = `Обрано: ${selectedExercises.length}`;
  }

  nextButton.addEventListener("click", function () {
    localStorage.setItem("selectedExercises", JSON.stringify(selectedExercises));
    window.location.href = "workout.html";
  });

  backButton.addEventListener("click", function () {
    window.location.href = "participants.html";
  });
});
