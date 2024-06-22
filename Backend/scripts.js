document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.getElementById('product-grid');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const pageNumberDisplay = document.getElementById('page-number');
    let currentPage = 1;
    const perPage = 8;

    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const accountDropdown = document.getElementById('account-dropdown');
    const accountName = document.getElementById('account-name');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');

    const checkLoginStatus = () => {
        const username = localStorage.getItem('username');
        if (username) {
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
            accountDropdown.style.display = 'block';
            accountName.textContent = `Chào, ${username}`;
        } else {
            loginLink.style.display = 'block';
            registerLink.style.display = 'block';
            accountDropdown.style.display = 'none';
        }
    };

    const showLoginModal = () => {
        loginModal.style.display = 'block';
    };

    const closeLoginModal = () => {
        loginModal.style.display = 'none';
    };

    const showRegisterModal = () => {
        registerModal.style.display = 'block';
    };

    const closeRegisterModal = () => {
        registerModal.style.display = 'none';
    };

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

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
                localStorage.setItem('username', username);
                closeLoginModal();
                checkLoginStatus();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    });

    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const email = document.getElementById('register-email').value;
        const phone = document.getElementById('register-phone').value;

        try {
            const response = await fetch('https://4jjl5xvc-5000.asse.devtunnels.ms/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email, phone })
            });

            const result = await response.json();
            if (result.status === 'success') {
                localStorage.setItem('username', username);
                closeRegisterModal();
                checkLoginStatus();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Registration failed:', error);
        }
    });

    const logout = () => {
        localStorage.removeItem('username');
        checkLoginStatus();
    };

    document.querySelector('#account-dropdown .dropdown-content a').addEventListener('click', (event) => {
        event.preventDefault();
        logout();
    });

    const loadProducts = async () => {
        try {
            const response = await fetch(`https://4jjl5xvc-5000.asse.devtunnels.ms/products?page=${currentPage}&per_page=${perPage}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            const products = result.products;
            const totalCount = result.total_count;

            productGrid.innerHTML = ''; // Clear existing products
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="data:image/png;base64,${product.Image}" alt="${product.Product_Name}">
                    <h3>${product.Product_Name}</h3>
                    <p>${product.Price}</p>
                    <p>${product.Description}</p>
                    <button class="momo-button">Thanh toán bằng momo</button>
                `;
                productGrid.appendChild(productCard);

                // Add click event listener to MoMo payment button
                productCard.querySelector('.momo-button').addEventListener('click', async () => {
                    try {
                        const response = await fetch('/payment-momo', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ amount: product.Price }) // Adjust based on your product data
                        });

                        const data = await response.json();
                        console.log("Response data:", data);
                        if (data.zp_trans_token) {
                            window.location.href = data.order_url;
                        } else if (data.payUrl) {
                            window.location.href = data.payUrl;
                        } else {
                            alert('Payment initiation failed');
                        }
                    } catch (error) {
                        console.error('Error initiating payment:', error);
                        alert('Payment initiation failed');
                    }
                });
            });

            // Update pagination buttons and page number
            const totalPages = Math.ceil(totalCount / perPage);
            pageNumberDisplay.textContent = `Page ${currentPage} of ${totalPages}`;

            prevPageButton.disabled = currentPage === 1;
            nextPageButton.disabled = currentPage === totalPages;
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    };

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadProducts();
        }
    });

    nextPageButton.addEventListener('click', () => {
        currentPage++;
        loadProducts();
    });

    loadProducts();
    checkLoginStatus();
});
async function handlePayment(url) {
    const totalPriceText = document.getElementById('total-price').innerText;
    const amount = parseInt(totalPriceText.replace(/\D/g, ''));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Đảm bảo header Content-Type là application/json
            },
            body: JSON.stringify({ amount })
        });

        const data = await response.json();
        console.log("Response data:", data);
        if (data.payUrl) {
            window.location.href = data.payUrl; // Chuyển hướng đến URL thanh toán từ MoMo
        } else {
            alert('Payment initiation failed');
        }
    } catch (error) {
        console.error('Failed to initiate payment:', error);
        alert('Payment initiation failed');
    }
}
