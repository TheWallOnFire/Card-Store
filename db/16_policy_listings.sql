-- Policy: Listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read listings" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Users can manage own listings" ON public.listings 
    FOR ALL USING (auth.uid() = seller_id);
