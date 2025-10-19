const STORAGE_KEY = "userProfile";
let imageData = null;

document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.getElementById("imageInput");
  imageInput.addEventListener("change", handleImageInput);

  loadProfile();
});

function handleImageInput(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('seleccione un archivo de imagen válido');
    return;
  }

   if (file.size > 3 * 1024 * 1024) {
    alert('seleccione una imagen menor a 3MB');
    e.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    imageData = event.target.result; // base64
    const img = document.getElementById("profileImage");
    img.src = imageData;
  };
  reader.readAsDataURL(file);
}

function saveProfile(event) {
  if (event) event.preventDefault();

  const profile = {
    firstName: document.getElementById("Nombre").value.trim(),
    lastName: document.getElementById("Apellido").value.trim(),
    email: document.getElementById("mail").value.trim(),
    phone: document.getElementById("Telefono").value.trim(),
    image: imageData || (JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}).image || ""
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  updateHeaderName(profile);
  document.getElementById("saveFeedback").textContent = "Cambios guardados correctamente";
}

function loadProfile() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const profile = JSON.parse(raw);
    document.getElementById("Nombre").value = profile.firstName || "";
    document.getElementById("Apellido").value = profile.lastName || "";
    document.getElementById("mail").value = profile.email || "";
    document.getElementById("Telefono").value = profile.phone || "";

    if (profile.image) {
      imageData = profile.image;
      const img = document.getElementById("profileImage");
      img.src = profile.image;
      img.style.maxWidth = "180px";
      img.style.borderRadius = "50%";
    }

    updateHeaderName(profile);
  } catch (err) {
    console.error("error del locl storage:", err);
  }
}

function updateHeaderName(profile) {
  const span = document.getElementById("user-name");
  if (!span) return;
  const name = ((profile.firstName || "") + " " + (profile.lastName || "")).trim();
  span.textContent = name || profile.email || "Usuario";
}