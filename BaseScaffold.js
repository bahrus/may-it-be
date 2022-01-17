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
    constructor(def, visualHints = {
        stylePaths: []
    }) {
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
${this.style}
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
    <script data-version=latest id=be-noticed/be-noticed.js></script>
    <script data-version=latest id=be-importing/be-importing.js></script>
    <script data-version=latest id=be-observant/be-observant.js></script>
    <script data-version=0.0.34 id=be-loaded/be-loaded.js></script>
</template>
<be-hive></be-hive>
`;
    }
    get style() {
        const stylePaths = this?.visualHints?.stylePaths || [];
        return html `
<style>
    :host{
        display: block;
    }
</style>
${stylePaths.map(path => html `
<style ${{
            beLoaded: {
                removeStyle: true,
                preloadRef: path,
                fallback: path,
            }
        }}>
    form{
        pointer-events: none;
    }
</style>
`)}
        `;
    }
    renderProp(propKey) {
        const propPresentation = this.visualHints.propPresentationMap?.[propKey];
        const propDefault = this.def.config.propDefaults?.[propKey];
        const propInfo = this.def.config.propInfo?.[propKey];
        const isInput = !propPresentation?.tagName;
        let tagName = isInput ? 'input' : propPresentation?.tagName;
        let type = 'text';
        let parseVal = 'string';
        let vft = 'value';
        let beObservant = undefined;
        if (isInput) {
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
            switch (type) {
                case 'checkbox':
                    beObservant = {
                        checked: '.' + propKey,
                    };
                    break;
                case 'text':
                case 'number':
                    beObservant = {
                        value: '.' + propKey,
                    };
                    break;
            }
        }
        const value = propDefault;
        const label = propPresentation?.name ?? propKey;
        return html `
<tr part="field-container field-container-${propKey}" class="field-container field-container-${propKey}"> 
    ${isInput ? html `
        <td>
            <label part="label label-${propKey}" class=label-${propKey} for=${propKey}>${label}:</label>
        </td>
        <td>

            <input ${this.renderStyle(propPresentation)} id=${propKey} itemprop=${propKey} type=${type} value=${value} ${{
            beNoticed: {
                input: { prop: propKey, vft, parseValAs: parseVal },
            },
            beObservant
        }} ${this.renderMayItBe(propPresentation)}>
            
        </td>
    ` : html `
        <td colspan=2>
            <div><label part="label label-${propKey}" class=label-${propKey} for=${propKey}>${label}:</label></div>
            ${this.renderCEProp(propKey, propPresentation)}
        </td>
    `}
</tr>
`;
    }
    renderMayItBe(propPresentation) {
        if (propPresentation === undefined) {
            return '';
        }
        const { mayItBe } = propPresentation;
        if (mayItBe === undefined) {
            return '';
        }
        const mayItBeTokens = [];
        for (const key in mayItBe) {
            const val = mayItBe[key];
            mayItBeTokens.push(` ${camelToLisp(key)}='${JSON.stringify(val)}'`);
        }
        return mayItBeTokens.join('');
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
        <${propPresentation.tagName} ${this.renderStyle(propPresentation)} ${this.renderMayItBe(propPresentation)}  id=${propKey}  ${ssr} itemprop=${propKey}></${propPresentation.tagName}>
`;
    }
}
