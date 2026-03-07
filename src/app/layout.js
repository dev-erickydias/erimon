import './globals.css';

export const metadata = {
  title: 'EriMon — Forever',
  description: 'A special place for our love story',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        {/* Main content */}
        <div className="flex-grow relative z-10">{children}</div>

        {/* Elegant footer */}
        <footer className="py-10 text-center relative z-10">
          <div className="elegant-divider max-w-[120px] mx-auto mb-4">
            <span className="text-[10px] text-[var(--rose-gold-light)]">♥</span>
          </div>
          <p className="text-[var(--warm-gray-400)] text-[10px] font-body font-medium uppercase tracking-[0.35em]">
            EriMon • Forever
          </p>
        </footer>
      </body>
    </html>
  );
}
