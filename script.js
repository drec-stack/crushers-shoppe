// script.js

// Данные товаров
window.products = [
    { id: 1, name: "Футболка Crusher Basic", category: "men", price: 2499, oldPrice: 2999, badge: "new", colors: ["#667eea", "#764ba2"], sizes: ["S", "M", "L", "XL"] },
    { id: 2, name: "Джинсы Slim Fit Black", category: "men", price: 5499, oldPrice: null, badge: "bestseller", colors: ["#1a202c", "#2d3748"], sizes: ["30", "32", "34", "36"] },
    { id: 3, name: "Кожаная куртка Vintage", category: "men", price: 12999, oldPrice: 14999, badge: "sale", colors: ["#2d3748", "#4a5568"], sizes: ["M", "L", "XL"] },
    { id: 4, name: "Платье коктейльное Lace", category: "women", price: 7999, oldPrice: null, badge: "new", colors: ["#f093fb", "#f5576c"], sizes: ["XS", "S", "M", "L"] },
    { id: 5, name: "Юбка миди с поясом", category: "women", price: 4499, oldPrice: 4999, badge: "sale", colors: ["#f6e05e", "#faf089"], sizes: ["S", "M", "L"] },
    { id: 6, name: "Блуза с жабо Silk", category: "women", price: 5999, oldPrice: null, badge: "bestseller", colors: ["#ffffff", "#f7fafc"], sizes: ["XS", "S", "M"] },
    { id: 7, name: "Худи Oversize Grey", category: "unisex", price: 4999, oldPrice: 5499, badge: "sale", colors: ["#a0aec0", "#cbd5e0"], sizes: ["S", "M", "L", "XL", "XXL"] },
    { id: 8, name: "Кроссовки Urban Black", category: "unisex", price: 8999, oldPrice: null, badge: "new", colors: ["#1a202c", "#2d3748"], sizes: ["38", "39", "40", "41", "42", "43"] },
    { id: 9, name: "Бомбер с вышивкой", category: "men", price: 7999, oldPrice: 8999, badge: "sale", colors: ["#4c51bf", "#667eea"], sizes: ["M", "L", "XL"] },
    { id: 10, name: "Кардиган крупной вязки", category: "women", price: 6499, oldPrice: null, badge: "bestseller", colors: ["#d69e2e", "#ed8936"], sizes: ["S", "M", "L"] },
    { id: 11, name: "Рубашка Oxford Button", category: "men", price: 3999, oldPrice: null, badge: null, colors: ["#ffffff", "#f7fafc"], sizes: ["S", "M", "L", "XL"] },
    { id: 12, name: "Брюки Wide Leg", category: "women", price: 5299, oldPrice: 5799, badge: "sale", colors: ["#a0aec0", "#cbd5e0"], sizes: ["XS", "S", "M", "L"] },
    { id: 13, name: "Свитшот с принтом", category: "unisex", price: 4299, oldPrice: null, badge: "new", colors: ["#4fd1c7", "#38b2ac"], sizes: ["S", "M", "L", "XL"] },
    { id: 14, name: "Пальто шерстяное Camel", category: "women", price: 14999, oldPrice: 16999, badge: "sale", colors: ["#d69e2e", "#b7791f"], sizes: ["S", "M", "L"] },
    { id: 15, name: "Шорты джинсовые", category: "men", price: 3499, oldPrice: null, badge: null, colors: ["#4c51bf", "#667eea"], sizes: ["30", "32", "34", "36"] },
    { id: 16, name: "Топ с открытыми плечами", category: "women", price: 2999, oldPrice: 3499, badge: "sale", colors: ["#f093fb", "#ed64a6"], sizes: ["XS", "S", "M"] },
    { id: 17, name: "Косуха кожаная", category: "unisex", price: 11999, oldPrice: null, badge: "bestseller", colors: ["#2d3748", "#4a5568"], sizes: ["S", "M", "L", "XL"] },
    { id: 18, name: "Сарафан летний", category: "women", price: 4699, oldPrice: null, badge: "new", colors: ["#f687b3", "#ed64a6"], sizes: ["XS", "S", "M", "L"] },
    { id: 19, name: "Пиджак приталенный", category: "men", price: 8999, oldPrice: 9999, badge: "sale", colors: ["#2d3748", "#4a5568"], sizes: ["48", "50", "52", "54"] },
    { id: 20, name: "Лонгслив с горлом", category: "unisex", price: 3299, oldPrice: null, badge: null, colors: ["#a0aec0", "#cbd5e0"], sizes: ["S", "M", "L", "XL"] },
    { id: 21, name: "Плащ тренч", category: "women", price: 10999, oldPrice: 12999, badge: "sale", colors: ["#a0aec0", "#cbd5e0"], sizes: ["XS", "S", "M", "L"] },
    { id: 22, name: "Джинсы Boyfriend", category: "women", price: 5799, oldPrice: null, badge: "bestseller", colors: ["#4c51bf", "#667eea"], sizes: ["25", "27", "29", "31"] },
    { id: 23, name: "Поло с логотипом", category: "men", price: 3799, oldPrice: 4299, badge: "sale", colors: ["#48bb78", "#38a169"], sizes: ["S", "M", "L", "XL"] },
    { id: 24, name: "Комбинезон джинсовый", category: "women", price: 7999, oldPrice: null, badge: "new", colors: ["#4c51bf", "#667eea"], sizes: ["XS", "S", "M", "L"] },
    { id: 25, name: "Ветровка спортивная", category: "unisex", price: 6499, oldPrice: 6999, badge: "sale", colors: ["#4fd1c7", "#38b2ac"], sizes: ["S", "M", "L", "XL", "XXL"] }
];

