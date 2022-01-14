import { html } from './html.js';
export { html } from './html.js';
export class BaseScaffoldGenerator {
    def;
    scaffold;
    constructor(def, scaffold) {
        this.def = def;
        this.scaffold = scaffold;
    }
    get html() {
        const categories = {
            unclassified: [],
        };
        const propPresentationMap = this.scaffold.propPresentationMap;
        if (propPresentationMap !== undefined) {
            for (const propKey in this.scaffold.propPresentationMap) {
                const propPresentation = propPresentationMap[propKey];
                if (propPresentation.category === undefined) {
                    categories.unclassified.push(propKey);
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
            if (propPresentationMap !== undefined && propPresentationMap[propKey] === undefined) {
                categories.unclassified.push(propKey);
            }
        }
        return html `<form>
${Object.keys(categories).map(category => {
            const categoryProps = categories[category];
            return html `
    <fieldset>
        <legend>${category}</legend>
        ${categoryProps.map(propKey => this.renderProp(propKey))}
    </fieldset>
    `;
        })}
</form>`;
    }
    renderProp(propKey) {
        const propPresentation = this.scaffold.propPresentationMap[propKey];
        const propDefault = this.def.config.propDefaults?.[propKey];
        const propInfo = this.def.config.propInfo?.[propKey];
        let tagName = propPresentation.tagName || 'input';
        let type = 'text';
        if (propPresentation.inputType !== undefined) {
            type = propPresentation.inputType;
        }
        else {
            switch (propInfo?.type) {
                case 'Boolean':
                    type = 'checkbox';
                    break;
                case 'Number':
                    type = 'number';
                    break;
                case 'Object':
                    tagName = 'xtal-editor';
                    break;
            }
        }
        let value = propDefault;
        return html `
        <input itemprop=${propKey} type=${type} ${{}}>
        `;
    }
}
