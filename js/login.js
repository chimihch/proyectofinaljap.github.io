document.addEventListener('DOMContentLoaded', function () {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');

    if (loginBtn) {
        loginBtn.addEventListener('click', async function (event) {
            event.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (username === '' || password === '') {
                alert('Por favor, ingresa tu usuario y contraseña.');
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/users/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    alert("Usuario o contraseña incorrectos.");
                    return;
                }

                // Guardar token REAL del backend
                localStorage.setItem("token", data.token);

                // Guardar nombre del usuario para mostrar en el navbar
                localStorage.setItem("userName", username);

                alert("¡Login exitoso!");
                window.location.href = "index.html";
            
            } catch (error) {
                console.error(error);
                alert("Error al conectar con el servidor.");
            }
        });
    }
});

