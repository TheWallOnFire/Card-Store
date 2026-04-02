-- Policy: Games
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read games" ON public.games FOR SELECT USING (true);
CREATE POLICY "Admins can manage games" ON public.games 
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
