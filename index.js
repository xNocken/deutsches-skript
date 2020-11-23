const fs = require('fs');

let file = fs.readFileSync(process.argv[2]).toString();
let modified = true;

while (modified) {
    modified = false;

    file = file.replace(/summe ([a-z0-9]+)(?:, ([a-z0-9]+))/gm, (match, ...p) => {
        modified = true;
        return p.slice(0, -2).join(' + ');
    });

    file = file.replace(/konstante ([a-z0-9]+) ist ([a-z0-9]+)/gm, (match, p1, p2) => {
        modified = true;
        return `const ${p1} = ${p2}`;
    });

    file = file.replace(/([a-z0-9\.]+) in ([a-z0-9]+)/gm, (match, ...p) => {
        modified = true;
        return p.slice(0, -2).reverse().join('.');
    });
}

fs.writeFileSync(process.argv[2].replace('ds', 'js'), file);
