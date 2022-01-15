import { html } from './html.js';
import { camelToLisp } from './camelToLisp.js';
export { camelToLisp };
export { html };
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
        const { fieldSets } = this.visualHints;
        const categories = {
            ...fieldSets
        };
        const classifiedProps = new Set();
        if (fieldSets !== undefined) {
            for (const val of Object.values(fieldSets)) {
                for (const prop of val) {
                    classifiedProps.add(prop);
                }
            }
        }
        const unclassifiedProps = new Set();
        for (const propKey in this.def.config.propDefaults) {
            if (!classifiedProps.has(propKey)) {
                unclassifiedProps.add(propKey);
            }
        }
        const ppm = this.visualHints.propPresentationMap;
        if (ppm !== undefined) {
            for (const propKey in this.visualHints.propPresentationMap) {
                if (!classifiedProps.has(propKey)) {
                    unclassifiedProps.add(propKey);
                }
            }
        }
        if (unclassifiedProps.size > 0) {
            categories.Unclassified = [...unclassifiedProps];
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
    <script id=be-importing/be-importing.js></script>
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
            let vft = 'value';
            if (propPresentation?.inputType !== undefined) {
                type = propPresentation.inputType;
            }
            else {
                switch (propInfo?.type) {
                    case 'Boolean':
                        type = 'checkbox';
                        vft = 'checked';
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
                                vft = 'checked';
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
        ${isInput ? html `
            <input ${this.renderStyle(propPresentation)} id=${propKey} itemprop=${propKey} type=${type} value=${value} ${{
                beNoticed: {
                    input: { prop: propKey, vft, parseValAs: parseVal },
                }
            }}>` : this.renderCEProp(propKey, propPresentation)}
        }
    </td>

</tr>
`;
        }
        else {
            return this.renderCEProp(propKey, propPresentation);
        }
    }
    renderStyle(propPresentation) {
        if (propPresentation === undefined) {
            return '';
        }
        const { style } = propPresentation;
        if (style === undefined) {
            return '';
        }
        const styleTokens = [];
        for (const key in style) {
            styleTokens.push(`${camelToLisp(key)}: ${style[key]}`);
        }
        return ` style="${styleTokens.join(';')}"`;
    }
    renderCEProp(propKey, propPresentation) {
        //TODO:  distinguish between form associated custom elements (with label support?)
        const { ssrPath } = propPresentation;
        const ssr = ssrPath ? `be-importing=${ssrPath}` : '';
        return html `
        <${propPresentation.tagName} ${this.renderStyle(propPresentation)}  id=${propKey}  ${ssr} itemprop=${propKey}></${propPresentation.tagName}>
`;
    }
}
