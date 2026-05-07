import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CreditCard, CheckCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ShippingInfo } from '../types';

const CheckoutPage: React.FC = () => {
  const { isDark, cart, cartTotal, placeOrder } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [orderId, setOrderId] = useState('');

  const shipping = cartTotal > 100 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const [form, setForm] = useState<ShippingInfo>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'US',
  });

  const updateForm = (field: keyof ShippingInfo, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = () => {
    const order = placeOrder(form);
    setOrderId(order.id);
    setStep('success');
  };

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? 'bg-dark-bg text-white' : 'bg-white text-black'} px-4`}>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/shop" className="px-6 py-3 gold-gradient text-white font-medium rounded-xl text-sm">
          Go Shopping
        </Link>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? 'bg-dark-bg text-white' : 'bg-white text-black'} px-4`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Order Confirmed!</h2>
          <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Order ID: <span className="font-mono font-bold text-gold">{orderId}</span></p>
          <p className={`text-sm mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Thank you for your purchase! We'll send a confirmation email shortly.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/shop" className="px-6 py-3 gold-gradient text-white font-medium rounded-xl text-sm">
              Continue Shopping
            </Link>
            <button
              onClick={() => navigate('/orders')}
              className={`px-6 py-3 rounded-xl text-sm font-medium border ${
                isDark ? 'border-dark-border text-gray-300' : 'border-gray-200 text-gray-600'
              }`}
            >
              View Orders
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-gold transition-colors ${
    isDark ? 'bg-dark-card border-dark-border text-white placeholder-gray-500' : 'bg-white border-gray-200 placeholder-gray-400'
  }`;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg text-white' : 'bg-white text-black'}`}>
      <div className={`${isDark ? 'bg-dark-surface border-dark-border' : 'bg-cream/30 border-gray-100'} border-b`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-4">Checkout</h1>
            <div className="flex gap-4">
              {['Shipping', 'Payment'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    (step === 'shipping' && i === 0) || (step === 'payment' && i <= 1)
                      ? 'gold-gradient text-white' : isDark ? 'bg-dark-card text-gray-500' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-sm font-medium ${
                    (step === 'shipping' && i === 0) || (step === 'payment') ? '' : isDark ? 'text-gray-500' : 'text-gray-400'
                  }`}>{s}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {step === 'shipping' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="font-bold text-lg mb-4">Shipping Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input placeholder="First Name" value={form.firstName} onChange={e => updateForm('firstName', e.target.value)} className={inputClass} />
                  <input placeholder="Last Name" value={form.lastName} onChange={e => updateForm('lastName', e.target.value)} className={inputClass} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="email" placeholder="Email" value={form.email} onChange={e => updateForm('email', e.target.value)} className={inputClass} />
                  <input type="tel" placeholder="Phone" value={form.phone} onChange={e => updateForm('phone', e.target.value)} className={inputClass} />
                </div>
                <input placeholder="Address" value={form.address} onChange={e => updateForm('address', e.target.value)} className={inputClass} />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <input placeholder="City" value={form.city} onChange={e => updateForm('city', e.target.value)} className={inputClass} />
                  <input placeholder="State" value={form.state} onChange={e => updateForm('state', e.target.value)} className={inputClass} />
                  <input placeholder="ZIP" value={form.zip} onChange={e => updateForm('zip', e.target.value)} className={inputClass} />
                </div>
                <button
                  onClick={() => setStep('payment')}
                  className="w-full py-4 gold-gradient text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-sm mt-4"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CreditCard size={20} /> Payment Details
                </h3>
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-dark-card border-dark-border' : 'bg-cream/50 border-gray-100'}`}>
                  <p className="text-xs text-gray-500 mb-3 flex items-center gap-1"><Lock size={12} /> Secure payment gateway</p>
                  <div className="space-y-4">
                    <input placeholder="Card Number" className={inputClass} />
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="MM/YY" className={inputClass} />
                      <input placeholder="CVC" className={inputClass} />
                    </div>
                    <input placeholder="Name on Card" className={inputClass} />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setStep('shipping')}
                    className={`px-6 py-4 rounded-xl text-sm font-medium border ${
                      isDark ? 'border-dark-border text-gray-300' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 py-4 gold-gradient text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-sm"
                  >
                    <Lock size={16} /> Place Order — ${total.toFixed(2)}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className={`sticky top-24 p-6 rounded-2xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-cream/50 border border-gray-100'}`}>
              <h3 className="font-bold mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex gap-3">
                    <img src={item.product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.product.name}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className={`border-t pt-3 space-y-2 ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-emerald-500">Free</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className={`border-t pt-2 ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-gold">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
