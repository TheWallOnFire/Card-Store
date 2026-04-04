-- Policy: Listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read listings" ON public.listings FOR SELECT USING (true);

CREATE POLICY "Users can manage own listings" ON public.listings 
    FOR ALL 
    TO authenticated
    USING (auth.uid() = seller_id)
    WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Admins can manage all listings" ON public.listings
    FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
