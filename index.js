const fs = require('fs');

let file = fs.readFileSync(process.argv[2]).toString();
let modified = true;

const map = {
    condition: {
        gleich: '==',
        größer: '>',
        kleiner: '<',
    }
}

const stuff = [
    {
        regex: /([a-z0-9\.\"\s]+) ist ((?:nicht )?)(gleich|größer|kleiner) (als |gleich )?([a-zA-Z0-9\.\"\s]+)/gmsi,
        function: (_, firstVar, isInverted, method, sameAs, lastVar) => `${firstVar} ${isInverted ? '!' : ''}${map.condition[method]}${sameAs === 'gleich ' ? '=' : ''} ${lastVar}`,
    },
    {
        regex: /summe von ([a-z0-9\.\"\+]+) und ([a-z0-9\.\"\+]+)/gim,
        function: (_, p1, p2) => `${p1} + ${p2}`,
    },
    {
        regex: /produkt von ([a-z0-9\.\"\+]+) und ([a-z0-9\.\"\+]+)/gmi,
        function: (_, p1, p2) => `${p1} * ${p2}`,
    },
    {
        regex: /differenz von ([a-z0-9\.\"\+]+) und ([a-z0-9\.\"\+]+)/gim,
        function: (_, p1, p2) => `${p1} - ${p2}`,
    },
    {
        regex: /quotient von ([a-z0-9\.\"]+\+) und ([a-z0-9\.\"\+]+)/gim,
        function: (_, p1, p2) => `${p1} / ${p2}`,
    },
    {
        regex: /gib ([a-z0-9\.\"\s\(\)]+) in der konsole aus/gims,
        function: (_, p1) => `console.log(${p1})`,
    },
    {
        regex: /objekt ([a-z0-9\.]+) {\n(.+)\n}/gmis,
        function: (_, p1, p2) => `const ${p1} = {\n${p2.split('\n').map((line) => line.replace(/([a-z0-9\.]+) ist ("?[a-z0-9\.\+\-\*\/\s]+"?);/, (__, pp1, pp2) => `${pp1}: ${pp2},`)).join('\n')}}`,
    },
    {
        regex: /([a-z0-9]+) ist (.+)/gim,
        function: (_, p1, p2) => `${p1} = ${p2}`,
    },
    {
        regex: /konstante/gmi,
        function: () => 'const',
    },
    {
        regex: /([a-z0-9\.]+) in ([a-z0-9]+)/gim,
        function: (_, p1, p2) => `${p2}.${p1}`,
    },
    {
        regex: /liste ([a-z0-9\.\"]+) {\n(.+)\}/gims,
        function: (_, p1, p2) => `const ${p1} = [\n${p2.replace(/;/gs, ',')}\n]`,
    },
    {
        regex: /eine funktion mit den argumenten ([a-z0-9\.\"\s]+) und führt(.+)aus/gmis,
        function: (_, p1, p2) => `(${p1.replace(/\sund/g, ',')}) => {${p2}}`,
    },
    {
        regex: /wenn ([a-z0-9\.\"\s\=\<\>\!]+) dann führ(.+)aus/gims,
        function: (_, p1, p2, p3, p4) => `if (${p1}) {${p2}}`,
    },
    {
        regex: /importiert von (.+);/gmi,
        function: (_, p1) => `require('${p1}');`,
    },
    {
        regex: /eine neue instanz von/gmsi,
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

if (process.argv[3]) {
    eval(file);
}

fs.writeFileSync(process.argv[2].replace('ds', 'js'), file);
