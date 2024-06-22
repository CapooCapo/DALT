document.addEventListener("DOMContentLoaded", () => {
    const verificationForm = document.getElementById('verification-form');
    const resendVerificationForm = document.getElementById('resend-verification-form');
    const userEmail = localStorage.getItem('email');
    const username = localStorage.getItem('username');
    
    if (userEmail && username) {
        document.getElementById('user-email').textContent = userEmail;
        document.getElementById('username').textContent = username;
    }

    if (verificationForm) {
        verificationForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const verificationCode = document.getElementById('verification-code').value;
            
            try {
                const response = await fetch('https://4jjl5xvc-5000.asse.devtunnels.ms/verify_code', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, verification_code: verificationCode })
                });

                const result = await response.json();
                if (result.status === 'success') {
                    alert('Verification successful');
                    window.location.href = '/Backend/test.html';
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Verification failed:', error);
            }
        });
    }

    if (resendVerificationForm) {
        resendVerificationForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const resendUsername = document.getElementById('resend-username-input').value;
            
            try {
                const response = await fetch('https://4jjl5xvc-5000.asse.devtunnels.ms/resend_verification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: resendUsername })
                });

                const result = await response.json();
                if (result.status === 'success') {
                    document.getElementById('user-email').textContent = userEmail;
                    document.getElementById('username').textContent = resendUsername;
                    alert('Verification code resent to email');
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Failed to resend verification code:', error);
            }
        });
    }
});

function logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("is_active");
    window.location.href = '.../test.html';
}
