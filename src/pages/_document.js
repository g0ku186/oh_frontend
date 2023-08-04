import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  const claritySCript = `
  (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "i9ug4r8jr2");
`;

  const gtagScript = `
  <!-- Google tag (gtag.js) -->
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-JNRWMFZHQ4');
`;

  return (
    <Html lang="en">
      <Head />
      <script dangerouslySetInnerHTML={{ __html: claritySCript }} />
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-JNRWMFZHQ4"></script>
      <script dangerouslySetInnerHTML={{ __html: gtagScript }} />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
