import '@/assets/styles/globals.css';

export const metadata = {
  title: 'Email Extractor',
  description: 'Extract emails from websites',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