// Корзина
window.cart = JSON.parse(localStorage.getItem('crushersCart')) || [];

// Загрузка хедера и футера
async function loadHeaderAndFooter() {
    try {
        const headerResponse = await fetch('header.html');
        const headerHTML = await headerResponse.text();
        document.getElementById('header-container').innerHTML = headerHTML;
        
        const footerResponse = await fetch('footer.html');
        const footerHTML = await footerResponse.text();
        document.getElementById('footer-container').innerHTML = footerHTML;
        
        initHeaderFunctionality();
        updateCartCount();
        initProfileModal();
        
    } catch (error) {
        console.error('Ошибка загрузки хедера или футера:', error);
    }
}

// Инициализация функциональности хедера
function initHeaderFunctionality() {
    // Мобильное меню
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenu.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
            mobileMenuBtn.setAttribute('aria-label', isExpanded ? 'Закрыть меню' : 'Открыть меню');
        });
    }
    
    // Поиск
    const searchBtn = document.getElementById('search-btn');
    const searchPanel = document.getElementById('search-panel');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    const searchSubmit = document.getElementById('search-submit');
    
    if (searchBtn && searchPanel) {
        searchBtn.addEventListener('click', () => {
            searchPanel.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (searchInput) searchInput.focus();
        });
    }
    
    if (searchClose && searchPanel) {
        searchClose.addEventListener('click', () => {
            closeSearchPanel();
        });
    }
    
    if (searchSubmit) {
        searchSubmit.addEventListener('click', () => {
            performSearch();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        searchInput.addEventListener('input', debounce(() => {
            if (searchInput.value.length >= 2) {
                performSearch();
            } else {
                clearSearchResults();
            }
        }, 300));
    }
    
    // Закрытие поиска при клике вне области
    if (searchPanel) {
        searchPanel.addEventListener('click', (e) => {
            if (e.target === searchPanel) {
                closeSearchPanel();
            }
        });
    }
    
    // Быстрое меню покупки
    const quickBuyClose = document.getElementById('quick-buy-close');
    const quickBuyPanel = document.getElementById('quick-buy-panel');
    
    if (quickBuyClose && quickBuyPanel) {
        quickBuyClose.addEventListener('click', () => {
            quickBuyPanel.classList.remove('active');
        });
        
        quickBuyPanel.addEventListener('click', (e) => {
            if (e.target === quickBuyPanel) {
                quickBuyPanel.classList.remove('active');
            }
        });
    }
}

function closeSearchPanel() {
    const searchPanel = document.getElementById('search-panel');
    if (searchPanel) {
        searchPanel.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function performSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults) return;
    
    const query = searchInput.value.trim().toLowerCase();
    
    if (query.length < 2) {
        clearSearchResults();
        return;
    }
    
    const filteredProducts = window.products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.includes(query) ||
        product.badge?.toLowerCase().includes(query)
    );
    
    if (filteredProducts.length > 0) {
        searchResults.innerHTML = filteredProducts.map(product => `
            <div class="search-result-item" data-id="${product.id}" role="button" tabindex="0" 
                 onclick="openQuickBuy(${product.id})" onkeypress="if(event.key === 'Enter') openQuickBuy(${product.id})">
                <div class="search-result-image" style="background: linear-gradient(45deg, ${product.colors[0]}, ${product.colors[1] || product.colors[0]})"></div>
                <div class="search-result-info">
                    <h4>${product.name}</h4>
                    <p>${product.category === 'men' ? 'Мужская одежда' : product.category === 'women' ? 'Женская одежда' : 'Унисекс'}</p>
                </div>
                <div class="search-result-price">${formatPrice(product.price)} руб.</div>
            </div>
        `).join('');
    } else {
        searchResults.innerHTML = `
            <div class="search-result-item">
                <div class="search-result-info">
                    <h4>Товары не найдены</h4>
                    <p>Попробуйте изменить запрос</p>
                </div>
            </div>
        `;
    }
}

