'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';

import { StepLogistics, StepPayment, StepValidation, OrderManifest, Badge } from './CheckoutComponents';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', address: '', city: '', zip: '',
    cardNumber: '', expiry: '', cvc: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProcessOrder = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsProcessing(false);
    setIsComplete(true);
    clearCart();
  };

  if (isComplete) {
      return <CheckoutSuccess />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <CheckoutHeader step={step} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 flex flex-col gap-8">
               <AnimatePresence mode="wait">
                  {step === 1 && <StepLogistics data={formData} onChange={handleInputChange} onNext={() => setStep(2)} />}
                  {step === 2 && <StepPayment data={formData} onChange={handleInputChange} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
                  {step === 3 && <StepValidation onProcess={handleProcessOrder} isProcessing={isProcessing} totalPrice={totalPrice} />}
               </AnimatePresence>
            </div>
            <OrderManifest items={items} totalPrice={totalPrice} />
        </div>
      </div>
    </div>
  );
}

function CheckoutHeader({ step }: { step: number }) {
  return (
    <div className="mb-12">
      <Link href="/search" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 mb-6 transition-colors">
        <ChevronLeft className="w-3 h-3" /> Continue Collecting
      </Link>
      <div className="flex items-center justify-between border-b-4 border-slate-900 pb-4">
         <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Secure Checkout</h1>
         <div className="flex items-center gap-4">
            <Badge step={1} current={step} /><Badge step={2} current={step} /><Badge step={3} current={step} />
         </div>
      </div>
    </div>
  );
}

function CheckoutSuccess() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8"><CheckCircle2 className="w-12 h-12 text-green-500" /></div>
      <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic mb-4">Transaction Secured</h1>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-8 max-w-sm">
         Your order has been indexed and dispatched to CardVault Logistics. Tracking details will be available in your dashboard shortly.
      </p>
      <Link href="/dashboard"><Button className="bg-slate-900 text-white rounded-full px-12 py-6 font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-200">Go to Dashboard</Button></Link>
    </div>
  );
}
