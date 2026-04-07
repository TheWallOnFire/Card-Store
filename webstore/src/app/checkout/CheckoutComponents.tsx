import React from 'react';
import { motion } from 'framer-motion';
import { Truck, CreditCard, ShieldCheck, Loader2, Lock, LucideIcon, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ISectionHeaderProps {
  icon: LucideIcon;
  label: string;
  sub: string;
}

export function SectionHeader({ icon: Icon, label, sub }: ISectionHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-2xl text-slate-900">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                   <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{label}</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
                </div>
            </div>
        </div>
    );
}

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  full?: boolean;
}

export function Input({ label, full = false, ...props }: IInputProps) {
    return (
        <div className={full ? 'col-span-2' : ''}>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">{label}</label>
            <input 
                {...props}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-300 placeholder:font-bold disabled:opacity-50"
            />
        </div>
    );
}

export function StepLogistics({ onNext, data, onChange }: { onNext: () => void, data: any, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const isValid = data.firstName && data.lastName && data.address && data.city && data.zip;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-sm"
    >
       <SectionHeader icon={Truck} label="Logistics & Delivery" sub="Step 01" />
       <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" name="firstName" placeholder="Seto" value={data.firstName} onChange={onChange} />
          <Input label="Last Name" name="lastName" placeholder="Kaiba" value={data.lastName} onChange={onChange} />
          <Input label="Shipping Address" name="address" placeholder="Kaiba Corp Tower" full value={data.address} onChange={onChange} />
          <Input label="City" name="city" placeholder="Domino City" value={data.city} onChange={onChange} />
          <Input label="Zip Code" name="zip" placeholder="00000" value={data.zip} onChange={onChange} />
       </div>
       <Button 
         onClick={onNext}
         disabled={!isValid}
         className="w-full mt-10 bg-slate-900 text-white rounded-2xl py-6 font-black uppercase tracking-widest text-xs disabled:bg-slate-200 disabled:text-slate-400 transition-all"
       >
         Continue to Payment
       </Button>
    </motion.div>
  );
}

export function StepPayment({ onNext, onBack, data, onChange }: { onNext: () => void, onBack: () => void, data: any, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const isValid = data.cardNumber && data.expiry && data.cvc;

  return (
    <motion.div 
      key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-sm"
    >
       <SectionHeader icon={CreditCard} label="Payment Method" sub="Step 02" />
       <div className="space-y-4">
          <div className="p-6 border-2 border-blue-600 bg-blue-50/50 rounded-2xl flex items-center justify-between">
             <div className="flex items-center gap-4">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div>
                   <p className="text-xs font-black text-slate-900 uppercase">Credit / Debit Card</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secured via Stripe</p>
                </div>
             </div>
             <div className="w-4 h-4 rounded-full border-4 border-blue-600" />
          </div>
          <Input label="Card Details" name="cardNumber" placeholder="0000 0000 0000 0000" value={data.cardNumber} onChange={onChange} maxLength={19} />
          <div className="grid grid-cols-2 gap-4">
             <Input label="Expiry" name="expiry" placeholder="MM/YY" value={data.expiry} onChange={onChange} maxLength={5} />
             <Input label="CVC" name="cvc" placeholder="***" value={data.cvc} onChange={onChange} maxLength={4} />
          </div>
       </div>
       <div className="flex gap-4 mt-10">
          <Button variant="ghost" onClick={onBack} className="flex-1 font-black uppercase tracking-widest text-xs">Back</Button>
          <Button onClick={onNext} disabled={!isValid} className="flex-[2] bg-slate-900 text-white rounded-2xl py-6 font-black uppercase tracking-widest text-xs disabled:bg-slate-200">Review Order</Button>
       </div>
    </motion.div>
  );
}

export function StepValidation({ onProcess, isProcessing, totalPrice }: { onProcess: () => void, isProcessing: boolean, totalPrice: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-sm"
    >
       <SectionHeader icon={ShieldCheck} label="Final Validation" sub="Step 03" />
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-6">
          Please verify your items and shipping details. Once confirmed, your order will be instantly indexed.
       </p>
       <div className="space-y-3 mb-10">
          <div className="flex justify-between text-xs font-bold uppercase text-slate-900"><span>Shipping:</span><span>Free (Priority)</span></div>
          <div className="flex justify-between text-xs font-bold uppercase text-slate-900"><span>Logistics Fee:</span><span>Included</span></div>
       </div>
       <Button 
         onClick={onProcess} disabled={isProcessing}
         className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-8 font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-200 group relative overflow-hidden"
       >
         {isProcessing ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : <>Finalize & Pay ${totalPrice.toFixed(2)}<Lock className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" /></>}
       </Button>
    </motion.div>
  );
}

import { ICard } from '@/types/models';
interface ICartItem extends ICard { quantity: number; }

export function OrderManifest({ items, totalPrice }: { items: ICartItem[], totalPrice: number }) {
  return (
    <div className="lg:col-span-5 sticky top-24">
      <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
         <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-8 italic">Order Manifest</h2>
         <div className="max-h-80 overflow-y-auto pr-2 space-y-6 mb-8 scrollbar-hide">
            {items.map((item) => (
               <div key={item.id} className="flex gap-4">
                  <div className="w-12 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-100 italic font-black text-[10px] items-center justify-center flex uppercase opacity-50">TCG</div>
                  <div className="flex-1">
                     <p className="text-[10px] font-black text-slate-900 leading-tight uppercase line-clamp-1">{item.name}</p>
                     <div className="flex justify-between items-center mt-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Qty {item.quantity}</p>
                        <p className="text-xs font-black text-slate-900">${(item.marketPrice * item.quantity).toFixed(2)}</p>
                     </div>
                  </div>
               </div>
            ))}
         </div>
         <div className="border-t-2 border-slate-100 pt-6 space-y-2">
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest"><span>Market Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
            <div className="flex justify-between text-lg font-black text-slate-900 uppercase italic tracking-tighter"><span>Order Total</span><span>${totalPrice.toFixed(2)}</span></div>
         </div>
      </div>
      <div className="mt-6 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-center gap-4">
         <Zap className="w-6 h-6 text-blue-600" />
         <p className="text-[10px] font-bold text-blue-800/60 leading-relaxed uppercase tracking-tight">This order qualifies for <span className="text-blue-600 font-black">Flash Logistics</span>. Estimated delivery: 48 hours.</p>
      </div>
    </div>
  );
}

export function Badge({ step, current }: { step: number, current: number }) {
    const isActive = step <= current;
    return (
        <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${isActive ? 'bg-blue-600 border-blue-600' : 'bg-transparent border-slate-200'}`} />
    );
}
