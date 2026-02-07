// Catalog functionality
function initializeCatalog() {
    // Load products
    renderProducts(products);
    
    // Setup event listeners
    setupCatalogFilters();
    setupSorting();
    setupViewControls();
    
    // Update price range display
    const priceRange = document.getElementById('priceRange');
    const currentPrice = document.getElementById('currentPrice');
    
    if (priceRange && currentPrice) {
        priceRange.addEventListener('input', function() {
            currentPrice.textContent = `${parseInt(this.value).toLocaleString()} ₽`;
        });
    }
}

function renderProducts(productsToRender) {
    const container = document.getElementById('catalogProducts');
    if (!container) return;
    
    container.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productHTML = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div style="font-size: 0.9rem; color: var(--gray); margin-bottom: 0.5rem;">
                        ${product.brand.toUpperCase()}
                    </div>
                    <p class="product-price">${product.price.toLocaleString()} ₽</p>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">
                        В корзину
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += productHTML;
    });
}

function setupCatalogFilters() {
    const applyBtn = document.querySelector('.apply-filters-btn');
    const resetBtn = document.querySelector('.reset-filters-btn');
    const sizeBtns = document.querySelectorAll('.size-btn');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', applyFilters);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

function applyFilters() {
    const selectedCategories = Array.from(document.querySelectorAll('.filter-option input[type="checkbox"]:checked'))
        .map(cb => cb.parentElement.textContent.trim().toLowerCase());
    
    const selectedBrands = Array.from(document.querySelectorAll('.filter-option input[type="checkbox"]:checked'))
        .map(cb => cb.parentElement.textContent.trim().toLowerCase());
    
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    const selectedSizes = Array.from(document.querySelectorAll('.size-btn.active'))
        .map(btn => parseInt(btn.textContent));
    
    let filteredProducts = products;
    
    // Filter by categories
    if (selectedCategories.length > 0 && !selectedCategories.includes('все кроссовки')) {
        filteredProducts = filteredProducts.filter(product => 
            selectedCategories.some(cat => product.category.includes(cat))
        );
    }
    
    // Filter by brands
    if (selectedBrands.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedBrands.includes(product.brand)
        );
    }
    
    // Filter by price
    filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    
    renderProducts(filteredProducts);
    showToast(`Найдено ${filteredProducts.length} товаров`, 'info');
}

function resetFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = cb.parentElement.textContent.includes('Все кроссовки');
    });
    
    document.getElementById('priceRange').value = 25000;
    document.getElementById('currentPrice').textContent = '25000 ₽';
    
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    renderProducts(products);
    showToast('Фильтры сброшены', 'info');
}

function setupSorting() {
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            let sortedProducts = [...products];
            
            switch(this.value) {
                case 'price-low':
                    sortedProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    sortedProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'new':
                    // For demo, just reverse the array
                    sortedProducts.reverse();
                    break;
                default:
                    // Popular (default order)
                    break;
            }
            
            renderProducts(sortedProducts);
        });
    }
}

function setupViewControls() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const catalogGrid = document.getElementById('catalogProducts');
    
    if (!viewBtns.length || !catalogGrid) return;
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (this.dataset.view === 'list') {
                catalogGrid.classList.add('list-view');
                catalogGrid.classList.remove('grid-view');
            } else {
                catalogGrid.classList.add('grid-view');
                catalogGrid.classList.remove('list-view');
            }
        });
    });
}
