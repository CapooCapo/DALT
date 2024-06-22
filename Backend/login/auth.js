document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const email = document.getElementById('username').value; // Assuming username and email are the same

        try {
            const response = await fetch('https://4jjl5xvc-5000.asse.devtunnels.ms/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (result.status === 'success') {
                localStorage.setItem('username', result.user);
                localStorage.setItem('email', result.email);
                window.location.href = '../test.html'; // Redirect to homepage
            } else {
                alert(result.message);
                localStorage.setItem('username', result.user);
                localStorage.setItem('email', result.email);
                window.location.href = '../register/verify/verify.html';
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    });
});
