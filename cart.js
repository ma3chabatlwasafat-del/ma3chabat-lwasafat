// Clean Cart System - Simple Logic
let cart = {};

// Initialize cart
document.addEventListener('DOMContentLoaded', function() {
    createCartIcon();
    createCartSidebar();
    setupButtons();
});

// Setup buttons
function setupButtons() {
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const name = e.target.dataset.name;
            const price = Number(e.target.dataset.price);
            
            if (!name || !price || price <= 0) {
                console.error('Invalid product data:', { name, price });
                return;
            }
            
            addToCart(name, price);
        });
    });
}

// Add to cart
function addToCart(name, price) {
    if (cart[name]) {
        cart[name].quantity++;
    } else {
        cart[name] = { quantity: 1, price: price };
    }
    showMessage('تمت إضافة المنتج بنجاح! ✅');
    renderCart();
    
    // Auto-open sidebar when items are added
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar && Object.keys(cart).length > 0) {
        sidebar.style.right = '0px';
    }
}

// Update quantity
function updateQuantity(name, change) {
    if (!cart[name]) return;
    
    cart[name].quantity += change;
    if (cart[name].quantity <= 0) {
        if (cart[name].quantity === 0) {
            if (confirm(`هل تريد حذف "${name}" من السلة؟`)) {
                removeFromCart(name);
            }
        } else {
            removeFromCart(name);
        }
    } else {
        renderCart();
    }
}

// Remove from cart
function removeFromCart(name) {
    delete cart[name];
    showMessage(`تم حذف "${name}" من السلة`);
    renderCart();
}

// Calculate total
function calculateTotal() {
    let total = 0;
    Object.values(cart).forEach(item => {
        total += item.price * item.quantity;
    });
    return total;
}

// Render cart UI
function renderCart() {
    updateCartIcon();
    updateCartSidebar();
}

// Update cart icon
function updateCartIcon() {
    const count = document.getElementById('cartCount');
    if (count) {
        const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
        count.textContent = totalItems;
    }
}

// Update cart sidebar
function updateCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    const list = document.getElementById('cartList');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const totalDiv = document.getElementById('cartTotal');
    
    if (Object.keys(cart).length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">السلة فارغة</p>';
        checkoutBtn.disabled = true;
        totalDiv.innerHTML = '';
        sidebar.style.display = 'block';
    } else {
        let html = '';
        let total = 0;
        
        Object.entries(cart).forEach(([name, item]) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            html += `
                <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div style="font-size: 16px; font-weight: 600; color: #1B3022; flex: 1;">${name}</div>
                        <button onclick="removeFromCart('${name}')" style="background: #dc3545; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center;">🗑️</button>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <button onclick="updateQuantity('${name}', -1)" style="background: #6c757d; color: white; border: none; border-radius: 4px; width: 25px; height: 25px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center;">−</button>
                            <span style="font-size: 16px; font-weight: bold; min-width: 30px; text-align: center;">${item.quantity}</span>
                            <button onclick="updateQuantity('${name}', 1)" style="background: #28a745; color: white; border: none; border-radius: 4px; width: 25px; height: 25px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center;">+</button>
                        </div>
                        <div style="font-size: 16px; font-weight: bold; color: #4CAF50;">${subtotal} درهم</div>
                    </div>
                </div>
            `;
        });
        
        totalDiv.innerHTML = `<div style="font-size: 20px; font-weight: bold; color: #1B3022; margin-top: 15px; padding: 15px; background: #e8f5e8; border-radius: 8px; text-align: center;">المجموع الإجمالي: ${total} درهم</div>`;
        list.innerHTML = html;
        checkoutBtn.disabled = false;
        sidebar.style.display = 'block';
    }
}

