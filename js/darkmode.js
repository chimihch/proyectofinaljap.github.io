document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("darkModeToggle");
  const isDarkMode = localStorage.getItem("darkMode") === "true";

  // Aplica el modo oscuro si estaba activado
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    toggleBtn.textContent = "☀️ Modo claro";
  }

  // Evento para cambiar modo
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const darkEnabled = document.body.classList.contains("dark-mode");

    localStorage.setItem("darkMode", darkEnabled);
    toggleBtn.textContent = darkEnabled ? "☀️ Modo claro" : "🌙 Modo oscuro";
  });
});
