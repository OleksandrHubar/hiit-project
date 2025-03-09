// Локальна база даних вправ
const exerciseDatabase = {
  "upper_body": [
    { "name": "Push-ups", "calories": { "male": 0.33, "female": 0.26 }, "equipment": [] },
    { "name": "TRX Rows", "calories": { "male": 0.38, "female": 0.31 }, "equipment": ["TRX"] },
    { "name": "Dumbbell Shoulder Press", "calories": { "male": 0.32, "female": 0.26 }, "equipment": ["Dumbbells"], "weights": [4, 8, 16, 32], "calories_per_kg": 0.05 },
    { "name": "Pull-ups", "calories": { "male": 0.63, "female": 0.53 }, "equipment": [] },
    { "name": "Arnold Press", "calories": { "male": 0.34, "female": 0.28 }, "equipment": ["Dumbbells"], "weights": [4, 8, 16], "calories_per_kg": 0.04 },
    { "name": "Barbell Bench Press", "calories": { "male": 0.58, "female": 0.47 }, "equipment": ["Barbell"], "weights": [20, 40, 60, 80], "calories_per_kg": 0.04 },
    { "name": "Triceps Dips", "calories": { "male": 0.60, "female": 0.50 }, "equipment": [] },
    { "name": "Resistance Band Biceps Curl", "calories": { "male": 0.22, "female": 0.17 }, "equipment": ["Resistance Bands"] }
  ],
  "lower_body": [
    { "name": "Squats", "calories": { "male": 0.35, "female": 0.30 }, "equipment": [] },
    { "name": "Deadlifts", "calories": { "male": 0.65, "female": 0.55 }, "equipment": ["Barbell"], "weights": [20, 40, 60, 80], "calories_per_kg": 0.05 },
    { "name": "Lunges", "calories": { "male": 0.34, "female": 0.28 }, "equipment": [] },
    { "name": "Step-ups", "calories": { "male": 0.38, "female": 0.31 }, "equipment": ["Step Box"] },
    { "name": "Box Jumps", "calories": { "male": 0.75, "female": 0.60 }, "equipment": ["Box"] },
    { "name": "Jump Squats", "calories": { "male": 0.60, "female": 0.50 }, "equipment": [] },
    { "name": "TRX Pistol Squat", "calories": { "male": 0.60, "female": 0.50 }, "equipment": ["TRX"] },
    { "name": "Calf Raises", "calories": { "male": 0.18, "female": 0.15 }, "equipment": [] },
    { "name": "Glute Bridges", "calories": { "male": 0.30, "female": 0.25 }, "equipment": [] },
    { "name": "Resistance Band Side Steps", "calories": { "male": 0.24, "female": 0.20 }, "equipment": ["Resistance Bands"] }
  ],
  "full_body": [
    { "name": "Burpees", "calories": { "male": 0.82, "female": 0.73 }, "equipment": [] },
    { "name": "Kettlebell Swings", "calories": { "male": 0.60, "female": 0.50 }, "equipment": ["Kettlebell"], "weights": [4, 8, 16, 32], "calories_per_kg": 0.06 },
    { "name": "Mountain Climbers", "calories": { "male": 0.15, "female": 0.12 }, "equipment": [] },
    { "name": "Kettlebell Snatch", "calories": { "male": 0.70, "female": 0.59 }, "equipment": ["Kettlebell"], "weights": [4, 8, 16], "calories_per_kg": 0.06 },
    { "name": "Barbell Thrusters", "calories": { "male": 0.72, "female": 0.59 }, "equipment": ["Barbell"], "weights": [20, 40, 60], "calories_per_kg": 0.05 },
    { "name": "TRX Atomic Push-ups", "calories": { "male": 0.48, "female": 0.39 }, "equipment": ["TRX"] },
    { "name": "Dumbbell Man Makers", "calories": { "male": 0.93, "female": 0.75 }, "equipment": ["Dumbbells"], "weights": [4, 8, 16, 32], "calories_per_kg": 0.05 },
    { "name": "Step-through Lunges", "calories": { "male": 0.40, "female": 0.33 }, "equipment": [] },
    { "name": "Resistance Band Sprints", "calories": { "male": 0.70, "female": 0.59 }, "equipment": ["Resistance Bands"] },
    { "name": "Kettlebell Goblet Squat", "calories": { "male": 0.57, "female": 0.48 }, "equipment": ["Kettlebell"], "weights": [4, 8, 16], "calories_per_kg": 0.05 },
    { "name": "Box Burpees", "calories": { "male": 0.95, "female": 0.78 }, "equipment": ["Box"] }
  ]
};


// Якщо в localStorage ще немає бази вправ — записуємо її
if (!localStorage.getItem("exerciseDatabase")) {
    localStorage.setItem("exerciseDatabase", JSON.stringify(exerciseDatabase));
    console.log("Exercise database saved to localStorage.");
} else {
    console.log("Exercise database already exists in localStorage.");
}

// Лог для перевірки
console.log("Loaded exercise database:", JSON.parse(localStorage.getItem("exerciseDatabase")));
