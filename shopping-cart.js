// Professional Shopping Cart System
class ShoppingCart {
    constructor() {
        this.items = [];
        this.isOpen = false;
        this.init();
    }

    init() {
        this.addCartStyles();
        this.createCartUI();
        this.loadCartFromStorage();
        this.updateCartUI();
    }

    addItem(productName, price, quantity, imageSrc) {
        // Check if item already exists
        const existingItem = this.items.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                name: productName,
                price: price,
                quantity: quantity,
                image: imageSrc
            });
        }
        
        this.saveCartToStorage();
        this.updateCartUI();
        this.showAddedNotification(productName);
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.saveCartToStorage();
        this.updateCartUI();
    }

    updateQuantity(index, newQuantity) {
        if (newQuantity >= 1 && newQuantity <= 1000) {
            this.items[index].quantity = newQuantity;
            this.saveCartToStorage();
            this.updateCartUI();
        }
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    toggleCart() {
        this.isOpen = !this.isOpen;
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        
        if (this.isOpen) {
            cartSidebar.classList.add('open');
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        } else {
            cartSidebar.classList.remove('open');
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    closeCart() {
        this.isOpen = false;
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        
        cartSidebar.classList.remove('open');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    showCheckout() {
        this.closeCart();
        checkout.showCartCheckout();
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        // Update cart count
        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
        }
        
        // Update cart items
        if (cartItems) {
            if (this.items.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <div class="empty-icon">🛒</div>
                        <p>السلة فارغة</p>
                        <small>أضف منتجات لبدء التسوق</small>
                    </div>
                `;
            } else {
                cartItems.innerHTML = this.items.map((item, index) => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <div class="cart-item-price">${item.price} درهم</div>
                            <div class="cart-item-quantity">
                                <button onclick="cart.updateQuantity(${index}, ${item.quantity - 1})" 
                                        class="quantity-btn" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                                <input type="number" value="${item.quantity}" min="1" max="1000" 
                                       onchange="cart.updateQuantity(${index}, parseInt(this.value))">
                                <button onclick="cart.updateQuantity(${index}, ${item.quantity + 1})" 
                                        class="quantity-btn" ${item.quantity >= 1000 ? 'disabled' : ''}>+</button>
                            </div>
                            <div class="cart-item-subtotal">${item.price * item.quantity} درهم</div>
                        </div>
                        <button onclick="cart.removeItem(${index})" class="remove-item">×</button>
                    </div>
                `).join('');
            }
        }
        
        // Update total
        if (cartTotal) {
            cartTotal.textContent = `${this.getTotalPrice()} درهم`;
        }
    }

    showAddedNotification(productName) {
        // Animate cart icon
        const cartIcon = document.getElementById('floatingCart');
        cartIcon.classList.add('cart-shake');
        
        // Show notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✓</span>
                <span>تمت إضافة "${productName}" إلى السلة</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Remove shake animation
        setTimeout(() => {
            cartIcon.classList.remove('cart-shake');
        }, 600);
    }

    createCartUI() {
        // Floating cart icon
        const cartIcon = document.createElement('div');
        cartIcon.id = 'floatingCart';
        cartIcon.className = 'floating-cart';
        cartIcon.onclick = () => this.toggleCart();
        cartIcon.innerHTML = `
            <div class="cart-icon">🛒</div>
            <div class="cart-count" id="cartCount">0</div>
        `;
        document.body.appendChild(cartIcon);

        // Cart sidebar
        const cartSidebar = document.createElement('div');
        cartSidebar.id = 'cartSidebar';
        cartSidebar.className = 'cart-sidebar';
        cartSidebar.innerHTML = `
            <div class="cart-header">
                <h3>🛒 سلة التسوق</h3>
                <button class="close-cart" onclick="cart.closeCart()">×</button>
            </div>
            <div class="cart-items" id="cartItems">
                <div class="empty-cart">
                    <div class="empty-icon">🛒</div>
                    <p>السلة فارغة</p>
                    <small>أضف منتجات لبدء التسوق</small>
                </div>
            </div>
            <div class="cart-footer">
                <div class="cart-total-row">
                    <span>المجموع:</span>
                    <span class="cart-total" id="cartTotal">0 درهم</span>
                </div>
                <button class="checkout-btn" onclick="cart.showCheckout()" 
                        ${this.items.length === 0 ? 'disabled' : ''}>
                    تأكيد الطلب
                </button>
            </div>
        `;
        document.body.appendChild(cartSidebar);

        // Overlay
        const overlay = document.createElement('div');
        overlay.id = 'cartOverlay';
        overlay.className = 'cart-overlay';
        overlay.onclick = () => this.closeCart();
        document.body.appendChild(overlay);
    }

    addCartStyles() {
        if (document.getElementById('cartStyles')) return;
        
        const styles = `
            <style id="cartStyles">
                /* Floating Cart Icon */
                .floating-cart {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #C5A021, #E6D690);
                    color: #1B3022;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(197, 160, 33, 0.4);
                    transition: all 0.3s ease;
                    z-index: 9999;
                    border: 3px solid white;
                }
                
                .floating-cart:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 25px rgba(197, 160, 33, 0.5);
                }
                
                .cart-shake {
                    animation: shake 0.6s ease-in-out;
                }
                
                @keyframes shake {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-10deg); }
                    75% { transform: rotate(10deg); }
                }
                
                .cart-icon {
                    font-size: 1.5rem;
                }
                
                .cart-count {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #1B3022;
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    font-weight: bold;
                    border: 2px solid white;
                }
                
                /* Cart Sidebar */
                .cart-sidebar {
                    position: fixed;
                    top: 0;
                    right: -400px;
                    width: 400px;
                    height: 100vh;
                    background: white;
                    box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
                    transition: right 0.3s ease;
                    z-index: 10001;
                    display: flex;
                    flex-direction: column;
                }
                
                .cart-sidebar.open {
                    right: 0;
                }
                
                .cart-header {
                    padding: 20px;
                    border-bottom: 2px solid #1B3022;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #FAF8F3;
                }
                
                .cart-header h3 {
                    color: #1B3022;
                    margin: 0;
                    font-size: 1.3rem;
                }
                
                .close-cart {
                    background: none;
                    border: none;
                    font-size: 2rem;
                    color: #666;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }
                
                .close-cart:hover {
                    background: #f5f5f5;
                    color: #1B3022;
                }
                
                .cart-items {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                }
                
                .empty-cart {
                    text-align: center;
                    padding: 40px 20px;
                    color: #666;
                }
                
                .empty-icon {
                    font-size: 3rem;
                    margin-bottom: 10px;
                    opacity: 0.5;
                }
                
                .cart-item {
                    display: flex;
                    gap: 15px;
                    padding: 15px;
                    border: 1px solid #e0e0e0;
                    border-radius: 10px;
                    margin-bottom: 15px;
                    background: #FAF8F3;
                    position: relative;
                }
                
                .cart-item-image {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 8px;
                }
                
                .cart-item-details {
                    flex: 1;
                }
                
                .cart-item-details h4 {
                    color: #1B3022;
                    margin: 0 0 5px 0;
                    font-size: 1rem;
                }
                
                .cart-item-price {
                    color: #C5A021;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                
                .cart-item-quantity {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    margin-bottom: 8px;
                }
                
                .cart-item-quantity input {
                    width: 50px;
                    text-align: center;
                    border: 1px solid #e0e0e0;
                    border-radius: 5px;
                    padding: 2px;
                }
                
                .cart-item-quantity button {
                    width: 25px;
                    height: 25px;
                    border: none;
                    background: #1B3022;
                    color: white;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 0.8rem;
                }
                
                .cart-item-quantity button:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
                
                .cart-item-subtotal {
                    color: #1B3022;
                    font-weight: 700;
                }
                
                .remove-item {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: #dc3545;
                    color: white;
                    border: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 0.8rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .cart-footer {
                    padding: 20px;
                    border-top: 2px solid #1B3022;
                    background: #FAF8F3;
                }
                
                .cart-total-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #1B3022;
                }
                
                .checkout-btn {
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(135deg, #1B3022, #0F1F14);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .checkout-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(27, 48, 34, 0.3);
                }
                
                .checkout-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
                
                /* Cart Overlay */
                .cart-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 10000;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                
                .cart-overlay.show {
                    opacity: 1;
                    visibility: visible;
                }
                
                /* Cart Notification */
                .cart-notification {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%) translateY(-100px);
                    background: linear-gradient(135deg, #1B3022, #0F1F14);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 50px;
                    box-shadow: 0 5px 20px rgba(27, 48, 34, 0.4);
                    z-index: 10002;
                    transition: all 0.3s ease;
                }
                
                .cart-notification.show {
                    transform: translateX(-50%) translateY(0);
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .notification-icon {
                    background: #C5A021;
                    color: #1B3022;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }
                
                /* Mobile Responsive */
                @media (max-width: 768px) {
                    .floating-cart {
                        top: 15px;
                        right: 15px;
                        width: 50px;
                        height: 50px;
                    }
                    
                    .cart-sidebar {
                        width: 100%;
                        right: -100%;
                    }
                    
                    .cart-item {
                        flex-direction: column;
                        text-align: center;
                    }
                    
                    .cart-item-image {
                        align-self: center;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    saveCartToStorage() {
        localStorage.setItem('ma3chabat_cart', JSON.stringify(this.items));
    }

    loadCartFromStorage() {
        const saved = localStorage.getItem('ma3chabat_cart');
        if (saved) {
            this.items = JSON.parse(saved);
        }
    }

    clearCart() {
        this.items = [];
        this.saveCartToStorage();
        this.updateCartUI();
    }

    getCartItemsForWhatsApp() {
        let message = 'Order List:\n';
        this.items.forEach((item, index) => {
            message += `${index + 1}. ${item.name} x ${item.quantity} = ${item.price * item.quantity} DH\n`;
        });
        message += `--- Total: ${this.getTotalPrice()} DH ---`;
        return message;
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Make cart globally accessible
window.cart = cart;
window.addToCart = addToCart;

// Initialize cart when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Cart is already initialized above
    console.log('Shopping cart initialized');
});

// Update checkout.js to handle cart checkout
const originalShowCheckoutForm = checkout.showCheckoutForm;
checkout.showCartCheckout = function() {
    if (cart.items.length === 0) return;
    
    const totalPrice = cart.getTotalPrice();
    
    const formHTML = `
        <div class="checkout-overlay" id="checkoutOverlay">
            <div class="checkout-form">
                <div class="checkout-header">
                    <h3>📱 إتمام الطلب</h3>
                    <button class="close-btn" onclick="checkout.closeForm()">×</button>
                </div>
                
                <div class="order-summary">
                    <h4>ملخص الطلب</h4>
                    ${cart.items.map(item => `
                        <div class="summary-item">
                            <span>${item.name} x ${item.quantity}:</span>
                            <span>${item.price * item.quantity} درهم</span>
                        </div>
                    `).join('')}
                    <div class="summary-item total">
                        <span>الثمن الإجمالي:</span>
                        <span>${totalPrice} درهم</span>
                    </div>
                </div>
                
                <form id="customerForm" onsubmit="checkout.submitCartOrder(event)">
                    <div class="form-group">
                        <label for="fullName">الإسم والنسب *</label>
                        <input type="text" id="fullName" name="fullName" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phoneNumber">رقم الهاتف</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber">
                    </div>
                    
                    <div class="form-group">
                        <label for="city">المدينة *</label>
                        <input type="text" id="city" name="city" required>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="cancel-btn" onclick="checkout.closeForm()">إلغاء</button>
                        <button type="submit" class="confirm-btn">تأكيد وإرسال</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHTML);
    this.addCheckoutStyles();
};

checkout.submitCartOrder = function(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const city = document.getElementById('city').value;
    
    const message = `${cart.getCartItemsForWhatsApp()}
Customer: ${fullName}, ${city}, ${phoneNumber}`;
    
    const whatsappUrl = `https://wa.me/212783786875?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    this.closeForm();
    cart.clearCart();
};

// Update the add to cart function
function addToCart(productName, price, imageSrc) {
    // Get the quantity from the input field
    const quantityInput = event.target.parentElement.querySelector('.quantity-input');
    const quantity = parseInt(quantityInput.value) || 1;
    
    // Add item to cart
    cart.addItem(productName, price, quantity, imageSrc);
}

// Make cart globally accessible
window.cart = cart;
window.addToCart = addToCart;
