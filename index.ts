export function html(strings: TemplateStringsArray, ...keys: any[]) {
    const out = [];
    for (let i = 0, ii = strings.length; i < ii; i++) {
        out.push(strings[i]);
        // if we have a variables for it, we need to bind it.
        const ithKey = keys[i];
        if (ithKey !== undefined) {
            if(typeof ithKey === 'object'){
                for(let key in ithKey){
                    out.push(`${camelToLisp(key)}='${JSON.stringify(ithKey[key])}'`);
                }
            }else{
                out.push(ithKey);
            }
        }
    }
    return out.join('');
}

const ctlRe = /(?=[A-Z])/;
export function camelToLisp(s: string) {
    return s.split(ctlRe).join('-').toLowerCase();
}

export const doInitTransform = {
    cloneTemplate: {
        ifAllOf: ['mainTemplate'],
        ifKeyIn: ['noshadow', 'waitToInit']
    },
    doInitTransform: {
        ifAllOf: ['clonedTemplate'],
    }
}

export function substrBetween(str: string, start: string, end: string): string {
    const start_pos = str.indexOf(start);
    if(start_pos === -1) return '';
    const iPos = str.indexOf(end, start_pos + start.length);
    return iPos === -1 ? str.substring(start_pos + start.length) :  str.substring(start_pos + start.length, iPos);
}

export function define(html: string, encodeAndWrite: (html: string) => void, dependencies: string[] = []){
    const js = 
`import('be-definitive/be-definitive.js');
import('be-active/be-active.js');
${dependencies.map(d => `import('${d}');`).join('\n')}
document.body.insertAdjacentHTML('beforeend', \`${html}\`);`;
    encodeAndWrite(js);
}