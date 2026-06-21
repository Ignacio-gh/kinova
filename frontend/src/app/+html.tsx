import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        {/* Reset necesario para que Expo web ocupe el viewport completo */}
        <style dangerouslySetInnerHTML={{
          __html: '#root,body,html{height:100%}body{overflow:hidden}#root{display:flex}'
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
