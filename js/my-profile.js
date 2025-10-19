const STORAGE_KEY = "userProfile";

document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.getElementById("imageInput");
  if (imageInput) imageInput.addEventListener("change", handleImageInput);

  loadProfile();
});

let imageData = null;

function handleImageInput(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Por favor, selecciona un archivo de imagen válido.');
    return;
  }

  if (file.size > 3 * 1024 * 1024) {
    alert('Selecciona una imagen menor a 3MB.');
    e.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    imageData = event.target.result; // solo vista previa
    const img = document.getElementById("profileImage");
    img.src = imageData;
    img.style.maxWidth = "180px";
    img.style.borderRadius = "50%";
  };
  reader.readAsDataURL(file);
}

function saveProfile(event) {
  if (event) event.preventDefault();

  const profile = {
    firstName: document.getElementById("Nombre").value.trim(),
    lastName: document.getElementById("Apellido").value.trim(),
    email: document.getElementById("mail").value.trim(),
    phone: document.getElementById("Telefono").value.trim()
    // No guardamos la imagen
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  updateHeaderName(profile);
  document.getElementById("saveFeedback").textContent = "Cambios guardados correctamente ✅";
}

function loadProfile() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    // Primera vez que entra → precargamos el nombre con el userName del login
    const savedUser = localStorage.getItem("userName");
    if (savedUser) {
      document.getElementById("Nombre").value = savedUser; // 👈 antes era mail
    }
    return;
  }

  try {
    const profile = JSON.parse(raw);
    document.getElementById("Nombre").value = profile.firstName || localStorage.getItem("userName") || "";
    document.getElementById("Apellido").value = profile.lastName || "";
    document.getElementById("mail").value = profile.email || "";
    document.getElementById("Telefono").value = profile.phone || "";

    updateHeaderName(profile);
  } catch (err) {
    console.error("Error al leer el localStorage:", err);
  }
}

function updateHeaderName(profile) {
  const span = document.getElementById("user-name");
  if (!span) return;
  const name = ((profile.firstName || "") + " " + (profile.lastName || "")).trim();
  span.textContent = name || profile.email || "Usuario";
}
