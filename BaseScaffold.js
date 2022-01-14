import { html } from './html.js';
export { html } from './html.js';
export class BaseScaffoldGenerator {
    def;
    visualHints;
    static generateFrom(def, visualHints = {}) {
        return new BaseScaffoldGenerator(def, visualHints);
    }
    constructor(def, visualHints = {}) {
        this.def = def;
        this.visualHints = visualHints;
    }
    get html() {
        const categories = {
            Unclassified: [],
        };
        const propPresentationMap = this.visualHints.propPresentationMap;
        if (propPresentationMap !== undefined) {
            for (const propKey in this.visualHints.propPresentationMap) {
                const propPresentation = propPresentationMap[propKey];
                if (propPresentation.category === undefined) {
                    categories.Unclassified.push(propKey);
                }
                else {
                    if (categories[propPresentation.category] === undefined) {
                        categories[propPresentation.category] = [];
                    }
                    categories[propPresentation.category].push(propKey);
                }
            }
        }
        for (const propKey in this.def.config.propDefaults) {
            if (propPresentationMap === undefined || propPresentationMap[propKey] === undefined) {
                categories.Unclassified.push(propKey);
            }
        }
        return html `
<form>
${Object.keys(categories).map(category => {
            const categoryProps = categories[category];
            return html `
    <fieldset>
        <legend>${category}</legend>
        <table>
            ${categoryProps.map(propKey => this.renderProp(propKey))}
        </table>
        
    </fieldset>
    `;
        })}
</form>
<template be-active>
    <script id=be-noticed/be-noticed.js></script>
</template>
<be-hive></be-hive>
`;
    }
    renderProp(propKey) {
        const propPresentation = this.visualHints.propPresentationMap?.[propKey];
        const propDefault = this.def.config.propDefaults?.[propKey];
        const propInfo = this.def.config.propInfo?.[propKey];
        const isInput = !propPresentation?.tagName;
        let tagName = isInput ? 'input' : propPresentation?.tagName;
        if (isInput) {
            let type = 'text';
            let parseVal = 'string';
            let vtf = 'value';
            if (propPresentation?.inputType !== undefined) {
                type = propPresentation.inputType;
            }
            else {
                switch (propInfo?.type) {
                    case 'Boolean':
                        type = 'checkbox';
                        vtf = 'checked';
                        break;
                    case 'Number':
                        type = 'number';
                        parseVal = 'int';
                        break;
                    case 'Object':
                        tagName = 'xtal-editor';
                        break;
                    default:
                        switch (typeof propDefault) {
                            case 'boolean':
                                type = 'checkbox';
                                break;
                            case 'number':
                                type = 'number';
                                parseVal = 'int';
                                break;
                        }
                }
            }
            const value = propDefault;
            const label = propPresentation?.name ?? propKey;
            return html `
<tr part="field-container field-container-${propKey}" class="field-container field-container-${propKey}"> 
    <td>
        <label part="label label-${propKey}" class=label-${propKey} for=${propKey}>${label}:</label>
    </td>
    <td>
        <input id=${propKey} itemprop=${propKey} type=${type} value=${value} ${{
                beNoticed: {
                    input: { prop: propKey, vft: 'value', parseValAs: parseVal },
                }
            }}>
    </td>

</tr>
`;
        }
        else {
            throw 'NI';
        }
    }
}
