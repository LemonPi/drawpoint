# Draw Points
A simple library to abstract drawing on HTML canvases by 
using points and operations on points.

## Usage
Get by cloning the repository, or `npm install drawpoint`.

### building from source
```bash
npm install
npm run build
```

### testing
```bash
npm install
npm test [optional seed]
```
The test outputs the seed it's using at the top, which you can
pass back into `npm test [seed]` to replicate behaviour.

### demo
The demo's now a separate project.
Instructions to come.

### include (browser)

Include `dist/drawpoint.js` in a script tag and use `drawpoint` as the global namespace containing all the functions.

```html
<html>
<head>
    <meta charset="UTF-8">
    <script src="./drawpoint.js"></script>
</head>
<body>
<canvas id="cv" width="600" height="600" style="border:solid black 2px"></canvas>
<script>
// can use just as a global variable in the browser
// use dp as a shorthand
const dp = drawpoint;
</script>
</body>
</html>
```

### include (CommonJS)
Only useful is the source is ultimately used in the browser since that's the only
place where canvas and rendering contexts exist. This would be the case if the
code's passed through `browserify` or `webpack`, for example.
```javascript
const dp = require('drawpoint');
```
