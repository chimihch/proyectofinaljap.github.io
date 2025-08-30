document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');

    if (loginBtn) { // Solo se ejecuta en login.html
        loginBtn.addEventListener('click', function(event) {
            event.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (username !== '' && password !== '') {
                // Guardar usuario en sessionStorage (solo mientras dure la pestaña)
                sessionStorage.setItem('userName', username);

                // Redirigir a la página principal
                window.location.href = 'index.html'; 
            } else {
                alert('Por favor, ingresa tu usuario y contraseña.');
            }
        });
    }
});
