import { html } from './html.js';
export { html } from './html.js';
export const doInitTransform = {
    cloneTemplate: {
        ifAllOf: ['mainTemplate'],
        ifKeyIn: ['noshadow', 'waitToInit']
    },
    doInitTransform: {
        ifAllOf: ['clonedTemplate'],
    }
};
export function substrBetween(str, start, end) {
    const start_pos = str.indexOf(start);
    if (start_pos === -1)
        return '';
    const iPos = str.indexOf(end, start_pos + start.length);
    return iPos === -1 ? str.substring(start_pos + start.length) : str.substring(start_pos + start.length, iPos);
}
export function define({ innerHTML, encodeAndWrite, mode, dependencies, beDefinitiveProps }) {
    if (dependencies === undefined)
        dependencies = [];
    switch (mode) {
        case '-js':
            {
                const mainTemplate = html `<template ${{
                    beDefinitive: beDefinitiveProps
                }}>${innerHTML}</template>`;
                const js = `import('be-definitive/be-definitive.js');
import('be-active/be-active.js');
${dependencies.map(d => `import('${d}');`).join('\n')}
document.body.insertAdjacentHTML('beforeend', \`${mainTemplate}\`);`;
                encodeAndWrite(js);
            }
            break;
        case '-html':
            {
                let scriptRef = '';
                let beExportable = '';
                if (beDefinitiveProps.scriptPath !== undefined) {
                    beExportable = html `
<script id="be-exportable/be-exportable.js"></script>`;
                    if (beDefinitiveProps.scriptRef === undefined)
                        beDefinitiveProps.scriptRef = 'a_' + (new Date()).valueOf();
                    scriptRef = html `<script id=${beDefinitiveProps.scriptRef} nomodule be-exportable src="${beDefinitiveProps.scriptPath}"></script>`;
                }
                const h = html `
<${beDefinitiveProps.config.tagName} t-a-i-l-b ${{
                    beDefinitive: beDefinitiveProps
                }}>
    <!---->
    <template shadowroot="open">
        <template be-active>
            <script id="be-definitive/be-definitive.js"></script>${beExportable}
            ${dependencies.map(d => html `<script id="${d}"></script>`).join('\n')}
        </template>
        ${innerHTML}
    </template>
    ${scriptRef}
</${beDefinitiveProps.config.tagName}>
<script type=module>
    if(customElements.get('be-active') === undefined){
        import('be-active/be-active.js').catch(err => {
            import('https://esm.run/be-active/be-active.js');
        });
    }
</script>
`;
                encodeAndWrite(h);
            }
            break;
        case '-dfn':
            {
                encodeAndWrite(JSON.stringify(beDefinitiveProps));
            }
            break;
    }
}
