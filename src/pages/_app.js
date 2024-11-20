import { useEffect } from 'react';
import emailjs from '@emailjs/browser';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize EmailJS
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
