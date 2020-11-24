const fs = require('fs');

let file = fs.readFileSync(process.argv[2]).toString();
let modified = true;

const stuff = [
    {
        regex: /summe von ([a-z0-9\.]+) und ([a-z0-9\.\"]+)/gm,
        function: (_, p1, p2) => `${p1} + ${p2}`,
    },
    {
        regex: /produkt von ([a-z0-9\.]+) und ([a-z0-9\.\"]+)/gm,
        function: (_, p1, p2) => `${p1} * ${p2}`,
    },
    {
        regex: /differenz von ([a-z0-9\.]+) und ([a-z0-9\.\"]+)/gm,
        function: (_, p1, p2) => `${p1} - ${p2}`,
    },
    {
        regex: /quotient von ([a-z0-9\.]+) und ([a-z0-9\.\"]+)/gm,
        function: (_, p1, p2) => `${p1} / ${p2}`,
    },
    {
        regex: /gib ([a-z0-9\.\"\s]+) in der konsole aus/gms,
        function: (_, p1) => `console.log(${p1})`,
    },
    {
        regex: /objekt ([a-z0-9\.]+) {\n(.+)\n}/gms,
        function: (_, p1, p2) => `const ${p1} = {\n${p2.split('\n').map((line) => line.replace(/([a-z0-9\.]+) ist ("?[a-z0-9\.\+\-\*\/\s]+"?);/, (__, pp1, pp2) => `${pp1}: ${pp2},`)).join('\n')}}`,
    },
    {
        regex: /([a-z0-9]+) ist (.+)/gm,
        function: (_, p1, p2) => `${p1} = ${p2}`,
    },
    {
        regex: /konstante/gm,
        function: () => 'const',
    },
    {
        regex: /([a-z0-9\.]+) in ([a-z0-9]+)/gm,
        function: (_, p1, p2) => `${p2}.${p1}`,
    },
    {
        regex: /liste ([a-z0-9\.\"]+) {\n(.+)\}/gms,
        function: (_, p1, p2) => `const ${p1} = [\n${p2.replace(/;/gs, ',')}\n]`,
    },
    {
        regex: /importiert von (.+);/gm,
        function: (_, p1) => `require('${p1}');`,
    },
    {
        regex: /eine neue instanz von/gms,
        function: () => `new`,
    },
];

while (modified) {
    modified = false;

    stuff.forEach(({regex, function: funktion}) => {
        file = file.replace(regex, (...p) => {
            modified = true;
            
            return funktion(...p);
        });
    })
}

console.log(durch);

fs.writeFileSync(process.argv[2].replace('ds', 'js'), file);
