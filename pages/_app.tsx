import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import theme from '@/app/components/theme/theme';
import { ExpenseProvider } from '@/contexts/ExpenseContext';
import MainLayout from '@/app/components/layout/MainLayout';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
        }
      `}</style>
      <ExpenseProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ExpenseProvider>
    </ChakraProvider>
  );
}