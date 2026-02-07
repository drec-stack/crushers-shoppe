// catalog.js

document.addEventListener('DOMContentLoaded', function() {
    // Загружаем товары в каталог
    loadCatalogProducts();
    
    // Инициализируем фильтры
    initCatalogFilters();
    
    // Инициализируем сортировку
    initSorting();
    
    // Инициализируем переключение вида
    initViewToggle();
    
    // Инициализируем пагинацию
    initPagination();
    
    // Проверяем URL параметры
    checkUrlParams();
});

function loadCatalogProducts() {
    const catalogGrid = document.getElementById('catalog-products-grid');
    if (!catalogGrid) return;
    
    // Используем те же товары, что и на главной странице
    const products = window.products || getCatalogProducts();
    
    catalogGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card catalog-product';
        productCard.dataset.id = product.id;
        productCard.dataset.category = product.category;
        productCard.dataset.price = product.price;
        productCard.dataset.collection = product.badge || 'regular';
        
        let badgeHtml = '';
        if (product.badge) {
            let badgeText = '';
            switch(product.badge) {
                case 'new': badgeText = 'Новинка'; break;
                case 'sale': badgeText = 'Распродажа'; break;
                case 'bestseller': badgeText = 'Хит продаж'; break;
            }
            badgeHtml = `<div class="product-badge">${badgeText}</div>`;
        }
        
        let oldPriceHtml = '';
        if (product.oldPrice) {
            oldPriceHtml = `<span class="price-old">${product.oldPrice} руб.</span>`;
        }
        
        const imageClass = getImageClass(product.id);
        
        productCard.innerHTML = `
            <div class="product-image ${imageClass}">
                ${badgeHtml}
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="price-current">${product.price} руб.</span>
                    ${oldPriceHtml}
                </div>
                <div class="product-actions">
                    <button class="action-btn buy" data-id="${product.id}" aria-label="Купить ${product.name}">Купить</button>
                    <button class="action-btn cart" data-id="${product.id}" aria-label="Добавить ${product.name} в корзину">В корзину</button>
                </div>
            </div>
        `;
        
        catalogGrid.appendChild(productCard);
    });
    
    // Добавляем обработчики для кнопок
    catalogGrid.addEventListener('click', function(e) {
        if (e.target.closest('.action-btn.cart')) {
            const productId = parseInt(e.target.closest('.action-btn').dataset.id);
            addToCartFromCatalog(productId, false);
        }
        
        if (e.target.closest('.action-btn.buy')) {
            const productId = parseInt(e.target.closest('.action-btn').dataset.id);
            addToCartFromCatalog(productId, true);
        }
    });
}

function getImageClass(productId) {
    // Создаем классы для разных цветов изображений
    const colorClasses = [
        'product-image-blue',
        'product-image-dark',
        'product-image-brown',
        'product-image-pink',
        'product-image-yellow',
        'product-image-purple',
        'product-image-gray',
        'product-image-navy',
        'product-image-orange',
        'product-image-maroon',
        'product-image-white',
        'product-image-tan',
        'product-image-lightblue',
        'product-image-lightgray',
        'product-image-skyblue',
        'product-image-lightpink',
        'product-image-darkblue',
        'product-image-lilac',
        'product-image-darkgray',
        'product-image-lightorange',
        'product-image-steelblue',
        'product-image-darkbrown',
        'product-image-lightgreen',
        'product-image-lightgray2',
        'product-image-orange2'
    ];
    
    return colorClasses[(productId - 1) % colorClasses.length] || 'product-image-default';
}

