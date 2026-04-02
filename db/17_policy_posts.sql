-- Policy: Posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Admins can manage posts" ON public.posts 
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
