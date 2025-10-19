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

/* DESAFIATE */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("profileForm");
  const nombreInput = document.getElementById("Nombre");
  const apellidoInput = document.getElementById("Apellido");
  const mailInput = document.getElementById("mail");
  const telefonoInput = document.getElementById("Telefono");
  const imageInput = document.getElementById("imageInput");
  const profileImage = document.getElementById("profileImage");
  const saveFeedback = document.getElementById("saveFeedback");

  const PROFILE_KEY = "userProfileData";

  // --- Cargar datos guardados ---
  const savedProfile = JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};

  if (savedProfile.Nombre) nombreInput.value = savedProfile.Nombre;
  if (savedProfile.Apellido) apellidoInput.value = savedProfile.Apellido;
  if (savedProfile.Email) mailInput.value = savedProfile.Email;
  if (savedProfile.Telefono) telefonoInput.value = savedProfile.Telefono;
  if (savedProfile.Foto) profileImage.src = savedProfile.Foto;

  // Si no hay email guardado, intentar precargar desde otros datos del usuario
  if (!mailInput.value) {
    const possibleEmails = [
      "loggedInUserEmail",
      "currentUserEmail",
      "userEmail",
      "email",
    ];
    for (let key of possibleEmails) {
      const stored = localStorage.getItem(key);
      if (stored && stored.includes("@")) {
        mailInput.value = stored;
        break;
      }
    }
  }

  // --- Guardar imagen seleccionada ---
  imageInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const dataURL = event.target.result;
      profileImage.src = dataURL;

      // Guardar imagen en localStorage
      const currentData = JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
      currentData.Foto = dataURL;
      localStorage.setItem(PROFILE_KEY, JSON.stringify(currentData));
    };
    reader.readAsDataURL(file);
  });

  // --- Guardar formulario ---
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const profileData = {
      Nombre: nombreInput.value.trim(),
      Apellido: apellidoInput.value.trim(),
      Email: mailInput.value.trim(),
      Telefono: telefonoInput.value.trim(),
      Foto: profileImage.src || "",
    };

    localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));

    saveFeedback.textContent = "✅ Cambios guardados correctamente";
    setTimeout(() => (saveFeedback.textContent = ""), 2000);
  });
});