function getCatalogProducts() {
    return [
        { id: 1, name: "Футболка Crusher Basic", category: "men", price: 2499, oldPrice: 2999, badge: "new" },
        { id: 2, name: "Джинсы Slim Fit Black", category: "men", price: 5499, oldPrice: null, badge: "bestseller" },
        { id: 3, name: "Кожаная куртка Vintage", category: "men", price: 12999, oldPrice: 14999, badge: "sale" },
        { id: 4, name: "Платье коктейльное Lace", category: "women", price: 7999, oldPrice: null, badge: "new" },
        { id: 5, name: "Юбка миди с поясом", category: "women", price: 4499, oldPrice: 4999, badge: "sale" },
        { id: 6, name: "Блуза с жабо Silk", category: "women", price: 5999, oldPrice: null, badge: "bestseller" },
        { id: 7, name: "Худи Oversize Grey", category: "unisex", price: 4999, oldPrice: 5499, badge: "sale" },
        { id: 8, name: "Кроссовки Urban Black", category: "unisex", price: 8999, oldPrice: null, badge: "new" },
        { id: 9, name: "Бомбер с вышивкой", category: "men", price: 7999, oldPrice: 8999, badge: "sale" },
        { id: 10, name: "Кардиган крупной вязки", category: "women", price: 6499, oldPrice: null, badge: "bestseller" },
        { id: 11, name: "Рубашка Oxford Button", category: "men", price: 3999, oldPrice: null, badge: null },
        { id: 12, name: "Брюки Wide Leg", category: "women", price: 5299, oldPrice: 5799, badge: "sale" },
        { id: 13, name: "Свитшот с принтом", category: "unisex", price: 4299, oldPrice: null, badge: "new" },
        { id: 14, name: "Пальто шерстяное Camel", category: "women", price: 14999, oldPrice: 16999, badge: "sale" },
        { id: 15, name: "Шорты джинсовые", category: "men", price: 3499, oldPrice: null, badge: null },
        { id: 16, name: "Топ с открытыми плечами", category: "women", price: 2999, oldPrice: 3499, badge: "sale" },
        { id: 17, name: "Косуха кожаная", category: "unisex", price: 11999, oldPrice: null, badge: "bestseller" },
        { id: 18, name: "Сарафан летний", category: "women", price: 4699, oldPrice: null, badge: "new" },
        { id: 19, name: "Пиджак приталенный", category: "men", price: 8999, oldPrice: 9999, badge: "sale" },
        { id: 20, name: "Лонгслив с горлом", category: "unisex", price: 3299, oldPrice: null, badge: null },
        { id: 21, name: "Плащ тренч", category: "women", price: 10999, oldPrice: 12999, badge: "sale" },
        { id: 22, name: "Джинсы Boyfriend", category: "women", price: 5799, oldPrice: null, badge: "bestseller" },
        { id: 23, name: "Поло с логотипом", category: "men", price: 3799, oldPrice: 4299, badge: "sale" },
        { id: 24, name: "Комбинезон джинсовый", category: "women", price: 7999, oldPrice: null, badge: "new" },
        { id: 25, name: "Ветровка спортивная", category: "unisex", price: 6499, oldPrice: 6999, badge: "sale" }
    ];
}

function getCategoryName(category) {
    switch(category) {
        case 'men': return 'Мужская одежда';
        case 'women': return 'Женская одежда';
        case 'unisex': return 'Унисекс';
        default: return 'Одежда';
    }
}

function addToCartFromCatalog(productId, redirect) {
    const products = window.products || getCatalogProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Получаем текущую корзину
    const cart = JSON.parse(localStorage.getItem('crushersCart')) || [];
    
    // Проверяем, есть ли уже такой товар
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            imageColor: getImageClass(product.id),
            quantity: 1
        });
    }
    
    // Сохраняем корзину
    localStorage.setItem('crushersCart', JSON.stringify(cart));
    
    // Обновляем счетчик
    updateCartCount();
    
    // Показываем уведомление
    if (window.showCartNotification) {
        window.showCartNotification(product.name, redirect);
    } else {
        showCartNotificationLocal(product.name, redirect);
    }
    
    if (redirect) {
        window.location.href = 'cart.html';
    }
}

function showCartNotificationLocal(productName, redirectToCart) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle" aria-hidden="true"></i>
            <div>
                <p>Товар "${productName}" добавлен в корзину</p>
                ${!redirectToCart ? '<a href="cart.html" class="btn-secondary btn-small">Перейти в корзину</a>' : ''}
            </div>
            <button class="notification-close" aria-label="Закрыть уведомление">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Закрытие уведомления
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

function initCatalogFilters() {
    // Фильтр по категориям
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Убираем активный класс со всех ссылок
            categoryLinks.forEach(l => l.classList.remove('active'));
            // Добавляем активный класс на текущую ссылку
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterProducts(category, 'category');
        });
    });
    
    // Фильтр по коллекциям
    const collectionLinks = document.querySelectorAll('.collection-link');
    collectionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const collection = this.dataset.collection;
            filterProducts(collection, 'collection');
        });
    });
    
    // Фильтр по цене
    const priceSlider = document.getElementById('price-slider');
    const minPriceSpan = document.getElementById('min-price');
    const maxPriceSpan = document.getElementById('max-price');
    const applyPriceFilterBtn = document.getElementById('apply-price-filter');
    
    if (priceSlider && maxPriceSpan) {
        priceSlider.addEventListener('input', function() {
            maxPriceSpan.textContent = this.value;
            priceSlider.setAttribute('aria-valuenow', this.value);
        });
        
        if (applyPriceFilterBtn) {
            applyPriceFilterBtn.addEventListener('click', function() {
                const maxPrice = parseInt(priceSlider.value);
                filterByPrice(maxPrice);
            });
        }
    }
    
    // Фильтр по размерам
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс со всех кнопок
            sizeButtons.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс на текущую кнопку
            this.classList.add('active');
            
            const size = this.dataset.size;
            // В реальном приложении здесь была бы фильтрация по размеру
            console.log('Выбран размер:', size);
        });
    });
    
    // Фильтр по цветам
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const color = this.dataset.color;
            // В реальном приложении здесь была бы фильтрация по цвету
            console.log('Выбран цвет:', color);
        });
    });
    
    // Сброс фильтров
    const resetFiltersBtn = document.getElementById('reset-filters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            // Сбрасываем активные классы
            categoryLinks.forEach(l => {
                if (l.dataset.category === 'all') {
                    l.classList.add('active');
                } else {
                    l.classList.remove('active');
                }
            });
            
            collectionLinks.forEach(l => l.classList.remove('active'));
            sizeButtons.forEach(b => {
                if (b.dataset.size === 'M') {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });
            
            // Сбрасываем слайдер цены
            if (priceSlider) {
                priceSlider.value = 20000;
                if (maxPriceSpan) maxPriceSpan.textContent = '20000';
                priceSlider.setAttribute('aria-valuenow', '20000');
            }
            
            // Показываем все товары
            const allProducts = document.querySelectorAll('.catalog-product');
            allProducts.forEach(product => {
                product.style.display = 'block';
            });
        });
    }
}

