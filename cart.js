// cart.js

class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('crushersCart')) || [];
        this.promoCode = null;
        this.deliveryCost = 300;
        this.promoDiscount = 0;
        this.init();
    }
    
    init() {
        this.loadCartItems();
        this.setupEventListeners();
        this.calculateSummary();
        this.loadRecommendedProducts();
        this.updateCartCount();
    }
    
    updateCartCount() {
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count, #mobile-cart-count');
        cartCountElements.forEach(el => {
            el.textContent = totalItems;
        });
    }
    
    loadCartItems() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const emptyCart = document.querySelector('.empty-cart');
        
        if (!cartItemsContainer) return;
        
        if (this.cart.length === 0) {
            cartItemsContainer.style.display = 'none';
            if (emptyCart) emptyCart.style.display = 'block';
            return;
        }
        
        if (emptyCart) emptyCart.style.display = 'none';
        cartItemsContainer.style.display = 'flex';
        cartItemsContainer.innerHTML = '';
        
        this.cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image" style="background: linear-gradient(45deg, ${item.colors?.[0] || '#667eea'}, ${item.colors?.[1] || item.colors?.[0] || '#764ba2'})"></div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-category">${this.getCategoryName(item.category)} • Размер: ${item.size || 'M'}</div>
                    <div class="cart-item-price">${this.formatPrice(item.price * item.quantity)} руб.</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" data-index="${index}">
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                    <button class="remove-item-btn" data-index="${index}" aria-label="Удалить товар">
                        <i class="fas fa-trash"></i> Удалить
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }
    
    setupEventListeners() {
        // Обработчики для кнопок корзины
        document.addEventListener('click', (e) => {
            // Удаление товара
            if (e.target.closest('.remove-item-btn')) {
                const index = parseInt(e.target.closest('.remove-item-btn').dataset.index);
                this.removeItem(index);
            }
            
            // Увеличение количества
            if (e.target.closest('.quantity-btn.plus')) {
                const index = parseInt(e.target.closest('.quantity-btn').dataset.index);
                this.updateQuantity(index, 1);
            }
            
            // Уменьшение количества
            if (e.target.closest('.quantity-btn.minus')) {
                const index = parseInt(e.target.closest('.quantity-btn').dataset.index);
                this.updateQuantity(index, -1);
            }
            
            // Очистка корзины
            if (e.target.closest('#clear-cart')) {
                if (confirm('Вы уверены, что хотите очистить корзину?')) {
                    this.clearCart();
                }
            }
            
            // Оформление заказа
            if (e.target.closest('#checkout-btn')) {
                this.checkout();
            }
            
            // Применение промокода
            if (e.target.closest('#apply-promo')) {
                this.applyPromoCode();
            }
        });
        
        // Обработка изменения количества через input
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const index = parseInt(e.target.dataset.index);
                const newQuantity = parseInt(e.target.value);
                
                if (newQuantity >= 1 && newQuantity <= 10) {
                    this.setQuantity(index, newQuantity);
                } else {
                    // Возвращаем предыдущее значение
                    e.target.value = this.cart[index].quantity;
                }
            }
        });
        
        // Обработка Enter в поле промокода
        const promoInput = document.getElementById('promo-input');
        if (promoInput) {
            promoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyPromoCode();
                }
            });
        }
        
        // Изменение типа доставки
        const deliverySelect = document.getElementById('delivery-select');
        if (deliverySelect) {
            deliverySelect.addEventListener('change', () => {
                this.calculateSummary();
            });
        }
    }
    
    updateQuantity(index, change) {
        if (this.cart[index]) {
            const newQuantity = this.cart[index].quantity + change;
            
            if (newQuantity < 1) {
                this.removeItem(index);
            } else if (newQuantity <= 10) {
                this.cart[index].quantity = newQuantity;
                this.saveCart();
                this.loadCartItems();
                this.calculateSummary();
            }
        }
    }
    
    setQuantity(index, quantity) {
        if (this.cart[index] && quantity >= 1 && quantity <= 10) {
            this.cart[index].quantity = quantity;
            this.saveCart();
            this.loadCartItems();
            this.calculateSummary();
        }
    }
    
    removeItem(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.loadCartItems();
        this.calculateSummary();
        this.updateCartCount();
    }
    
    clearCart() {
        this.cart = [];
        this.promoCode = null;
        this.promoDiscount = 0;
        this.saveCart();
        this.loadCartItems();
        this.calculateSummary();
        this.updateCartCount();
        
        // Сбрасываем промокод
        const promoInput = document.getElementById('promo-input');
        const promoMessage = document.getElementById('promo-message');
        
        if (promoInput) promoInput.value = '';
        if (promoMessage) {
            promoMessage.textContent = '';
            promoMessage.className = 'promo-message';
        }
    }
    
    calculateSummary() {
        const itemsPrice = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const deliveryCost = this.getDeliveryCost();
        const discount = this.promoDiscount;
        const totalPrice = itemsPrice + deliveryCost - discount;
        
        // Обновляем значения в интерфейсе
        const summaryItems = document.getElementById('summary-items');
        const summaryItemsPrice = document.getElementById('summary-items-price');
        const summaryDelivery = document.getElementById('summary-delivery');
        const summaryDiscount = document.getElementById('summary-discount');
        const summaryTotalPrice = document.getElementById('summary-total-price');
        
        if (summaryItems) {
            const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
            summaryItems.textContent = `${totalItems} товар${this.getPluralEnding(totalItems)}`;
        }
        
        if (summaryItemsPrice) summaryItemsPrice.textContent = `${this.formatPrice(itemsPrice)} руб.`;
        if (summaryDelivery) summaryDelivery.textContent = `${this.formatPrice(deliveryCost)} руб.`;
        if (summaryDiscount) summaryDiscount.textContent = discount > 0 ? `-${this.formatPrice(discount)} руб.` : '0 руб.';
        if (summaryTotalPrice) summaryTotalPrice.textContent = `${this.formatPrice(totalPrice)} руб.`;
    }
    
    getDeliveryCost() {
        const deliverySelect = document.getElementById('delivery-select');
        if (!deliverySelect) return this.deliveryCost;
        
        switch(deliverySelect.value) {
            case 'standard':
                return 300;
            case 'express':
                return 600;
            case 'pickup':
                return 0;
            default:
                return 300;
        }
    }
    
    applyPromoCode() {
        const promoInput = document.getElementById('promo-input');
        const promoMessage = document.getElementById('promo-message');
        
        if (!promoInput || !promoMessage) return;
        
        const code = promoInput.value.trim().toUpperCase();
        const validPromoCodes = {
            'WELCOME10': 10,
            'CRUSHERS15': 15,
            'FREESHIP': 'free-shipping'
        };
        
        if (code in validPromoCodes) {
            const discount = validPromoCodes[code];
            
            if (discount === 'free-shipping') {
                const deliverySelect = document.getElementById('delivery-select');
                if (deliverySelect) {
                    deliverySelect.value = 'standard';
                    this.deliveryCost = 0;
                }
                
                promoMessage.textContent = 'Промокод применен! Бесплатная доставка активирована.';
                promoMessage.className = 'promo-message success';
                this.promoCode = code;
                this.promoDiscount = 0;
            } else {
                const itemsPrice = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
                this.promoDiscount = Math.round(itemsPrice * (discount / 100));
                
                promoMessage.textContent = `Промокод применен! Скидка ${discount}% (${this.formatPrice(this.promoDiscount)} руб.)`;
                promoMessage.className = 'promo-message success';
                this.promoCode = code;
            }
            
            this.calculateSummary();
        } else {
            promoMessage.textContent = 'Неверный промокод';
            promoMessage.className = 'promo-message error';
            this.promoCode = null;
            this.promoDiscount = 0;
            this.calculateSummary();
        }
    }
    
    checkout() {
        if (this.cart.length === 0) {
            alert('Добавьте товары в корзину для оформления заказа');
            return;
        }
        
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        const itemsPrice = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const deliveryCost = this.getDeliveryCost();
        const totalPrice = itemsPrice + deliveryCost - this.promoDiscount;
        
        alert(`Оформление заказа\n\nТоваров: ${totalItems}\nСумма: ${this.formatPrice(totalPrice)} руб.\n\nВ реальном приложении здесь была бы форма оформления заказа.`);
        
        // Можно очистить корзину после оформления
        // this.clearCart();
    }
    
    loadRecommendedProducts() {
        const recommendedContainer = document.querySelector('.recommended-products');
        if (!recommendedContainer) return;
        
        // Берем 4 случайных товара
        const shuffled = [...window.products].sort(() => 0.5 - Math.random());
        const recommended = shuffled.slice(0, 4);
        
        recommendedContainer.innerHTML = recommended.map(product => `
            <div class="product-card">
                <div class="product-image" style="background: linear-gradient(45deg, ${product.colors[0]}, ${product.colors[1] || product.colors[0]})">
                    ${product.badge ? `<div class="product-badge">${product.badge === 'new' ? 'Новинка' : product.badge === 'sale' ? 'Распродажа' : 'Хит'}</div>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category === 'men' ? 'Мужская одежда' : product.category === 'women' ? 'Женская одежда' : 'Унисекс'}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="price-current">${this.formatPrice(product.price)} руб.</span>
                        ${product.oldPrice ? `<span class="price-old">${this.formatPrice(product.oldPrice)} руб.</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="action-btn buy" onclick="window.openQuickBuy(${product.id})">Купить</button>
                        <button class="action-btn cart" onclick="window.addToCart(${product.id}); this.showAddedNotification('${product.name}')">В корзину</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    showAddedNotification(productName) {
        if (window.showNotification) {
            window.showNotification(`Товар "${productName}" добавлен в корзину!`);
        }
    }
    
    // Вспомогательные методы
    getCategoryName(category) {
        switch(category) {
            case 'men': return 'Мужская одежда';
            case 'women': return 'Женская одежда';
            case 'unisex': return 'Унисекс';
            default: return 'Одежда';
        }
    }
    
    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    
    getPluralEnding(number) {
        const lastDigit = number % 10;
        const lastTwoDigits = number % 100;
        
        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'ов';
        if (lastDigit === 1) return '';
        if (lastDigit >= 2 && lastDigit <= 4) return 'а';
        return 'ов';
    }
    
    saveCart() {
        localStorage.setItem('crushersCart', JSON.stringify(this.cart));
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});

// Экспортируем функции в глобальную область видимости
window.addToCart = (productId, quantity = 1) => {
    if (window.cartManager) {
        // Находим товар
        const product = window.products.find(p => p.id === productId);
        if (!product) return;
        
        // Добавляем в корзину
        const existingItem = window.cartManager.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            window.cartManager.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category,
                colors: product.colors,
                size: 'M',
                quantity: quantity
            });
        }
        
        window.cartManager.saveCart();
        window.cartManager.loadCartItems();
        window.cartManager.calculateSummary();
        window.cartManager.updateCartCount();
        
        // Показываем уведомление
        if (window.showNotification) {
            window.showNotification(`Товар "${product.name}" добавлен в корзину!`);
        }
    }
};

window.openQuickBuy = (productId) => {
    if (window.openQuickBuy) {
        // Эта функция уже объявлена в script.js
        return;
    }
    
    // Резервная реализация
    const product = window.products.find(p => p.id === productId);
    if (product) {
        alert(`Быстрая покупка: ${product.name}\nЦена: ${product.price} руб.\n\nВ реальном приложении здесь была бы форма быстрой покупки.`);
    }
};