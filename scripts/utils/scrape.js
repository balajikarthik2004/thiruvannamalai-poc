// fetch omgofficial CSS
fetch('https://omgofficial.com/static/css/main.a18ae2a5.css')
  .then(r => r.text())
  .then(css => {
    // Find root vars
    const root = css.match(/:root\{([^}]+)\}/);
    if (root) console.log('ROOT VARS:\n', root[1].replace(/;/g, ';\n'));
    
    // Find color mentions
    const colors = css.match(/#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|hsl\([^)]+\)/g);
    const unique = [...new Set(colors)].slice(0, 40);
    console.log('\nUNIQUE COLORS:\n', unique.join('\n'));
    
    // Find font families
    const fonts = css.match(/font-family:[^;}]+/g);
    if (fonts) console.log('\nFONTS:\n', [...new Set(fonts)].join('\n'));
    
    // Find background-color for sidebar/nav
    const bgMatches = css.match(/background(?:-color)?:[^;}]{3,60}/g);
    if (bgMatches) console.log('\nBACKGROUNDS:\n', [...new Set(bgMatches)].slice(0, 20).join('\n'));
  });
