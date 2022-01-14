import { camelToLisp } from './camelToLisp.js';
export function html(strings, ...keys) {
    const out = [];
    for (let i = 0, ii = strings.length; i < ii; i++) {
        out.push(strings[i]);
        // if we have a variables for it, we need to bind it.
        const ithKey = keys[i];
        if (ithKey !== undefined) {
            if (typeof ithKey === 'object') {
                if (Array.isArray(ithKey)) {
                    for (const key of ithKey) {
                        out.push(ithKey[key]);
                    }
                }
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
