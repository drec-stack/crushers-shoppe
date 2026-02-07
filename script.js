// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in header
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(span => {
        span.textContent = cartCount;
    });
}

// Add product to cart
function addToCart(productId, productName, productPrice, productImage) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${productName} добавлен в корзину`, 'success');
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCart(); // Reload cart display if on cart page
    showToast('Товар удален из корзины', 'info');
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity < 1) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            loadCart(); // Reload cart display if on cart page
        }
    }
}

// Toggle wishlist
function toggleWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.indexOf(productId);
    
    const button = event.currentTarget;
    const icon = button.querySelector('i');
    
    if (index === -1) {
        wishlist.push(productId);
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.classList.add('active');
        showToast('Добавлено в избранное', 'success');
    } else {
        wishlist.splice(index, 1);
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.classList.remove('active');
        showToast('Удалено из избранного', 'info');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Show toast notification
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Load cart for cart.html page
function loadCart() {
    const cartContainer = document.getElementById('cartContent');
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <h2>Ваша корзина пуста</h2>
                <p>Добавьте товары из каталога, чтобы продолжить покупки</p>
                <a href="catalog.html" class="btn-primary">Перейти в каталог</a>
            </div>
        `;
        return;
    }
    
    let total = 0;
    let cartHTML = `
        <div class="cart-content">
            <div class="cart-items">
    `;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">${item.price.toLocaleString()} ₽</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                           onchange="updateQuantity(${item.id}, parseInt(this.value))">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-total">
                    <strong>${itemTotal.toLocaleString()} ₽</strong>
                    <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartHTML += `
            </div>
            <div class="cart-summary">
                <h2>Итог заказа</h2>
                <div class="summary-row">
                    <span>Товары (${cart.reduce((total, item) => total + item.quantity, 0)})</span>
                    <span>${total.toLocaleString()} ₽</span>
                </div>
                <div class="summary-row">
                    <span>Доставка</span>
                    <span>0 ₽</span>
                </div>
                <div class="summary-row total">
                    <span>Итого</span>
                    <span>${total.toLocaleString()} ₽</span>
                </div>
                <a href="checkout.html" class="checkout-btn">
                    <i class="fas fa-lock"></i> Перейти к оформлению
                </a>
                <p style="text-align: center; margin-top: 1rem;">
                    <a href="catalog.html" style="color: var(--primary-color);">← Продолжить покупки</a>
                </p>
            </div>
        </div>
    `;
    
    cartContainer.innerHTML = cartHTML;
}

// Initialize mobile menu
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initMobileMenu();
    
    // Check wishlist status for products
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = parseInt(btn.getAttribute('onclick').match(/\d+/)[0]);
        if (wishlist.includes(productId)) {
            const icon = btn.querySelector('i');
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.classList.add('active');
        }
    });
});

// Product data for catalog
const products = [
    { id: 1, name: "Nike Air Max 270", price: 12990, category: "running", brand: "nike", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "Adidas Ultraboost 21", price: 14990, category: "running", brand: "adidas", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "Puma RS-X", price: 9990, category: "lifestyle", brand: "puma", image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { id: 4, name: "New Balance 574", price: 11990, category: "lifestyle", brand: "new balance", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { id: 5, name: "Reebok Nano X1", price: 13990, category: "training", brand: "reebok", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { id: 6, name: "Nike Air Jordan 1", price: 18990, category: "basketball", brand: "nike", image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { id: 7, name: "Adidas NMD R1", price: 12990, category: "lifestyle", brand: "adidas", image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { id: 8, name: "Converse Chuck Taylor", price: 5990, category: "lifestyle", brand: "converse", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { id: 9, name: "Vans Old Skool", price: 7990, category: "skateboarding", brand: "vans", image: "https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { id: 10, name: "Asics Gel-Kayano 28", price: 15990, category: "running", brand: "asics", image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { id: 11, name: "Nike Dunk Low", price: 14990, category: "lifestyle", brand: "nike", image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { id: 12, name: "Adidas Yeezy Boost 350", price: 29990, category: "lifestyle", brand: "adidas", image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" }
];
