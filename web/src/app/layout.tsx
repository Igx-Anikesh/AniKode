import type { Metadata } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'AniKode - Code at the Speed of Thought',
  description: 'A modern, blazingly fast programming language combining the simplicity of scripting with native C++ machine performance and first-class propositional logic.',
  keywords: ['AniKode', 'programming language', 'compiler', 'C++', 'sandbox', 'open source', 'logic programming'],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
