'use client';

import React, { useState } from 'react';
import { useForm, UseFormRegister, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Search, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

const listingSchema = z.object({
  cardName: z.string().min(2, 'Card name must be at least 2 characters'),
  condition: z.enum(['NM', 'LP', 'MP', 'HP', 'DMG']),
  price: z.coerce.number().positive('Price must be greater than 0'),
  quantity: z.coerce.number().int().positive('Quantity must be at least 1'),
});

type ListingFormValues = z.infer<typeof listingSchema>;

export function QuickAddForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: { condition: 'NM', quantity: 1 }
  });

  const onSubmit = async (_data: ListingFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
      toast.success('Listing created successfully!');
      setTimeout(() => { setIsSuccess(false); reset(); }, 3000);
    } catch {
      toast.error('Failed to create listing. Please try again.');
    } finally { setIsSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardIdentitySection register={register} errors={errors} />
        <ConditionSection register={register} />
        <ValuationSection register={register} errors={errors} />
      </div>
      <SubmitButton isSubmitting={isSubmitting} isSuccess={isSuccess} />
      {isSuccess && <SuccessBadge />}
    </form>
  );
}

function CardIdentitySection({ register, errors }: { register: UseFormRegister<ListingFormValues>, errors: FieldErrors<ListingFormValues> }) {
    return (
        <div className="md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Identify Asset</label>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    {...register('cardName')}
                    placeholder="Search card name (e.g., Black Lotus)" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-blue-500 focus:bg-white outline-none transition-all"
                />
            </div>
            {errors.cardName && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 pl-2">{errors.cardName.message}</p>}
        </div>
    );
}

function ConditionSection({ register }: { register: UseFormRegister<ListingFormValues> }) {
    return (
        <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Grade / Condition</label>
            <select 
                {...register('condition')}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold appearance-none outline-none focus:border-blue-500 focus:bg-white"
            >
                <option value="NM">Near Mint (NM)</option>
                <option value="LP">Lightly Played (LP)</option>
                <option value="MP">Moderately Played (MP)</option>
                <option value="HP">Heavily Played (HP)</option>
                <option value="DMG">Damaged (DMG)</option>
            </select>
        </div>
    );
}

function ValuationSection({ register, errors }: { register: UseFormRegister<ListingFormValues>, errors: FieldErrors<ListingFormValues> }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Valuation ($)</label>
                    <input 
                        {...register('price')}
                        type="number" step="0.01" placeholder="0.00" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold focus:border-blue-500 focus:bg-white outline-none"
                    />
                </div>
                <div className="w-24">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Qty</label>
                    <input 
                        {...register('quantity')}
                        type="number" placeholder="1" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold focus:border-blue-500 focus:bg-white outline-none"
                    />
                </div>
            </div>
            {(errors.price || errors.quantity) && (
                <div className="space-y-1 pl-2">
                    {errors.price && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.price.message}</p>}
                    {errors.quantity && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.quantity.message}</p>}
                </div>
            )}
        </div>
    );
}

function SubmitButton({ isSubmitting, isSuccess }: { isSubmitting: boolean, isSuccess: boolean }) {
    return (
        <Button 
            type="submit" 
            disabled={isSubmitting || isSuccess}
            className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-xl ${
                isSuccess ? 'bg-green-500 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-200'
            }`}
        >
            {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSuccess ? (
                <CheckCircle2 className="w-4 h-4" />
            ) : (
                'Deploy Listing to Marketplace'
            )}
        </Button>
    );
}

function SuccessBadge() {
    return (
        <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-[10px] uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-3 h-3" /> Real-time Index Updated
        </div>
    );
}
