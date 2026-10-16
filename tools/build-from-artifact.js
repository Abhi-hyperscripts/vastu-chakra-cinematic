// Rebuilds index.html from the single-file artifact: lifts <title>, font links and <style> into a real <head>.
const fs = require('fs'); const src = process.argv[2]; let body = fs.readFileSync(src, 'utf8');
const title = (body.match(/<title>[\s\S]*?<\/title>/) || [''])[0]; body = body.replace(title, '');
body = body.replace(/<meta name="claude:viewport-fit-sides"[^>]*>\s*/, '');
const links = [...body.matchAll(/<link [^>]*>\s*/g)].map(m => m[0]); links.forEach(l => body = body.replace(l, ''));
const style = (body.match(/<style>[\s\S]*?<\/style>/) || [''])[0]; body = body.replace(style, '');
body = body.replace(/\n\s*window\.APG = \{[^\n]*\n/, '\n');
const head = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${title}
<meta name="description" content="A cinematic concept for the APG Vastu home page: the 16-zone chakra as an instrument in ivory, lacquer and brass that assembles as you scroll.">
<meta property="og:title" content="APG Vastu Chakra">
<meta property="og:description" content="Know the 16 zones of your home. A cinematic concept page for Acharya Pankit Goyal's Vastu academy.">
<meta property="og:type" content="website">
<meta name="theme-color" content="#f8f3ec">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
${links.join('')}${style}
<style>:root { padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); } img { max-width: 100%; } [hidden] { display: none !important; }</style>
</head>
<body>
`;
fs.writeFileSync('index.html', head + body.trim() + '\n</body>\n</html>\n');
console.log('index.html', fs.statSync('index.html').size, 'bytes');
