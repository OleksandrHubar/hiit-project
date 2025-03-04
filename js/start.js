document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("startButton");
  
  startButton.addEventListener("click", function () {
      localStorage.setItem("gameStarted", "true"); // Зберігаємо, що гра була запущена
      window.location.href = "pages/participants.html";
  });
});
