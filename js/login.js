document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');

    loginBtn.addEventListener('click', function(event) {
        // Evita el comportamiento por defecto de un formulario si existiera
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Validacion: comprueba que los campos no estén vacíos
        if (username !== '' && password !== '') {
            // Autenticación ficticia exitosa
            // Guarda el estado de la sesión en localStorage
            localStorage.setItem('isLoggedIn', 'true');
            
            // Redirecciona al usuario a la página principal
            window.location.href = '/index.html';
        } else {
            // Muestra un mensaje de error si la validación falla
            alert('Por favor, ingresa tu usuario y contraseña.');
        }
    });
});