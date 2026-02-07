// Cart page specific functions
function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity < 1) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            loadCart();
        }
    }
}

function updateCartItemQuantityInput(productId, input) {
    const newQuantity = parseInt(input.value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
        updateQuantity(productId, newQuantity);
    } else {
        input.value = cart.find(item => item.id === productId)?.quantity || 1;
    }
}

// Calculate cart totals
function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('cart.html')) {
        loadCart();
    }
});
