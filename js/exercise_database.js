// Локальна база даних вправ
const exerciseDatabase = [
  { "name": "Push-ups", "category": "upper_body", "calories": { "male": 0.3, "female": 0.25 }, "equipment": [] },
  { "name": "Dumbbell Shoulder Press", "category": "upper_body", "base_calories": { "male": 0.4, "female": 0.35 }, "equipment": ["Dumbbells"], "weights": [4, 8, 16, 32], "calories_per_kg": 0.05 },
  { "name": "TRX Rows", "category": "upper_body", "calories": { "male": 0.5, "female": 0.4 }, "equipment": ["TRX"] },
  { "name": "Pull-ups", "category": "upper_body", "calories": { "male": 0.6, "female": 0.5 }, "equipment": [] },
  { "name": "Barbell Bench Press", "category": "upper_body", "base_calories": { "male": 0.8, "female": 0.7 }, "equipment": ["Barbell"], "weights": [20, 40, 60, 80], "calories_per_kg": 0.04 },
  { "name": "Squats", "category": "lower_body", "calories": { "male": 0.6, "female": 0.5 }, "equipment": [] },
  { "name": "Deadlifts", "category": "lower_body", "base_calories": { "male": 0.9, "female": 0.8 }, "equipment": ["Barbell"], "weights": [20, 40, 60, 80], "calories_per_kg": 0.05 },
  { "name": "Box Jumps", "category": "lower_body", "calories": { "male": 0.7, "female": 0.6 }, "equipment": ["Box"] },
  { "name": "Burpees", "category": "full_body", "calories": { "male": 1.0, "female": 0.9 }, "equipment": [] },
  { "name": "Jump Rope", "category": "full_body", "calories": { "male": 0.8, "female": 0.7 }, "equipment": ["Jump Rope"] },
  { "name": "Battle Ropes", "category": "full_body", "calories": { "male": 0.9, "female": 0.8 }, "equipment": ["Battle Rope"] },
  { "name": "Kettlebell Swings", "category": "full_body", "base_calories": { "male": 0.7, "female": 0.6 }, "equipment": ["Kettlebell"], "weights": [4, 8, 16, 32], "calories_per_kg": 0.06 }
];

// Якщо в localStorage ще немає бази вправ — записуємо її
if (!localStorage.getItem("exerciseDatabase")) {
    localStorage.setItem("exerciseDatabase", JSON.stringify(exerciseDatabase));
    console.log("Exercise database saved to localStorage.");
} else {
    console.log("Exercise database already exists in localStorage.");
}

// Лог для перевірки
console.log("Loaded exercise database:", JSON.parse(localStorage.getItem("exerciseDatabase")));
