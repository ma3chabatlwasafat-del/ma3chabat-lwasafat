// Smart Checkout System
class CheckoutSystem {
    constructor() {
        this.currentProduct = null;
        this.currentQuantity = 1;
        this.currentPrice = 0;
    }

    showCheckoutForm(productName, price, quantity) {
        this.currentProduct = productName;
        this.currentQuantity = quantity;
        this.currentPrice = price;
        
        const totalPrice = price * quantity;
        
        // Create form HTML
        const formHTML = `
            <div class="checkout-overlay" id="checkoutOverlay">
                <div class="checkout-form">
                    <div class="checkout-header">
                        <h3>📱 إتمام الطلب</h3>
                        <button class="close-btn" onclick="checkout.closeForm()">×</button>
                    </div>
                    
                    <div class="order-summary">
                        <h4>ملخص الطلب</h4>
                        <div class="summary-item">
                            <span>المنتج:</span>
                            <span>${productName}</span>
                        </div>
                        <div class="summary-item">
                            <span>الكمية:</span>
                            <span>${quantity}</span>
                        </div>
                        <div class="summary-item total">
                            <span>الثمن الإجمالي:</span>
                            <span>${totalPrice} درهم</span>
                        </div>
                    </div>
                    
                    <form id="customerForm" onsubmit="checkout.submitOrder(event)">
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
        
        // Add form to body
        document.body.insertAdjacentHTML('beforeend', formHTML);
        
        // Add styles
        this.addCheckoutStyles();
    }
    
    closeForm() {
        const overlay = document.getElementById('checkoutOverlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    submitOrder(event) {
        event.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const city = document.getElementById('city').value;
        
        const totalPrice = this.currentPrice * this.currentQuantity;
        
        // Create WhatsApp message
        const message = `السلام عليكم، أريد طلب منتج: ${this.currentProduct}
الكمية: ${this.currentQuantity}
الثمن الإجمالي: ${totalPrice} درهم
--- معلومات المشتري ---
الإسم: ${fullName}
المدينة: ${city}
الهاتف: ${phoneNumber}`;
        
        // Open WhatsApp
        const whatsappUrl = `https://wa.me/212783786875?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Close form
        this.closeForm();
    }
    
    addCheckoutStyles() {
        if (document.getElementById('checkoutStyles')) return;
        
        const styles = `
            <style id="checkoutStyles">
                .checkout-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                }
                
                .checkout-form {
                    background: white;
                    border-radius: 20px;
                    padding: 30px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    border: 2px solid rgba(27, 48, 34, 0.1);
                    animation: slideUp 0.3s ease;
                }
                
                .checkout-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #1B3022;
                }
                
                .checkout-header h3 {
                    color: #1B3022;
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 0;
                }
                
                .close-btn {
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
                
                .close-btn:hover {
                    background: #f5f5f5;
                    color: #1B3022;
                }
                
                .order-summary {
                    background: #FAF8F3;
                    border-radius: 15px;
                    padding: 20px;
                    margin-bottom: 25px;
                    border: 1px solid rgba(197, 160, 33, 0.2);
                }
                
                .order-summary h4 {
                    color: #1B3022;
                    margin: 0 0 15px 0;
                    font-size: 1.1rem;
                }
                
                .summary-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    color: #333;
                }
                
                .summary-item.total {
                    font-weight: 700;
                    color: #1B3022;
                    font-size: 1.1rem;
                    padding-top: 10px;
                    border-top: 1px solid rgba(197, 160, 33, 0.3);
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    color: #1B3022;
                    font-weight: 600;
                }
                
                .form-group input {
                    width: 100%;
                    padding: 12px 15px;
                    border: 2px solid #e0e0e0;
                    border-radius: 10px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    font-family: 'Cairo', 'Tajawal', sans-serif;
                }
                
                .form-group input:focus {
                    outline: none;
                    border-color: #1B3022;
                    box-shadow: 0 0 0 3px rgba(27, 48, 34, 0.1);
                }
                
                .form-actions {
                    display: flex;
                    gap: 15px;
                    margin-top: 25px;
                }
                
                .form-actions button {
                    flex: 1;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: 'Cairo', 'Tajawal', sans-serif;
                }
                
                .cancel-btn {
                    background: #f5f5f5;
                    color: #666;
                }
                
                .cancel-btn:hover {
                    background: #e0e0e0;
                }
                
                .confirm-btn {
                    background: linear-gradient(135deg, #1B3022, #0F1F14);
                    color: white;
                }
                
                .confirm-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(27, 48, 34, 0.3);
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { 
                        transform: translateY(50px);
                        opacity: 0;
                    }
                    to { 
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                @media (max-width: 768px) {
                    .checkout-form {
                        padding: 20px;
                        margin: 20px;
                    }
                    
                    .form-actions {
                        flex-direction: column;
                    }
                    
                    .form-actions button {
                        width: 100%;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Initialize checkout system
const checkout = new CheckoutSystem();

// Update the sendWhatsApp function to use checkout
function sendWhatsApp(element, productName, price) {
    const quantityInput = element.parentElement.querySelector('.quantity-input');
    const quantity = parseInt(quantityInput.value) || 1;
    
    checkout.showCheckoutForm(productName, price, quantity);
}