function clearSearchResults() {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.innerHTML = `
            <div class="search-result-item">
                <div class="search-result-image"></div>
                <div class="search-result-info">
                    <h4>Футболка Crusher Basic</h4>
                    <p>Мужская одежда</p>
                </div>
                <div class="search-result-price">2 499 руб.</div>
            </div>
        `;
    }
}

// Дебаунс
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Обновление счетчика корзины
function updateCartCount() {
    const totalItems = window.cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count, #mobile-cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// Быстрая покупка
function openQuickBuy(productId) {
    const product = window.products.find(p => p.id === productId);
    if (!product) return;
    
    const quickBuyPanel = document.getElementById('quick-buy-panel');
    const quickBuyImage = document.getElementById('quick-buy-image');
    const quickBuyTitle = document.getElementById('quick-buy-title');
    const quickBuyPrice = document.getElementById('quick-buy-price');
    const sizeOptions = document.getElementById('size-options');
    const quickQuantity = document.getElementById('quick-quantity');
    
    if (!quickBuyPanel || !quickBuyImage || !quickBuyTitle || !quickBuyPrice || !sizeOptions) return;
    
    // Заполняем данные
    quickBuyImage.style.background = `linear-gradient(45deg, ${product.colors[0]}, ${product.colors[1] || product.colors[0]})`;
    quickBuyTitle.textContent = product.name;
    quickBuyPrice.textContent = `${formatPrice(product.price)} руб.`;
    quickQuantity.value = 1;
    
    // Генерируем опции размеров
    sizeOptions.innerHTML = product.sizes.map(size => `
        <button class="size-btn" data-size="${size}">${size}</button>
    `).join('');
    
    // Выбираем первый размер по умолчанию
    const firstSizeBtn = sizeOptions.querySelector('.size-btn');
    if (firstSizeBtn) {
        firstSizeBtn.classList.add('active');
    }
    
    // Обработчики для кнопок размеров
    sizeOptions.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            sizeOptions.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Обработчики для кнопок количества
    const quickMinus = document.getElementById('quick-minus');
    const quickPlus = document.getElementById('quick-plus');
    
    if (quickMinus) {
        quickMinus.addEventListener('click', () => {
            if (quickQuantity.value > 1) {
                quickQuantity.value = parseInt(quickQuantity.value) - 1;
            }
        });
    }
    
    if (quickPlus) {
        quickPlus.addEventListener('click', () => {
            if (quickQuantity.value < 10) {
                quickQuantity.value = parseInt(quickQuantity.value) + 1;
            }
        });
    }
    
    // Обработчики для кнопок действий
    const quickBuyBtn = document.getElementById('quick-buy-btn');
    const quickCartBtn = document.getElementById('quick-cart-btn');
    
    if (quickBuyBtn) {
        quickBuyBtn.onclick = () => {
            addToCart(productId, parseInt(quickQuantity.value));
            closeSearchPanel();
            quickBuyPanel.classList.remove('active');
            showNotification('Товар добавлен в корзину!');
        };
    }
    
    if (quickCartBtn) {
        quickCartBtn.onclick = () => {
            addToCart(productId, parseInt(quickQuantity.value));
            closeSearchPanel();
            quickBuyPanel.classList.remove('active');
            showNotification('Товар добавлен в корзину!');
        };
    }
    
    // Показываем панель
    quickBuyPanel.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Добавление в корзину
function addToCart(productId, quantity = 1) {
    const product = window.products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = window.cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        window.cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            colors: product.colors,
            size: 'M', // По умолчанию
            quantity: quantity
        });
    }
    
    localStorage.setItem('crushersCart', JSON.stringify(window.cart));
    updateCartCount();
}

