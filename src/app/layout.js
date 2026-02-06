import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'EriMon - Forever',
  description: 'A special place for our memories',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-[#f3f4f6]">
        {/* O conteúdo de cada página entra aqui */}
        <div className="flex-grow">{children}</div>

        {/* Rodapé fixo para todas as rotas */}
        <footer className="py-8 text-center opacity-30">
          <p className="text-[#9ca3af] text-xs font-medium uppercase tracking-[0.3em]">
            EriMon • Forever
          </p>
        </footer>
      </body>
    </html>
  );
}