function filterProducts(value, type) {
    const allProducts = document.querySelectorAll('.catalog-product');
    
    allProducts.forEach(product => {
        if (type === 'category') {
            if (value === 'all' || product.dataset.category === value) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        } else if (type === 'collection') {
            if (value === 'all' || product.dataset.collection === value) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        }
    });
}

function filterByPrice(maxPrice) {
    const allProducts = document.querySelectorAll('.catalog-product');
    
    allProducts.forEach(product => {
        const price = parseInt(product.dataset.price);
        if (price <= maxPrice) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function initSorting() {
    const sortSelect = document.getElementById('sort-by');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        const sortType = this.value;
        sortProducts(sortType);
    });
}

function sortProducts(sortType) {
    const catalogGrid = document.getElementById('catalog-products-grid');
    if (!catalogGrid) return;
    
    const products = Array.from(catalogGrid.querySelectorAll('.catalog-product'));
    
    products.sort((a, b) => {
        const priceA = parseInt(a.dataset.price);
        const priceB = parseInt(b.dataset.price);
        const nameA = a.querySelector('.product-title').textContent;
        const nameB = b.querySelector('.product-title').textContent;
        
        switch(sortType) {
            case 'price-asc':
                return priceA - priceB;
            case 'price-desc':
                return priceB - priceA;
            case 'name':
                return nameA.localeCompare(nameB);
            case 'new':
                // Для новизны проверяем наличие бейджа "new"
                const isNewA = a.querySelector('.product-badge')?.textContent === 'Новинка';
                const isNewB = b.querySelector('.product-badge')?.textContent === 'Новинка';
                return (isNewB ? 1 : 0) - (isNewA ? 1 : 0);
            case 'popular':
            default:
                // Для популярности проверяем наличие бейджа "bestseller"
                const isPopularA = a.querySelector('.product-badge')?.textContent === 'Хит продаж';
                const isPopularB = b.querySelector('.product-badge')?.textContent === 'Хит продаж';
                return (isPopularB ? 1 : 0) - (isPopularA ? 1 : 0);
        }
    });
    
    // Очищаем контейнер и добавляем отсортированные товары
    catalogGrid.innerHTML = '';
    products.forEach(product => {
        catalogGrid.appendChild(product);
    });
}

function initViewToggle() {
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const catalogGrid = document.getElementById('catalog-products-grid');
    
    if (!gridViewBtn || !listViewBtn || !catalogGrid) return;
    
    gridViewBtn.addEventListener('click', function() {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        catalogGrid.classList.remove('list-view');
        catalogGrid.classList.add('grid-view');
    });
    
    listViewBtn.addEventListener('click', function() {
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        catalogGrid.classList.remove('grid-view');
        catalogGrid.classList.add('list-view');
    });
}

function initPagination() {
    const paginationBtns = document.querySelectorAll('.pagination-btn:not(:disabled)');
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.querySelector('i')) return; // Пропускаем кнопки со стрелками
            
            // Убираем активный класс со всех кнопок
            paginationBtns.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс на текущую кнопку
            this.classList.add('active');
            
            // В реальном приложении здесь была бы загрузка соответствующей страницы
            console.log('Переход на страницу:', this.textContent);
        });
    });
}

// Обновляем счетчик корзины (функция из script.js)
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('crushersCart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count, #mobile-cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    
    if (productId) {
        // Прокручиваем к товару и выделяем его
        setTimeout(() => {
            const productElement = document.querySelector(`.catalog-product[data-id="${productId}"]`);
            if (productElement) {
                productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                productElement.style.boxShadow = '0 0 0 3px var(--accent-color)';
                setTimeout(() => {
                    productElement.style.boxShadow = '';
                }, 3000);
            }
        }, 500);
    }
}