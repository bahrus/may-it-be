import {BeDefinitiveVirtualProps, VisualHints, MayItBe as mib} from './types';
import {html} from './html.js';
export {html} from './html.js';
export {VisualHints} from './types';

export class BaseScaffoldGenerator{
    static generateFrom(def: BeDefinitiveVirtualProps, visualHints: VisualHints = {}){
        return new BaseScaffoldGenerator(def, visualHints);
    }
    constructor(public def: BeDefinitiveVirtualProps, public visualHints: VisualHints = {}){}

    get html(){
        const categories: {[key: string]: string[]} = {
            Unclassified: [],
        };
        const propPresentationMap = this.visualHints.propPresentationMap;
        if(propPresentationMap !== undefined){
            for(const propKey in this.visualHints.propPresentationMap){
                const propPresentation = propPresentationMap[propKey]!;
                if(propPresentation.category === undefined){
                    categories.unclassified.push(propKey);
                }else{
                    if(categories[propPresentation.category] === undefined){
                        categories[propPresentation.category] = [];
                    }
                    categories[propPresentation.category].push(propKey);
                }
            }
        }
        for(const propKey in this.def.config.propDefaults){
            if(propPresentationMap === undefined || propPresentationMap[propKey] === undefined){
                categories.unclassified.push(propKey);
            }
        }
        return html`<form>
${Object.keys(categories).map(category => {
    const categoryProps = categories[category];
    return html`
    <fieldset>
        <legend>${category}</legend>
        ${categoryProps.map(propKey => this.renderProp(propKey))}
    </fieldset>
    `;
})}
</form>`;
    }

    renderProp(propKey: string){
        const propPresentation = this.visualHints.propPresentationMap?.[propKey];
        const propDefault = this.def.config.propDefaults?.[propKey];
        const propInfo = this.def.config.propInfo?.[propKey];
        const isInput = !propPresentation?.tagName;
        let tagName = isInput ? 'input' : propPresentation?.tagName;
        if(isInput){
            let type = 'text';
            if(propPresentation?.inputType !== undefined){
                type = propPresentation.inputType;
            }else{
                switch(propInfo?.type){
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
            
            const value = propDefault;
            const label = propPresentation?.name ?? propKey;

            return html`
<label part="label label-${propKey}" class=label-${propKey} for=${propKey}>${label}</label>
<input id=${propKey} itemprop=${propKey} type=${type} value=${value} ${{
        
    } as mib}>`;
        }else{
            throw 'NI';
        }

    }
}