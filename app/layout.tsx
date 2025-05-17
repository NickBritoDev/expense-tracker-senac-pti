'use client'
import { ExpenseProvider } from '@/contexts/ExpenseContext';
import './globals.css';
import { Inter } from 'next/font/google';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '@/app/components/theme/theme';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ChakraProvider  theme={theme}>
        <ExpenseProvider>
            <body className={inter.className}>{children}</body>
        </ExpenseProvider>
      </ChakraProvider>
    </html>
  );
}
