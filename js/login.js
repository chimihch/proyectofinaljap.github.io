document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');

    if (loginBtn) { // Solo se ejecuta en login.html
        loginBtn.addEventListener('click', function(event) {
            event.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (username === '' || password === '') {
                alert('Por favor, ingresa tu usuario y contraseña.');
                return;
            }

            // Guardamos la sesión ficticia
            localStorage.setItem('sesionIniciada', 'true');
            localStorage.setItem('userName', username);

            alert('Autenticación exitosa. Redireccionando...');
            window.location.href = 'index.html'; // portada
        });
    }
});
