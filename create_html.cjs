const fs = require('fs');
const css = fs.readFileSync('src/components/startanimation/StartAnimation.css', 'utf8');
const svg = fs.readFileSync('src/assets/POL_logo.svg', 'utf8');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Start Animation</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: black;
      overflow: hidden;
    }
    ${css}
  </style>
</head>
<body>
  ${svg}
</body>
</html>`;

fs.writeFileSync('src/components/startanimation/start_animation.html', html);
console.log('Successfully created start_animation.html');
