import '@/assets/styles/globals.css';

export const metadata = {
  title: 'Email Extractor',
  description: 'Extract emails from websites',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head> 
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <title>{metadata.title}</title>

      {/* Google Analytics */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-QZHS5VS12Z"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QZHS5VS12Z');
            `,
          }}
        />
      </head>

      <body>{children}</body>
    </html>
  );
}