// Форматирование цены
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Показать уведомление
function showNotification(message, type = 'success') {
    const notification = document.getElementById('global-notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationClose = document.getElementById('notification-close');
    const notificationIcon = notification?.querySelector('.notification-icon i');
    
    if (!notification || !notificationMessage) return;
    
    // Устанавливаем сообщение
    notificationMessage.textContent = message;
    
    // Устанавливаем иконку в зависимости от типа
    if (notificationIcon) {
        if (type === 'success') {
            notificationIcon.className = 'fas fa-check-circle';
            notification.style.borderLeftColor = '#48bb78';
        } else if (type === 'error') {
            notificationIcon.className = 'fas fa-exclamation-circle';
            notification.style.borderLeftColor = '#f56565';
        } else if (type === 'info') {
            notificationIcon.className = 'fas fa-info-circle';
            notification.style.borderLeftColor = '#4299e1';
        }
    }
    
    // Показываем уведомление
    notification.style.display = 'block';
    
    // Обработчик закрытия
    if (notificationClose) {
        const closeHandler = () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.style.display = 'none';
                notification.style.animation = '';
            }, 300);
            notificationClose.removeEventListener('click', closeHandler);
        };
        
        notificationClose.addEventListener('click', closeHandler);
    }
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        if (notification.style.display === 'block') {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.style.display = 'none';
                notification.style.animation = '';
            }, 300);
        }
    }, 5000);
}

// Модальное окно профиля
function initProfileModal() {
    const profileBtn = document.getElementById('profile-btn');
    const mobileProfileBtn = document.getElementById('mobile-profile-btn');
    const profileModal = document.getElementById('profile-modal');
    const profileModalClose = document.getElementById('profile-modal-close');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    
    function openProfileModal() {
        if (profileModal) {
            profileModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeProfileModal() {
        if (profileModal) {
            profileModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    
    if (profileBtn) {
        profileBtn.addEventListener('click', openProfileModal);
    }
    
    if (mobileProfileBtn) {
        mobileProfileBtn.addEventListener('click', openProfileModal);
    }
    
    if (profileModalClose) {
        profileModalClose.addEventListener('click', closeProfileModal);
    }
    
    if (profileModal) {
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                closeProfileModal();
            }
        });
    }
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            showNotification('Функция входа в разработке', 'info');
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            showNotification('Функция регистрации в разработке', 'info');
        });
    }
}

// Генерация бестселлеров на главной
function generateBestsellers() {
    const bestsellersGrid = document.getElementById('bestsellers-grid');
    if (!bestsellersGrid) return;
    
    // Берем первые 4 товара как бестселлеры
    const bestsellers = window.products.slice(0, 4);
    
    bestsellersGrid.innerHTML = bestsellers.map(product => `
        <div class="product-card">
            <div class="product-image" style="background: linear-gradient(45deg, ${product.colors[0]}, ${product.colors[1] || product.colors[0]})">
                ${product.badge ? `<div class="product-badge">${product.badge === 'new' ? 'Новинка' : product.badge === 'sale' ? 'Распродажа' : 'Хит'}</div>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category === 'men' ? 'Мужская одежда' : product.category === 'women' ? 'Женская одежда' : 'Унисекс'}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="price-current">${formatPrice(product.price)} руб.</span>
                    ${product.oldPrice ? `<span class="price-old">${formatPrice(product.oldPrice)} руб.</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="action-btn buy" onclick="openQuickBuy(${product.id})" aria-label="Купить ${product.name}">
                        <i class="fas fa-bolt"></i> Купить
                    </button>
                    <button class="action-btn cart" onclick="addToCart(${product.id}); showNotification('Товар добавлен в корзину!')" aria-label="Добавить ${product.name} в корзину">
                        <i class="fas fa-shopping-cart"></i> В корзину
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Инициализация виртуальной примерочной на главной
function initVirtualTryon() {
    const tryVirtualBtn = document.getElementById('try-virtual-tryon');
    if (tryVirtualBtn) {
        tryVirtualBtn.addEventListener('click', () => {
            showNotification('Виртуальная примерочная в разработке. Скоро будет доступна!', 'info');
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadHeaderAndFooter();
    
    // Инициализация для главной страницы
    if (document.getElementById('bestsellers-grid')) {
        generateBestsellers();
        initVirtualTryon();
    }
    
    // Инициализация новостной рассылки
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('.newsletter-input');
            if (emailInput.value) {
                showNotification('Спасибо за подписку! Проверьте вашу почту для подтверждения.', 'success');
                emailInput.value = '';
            }
        });
    }
});