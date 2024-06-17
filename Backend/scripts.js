document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const userButton = document.getElementById('userButton');
    const userDropdown = document.getElementById('userDropdown');
    const logoutButton = document.getElementById('logoutButton');
    const productsContainer = document.getElementById('products');

    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Fetch products from backend
    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:5000/products');
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Display products
    function displayProducts(products) {
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product';

            const imgSrc = product.Image ? `data:image/jpeg;base64,${product.Image}` : 'default_product_image.jpg';

            productCard.innerHTML = `
                <img src="${imgSrc}" alt="${product.Product_Name}">
                <p>${product.Product_Name}</p>
                <p>${product.Price}</p>
                <p>${product.Description}</p>
                <button>Buy</button>
            `;
            productsContainer.appendChild(productCard);
        });
    }

    // Update UI based on login state
    function updateUserUI() {
        const user = localStorage.getItem('user');
        if (user) {
            loginButton.style.display = 'none';
            registerButton.style.display = 'none';
            userButton.style.display = 'block';
        } else {
            loginButton.style.display = 'block';
            registerButton.style.display = 'block';
            userButton.style.display = 'none';
            userDropdown.style.display = 'none';
        }
    }

    // Event listeners
    loginButton.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    registerButton.addEventListener('click', () => {
        registerModal.style.display = 'block';
    });

    closeLoginModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    closeRegisterModal.addEventListener('click', () => {
        registerModal.style.display = 'none';
    });

    userButton.addEventListener('click', () => {
        userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('user');
        updateUserUI();
    });

    // Login form submission
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (data.status === 'success') {
                localStorage.setItem('user', username);
                updateUserUI();
                loginModal.style.display = 'none';
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    });

    // Register form submission
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const phoneNumber = document.getElementById('registerPhone').value;
        const email = document.getElementById('registerEmail').value;

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, phoneNumber, email }),
            });

            const data = await response.json();
            if (data.status === 'success') {
                alert('Registration successful. You can now log in.');
                registerModal.style.display = 'none';
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error registering:', error);
        }
    });

    // Initial setup
    updateUserUI();
    fetchProducts();
});
