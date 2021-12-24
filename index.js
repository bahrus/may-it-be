export function html(strings, ...keys) {
    const out = [];
    for (let i = 0, ii = strings.length; i < ii; i++) {
        out.push(strings[i]);
        // if we have a variables for it, we need to bind it.
        const ithKey = keys[i];
        if (ithKey !== undefined) {
            if (typeof ithKey === 'object') {
                for (let key in ithKey) {
                    out.push(`${camelToLisp(key)}='${JSON.stringify(ithKey[key])}'`);
                }
            }
            else {
                out.push(ithKey);
            }
        }
    }
    return out.join('');
}
const ctlRe = /(?=[A-Z])/;
export function camelToLisp(s) {
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
};
export function substrBetween(str, start, end) {
    const start_pos = str.indexOf(start);
    if (start_pos === -1)
        return '';
    const iPos = str.indexOf(end, start_pos + start.length);
    return iPos === -1 ? str.substring(start_pos + start.length) : str.substring(start_pos + start.length, iPos);
}
