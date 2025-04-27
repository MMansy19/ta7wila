

import { Locale } from '@/i18n-config';
import LandingPage from '../PageContent';

export default async function Home({ params }: {   params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  return (
   
    <LandingPage lang={lang}/>
    
  );
}