// Show message
function showMessage(text) {
    const message = document.createElement('div');
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        z-index: 10000;
        font-weight: bold;
        font-size: 18px;
        box-shadow: 0 5px 20px rgba(76, 175, 80, 0.4);
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// Create cart icon
function createCartIcon() {
    const icon = document.createElement('div');
    icon.id = 'cartIcon';
    icon.innerHTML = '🛒 <span id="cartCount">0</span>';
    icon.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 9999;
        font-size: 24px;
        font-weight: bold;
        box-shadow: 0 4px 20px rgba(76, 175, 80, 0.4);
        border: 3px solid white;
        animation: pulse 2s infinite;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        #cartCount {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #dc3545;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            border: 2px solid white;
        }
    `;
    document.head.appendChild(style);
    
    icon.onclick = toggleCart;
    document.body.appendChild(icon);
}

// Create cart sidebar
function createCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    if (!sidebar) {
        const sidebar = document.createElement('div');
        sidebar.id = 'cart-sidebar';
        sidebar.style.cssText = `
            position: fixed;
            top: 0;
            right: -350px;
            width: 350px;
            height: 100vh;
            background: white;
            border-left: 3px solid #1B3022;
            padding: 25px;
            transition: right 0.3s ease;
            z-index: 9999;
            box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
        `;
        
        sidebar.innerHTML = `
            <h3 style="font-size: 24px; margin-bottom: 20px; color: #1B3022;">🛒 السلة</h3>
            <div id="cartList" style="max-height: 60vh; overflow-y: auto;">
                <p style="text-align: center; color: #666; padding: 20px;">السلة فارغة</p>
            </div>
            <div id="cartTotal"></div>
            <button onclick="showCheckoutForm()" id="checkoutBtn" style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #4CAF50, #45a049); color: white; border: none; border-radius: 8px; cursor: pointer; width: 100%; font-size: 16px; font-weight: bold;" disabled>تأكيد الطلب</button>
            <button onclick="toggleCart()" style="margin-top: 10px; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; width: 100%; font-size: 14px;">إغلاق</button>
        `;
        
        document.body.appendChild(sidebar);
    }
}

// Toggle cart
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar.style.right === '0px') {
        sidebar.style.right = '-350px';
    } else {
        sidebar.style.right = '0px';
    }
}

// Show checkout form
function showCheckoutForm() {
    if (Object.keys(cart).length === 0) return;
    
    const overlay = document.createElement('div');
    overlay.id = 'checkoutOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 20000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    `;
    
    const form = document.createElement('div');
    form.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        width: 450px;
        max-width: 95%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    
    const total = calculateTotal();
    let orderDetails = '';
    
    Object.entries(cart).forEach(([name, item]) => {
        const subtotal = item.price * item.quantity;
        orderDetails += `${item.quantity} x ${name} (${subtotal} DH) + `;
    });
    
    form.innerHTML = `
        <h3 style="font-size: 24px; margin-bottom: 20px; color: #1B3022;">📱 إتمام الطلب</h3>
        <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 10px;">
            <h4 style="font-size: 18px; margin-bottom: 15px; color: #1B3022;">ملخص الطلب:</h4>
            <div style="font-size: 16px; margin-bottom: 10px;">${orderDetails.slice(0, -3)}</div>
            <div style="font-size: 20px; font-weight: bold; color: #1B3022; margin-top: 15px; padding: 15px; background: #e8f5e8; border-radius: 8px; text-align: center;">المجموع الإجمالي: ${total} درهم</div>
        </div>
        <form id="orderForm">
            <div style="margin-bottom: 20px;">
                <label style="font-size: 16px; font-weight: 600; color: #1B3022;">الإسم الكامل *</label><br>
                <input type="text" id="fullName" required style="width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; margin-top: 5px; box-sizing: border-box;">
            </div>
            <div style="margin-bottom: 20px;">
                <label style="font-size: 16px; font-weight: 600; color: #1B3022;">المدينة *</label><br>
                <input type="text" id="city" required style="width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; margin-top: 5px; box-sizing: border-box;">
            </div>
            <div style="margin-bottom: 20px;">
                <label style="font-size: 16px; font-weight: 600; color: #1B3022;">رقم الهاتف</label><br>
                <input type="tel" id="phone" style="width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; margin-top: 5px; box-sizing: border-box;">
            </div>
            <div style="display: flex; gap: 10px;">
                <button type="button" onclick="closeCheckoutForm()" style="flex: 1; padding: 15px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">إلغاء</button>
                <button type="submit" style="flex: 1; padding: 15px; background: linear-gradient(135deg, #4CAF50, #45a049); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">إرسال الطلب</button>
            </div>
        </form>
    `;
    
    overlay.appendChild(form);
    document.body.appendChild(overlay);
    
    document.getElementById('orderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        sendOrder();
    });
}

// Close checkout form
function closeCheckoutForm() {
    const overlay = document.getElementById('checkoutOverlay');
    if (overlay) overlay.remove();
}

// Send order to WhatsApp
function sendOrder() {
    const fullName = document.getElementById('fullName').value;
    const city = document.getElementById('city').value;
    const phone = document.getElementById('phone').value;
    
    let message = '🛒 طلب جديد من معشبة الوصفات\n\n';
    message += '📋 تفاصيل الطلب:\n';
    
    Object.entries(cart).forEach(([name, item]) => {
        const subtotal = item.price * item.quantity;
        message += `${item.quantity} x ${name} (${subtotal} DH)\n`;
    });
    
    const total = calculateTotal();
    message += `\n💰 Total: ${total} DH\n\n`;
    message += '👤 معلومات العميل:\n';
    message += `الإسم: ${fullName}\n`;
    message += `المدينة: ${city}\n`;
    message += `الهاتف: ${phone}\n`;
    
    const whatsappUrl = `https://wa.me/212783786875?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    cart = {};
    renderCart();
    closeCheckoutForm();
    showMessage('تم إرسال الطلب بنجاح!');
}
