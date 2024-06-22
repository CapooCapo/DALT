document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById('register-form');
    const verificationForm = document.getElementById('verification-form');
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const email = document.getElementById('register-email').value;
        const phoneNumber = document.getElementById('register-phone').value;

        try {
            const response = await fetch('https://4jjl5xvc-5000.asse.devtunnels.ms/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email, phoneNumber })
            });

            const result = await response.json();
            if (result.status === 'success') {
                localStorage.setItem('username', username);
                localStorage.setItem('email', email);
                window.location.href = './verify/verify.html';
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Registration failed:', error);
        }

    });

});
function logout() {
    localStorage.removeItem("username");
    updateAccountDisplay();
}