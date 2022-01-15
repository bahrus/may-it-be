import {BeDefinitiveVirtualProps, VisualHints, MayItBe as mib, ssn} from './types';
import {html} from './html.js';
export {html} from './html.js';
export {VisualHints, ssn} from './types';

export class BaseScaffoldGenerator{
    static generateFrom(def: BeDefinitiveVirtualProps, visualHints: VisualHints = {}){
        return new BaseScaffoldGenerator(def, visualHints);
    }
    constructor(public def: BeDefinitiveVirtualProps, public visualHints: VisualHints = {}){}

    get html(){
        const {fieldSets} = this.visualHints;
        const categories: {[key: ssn]: ssn[]} = {
            ...fieldSets
        };
        const classifiedProps = new Set<string>();
        if(fieldSets !== undefined){
            for(const val of Object.values(fieldSets)){
                for(const prop of val){
                    classifiedProps.add(prop as string);
                }
            }
        }
        const unclassifiedProps = new Set<string>();
        //const propPresentationMap = this.visualHints.propPresentationMap;
        for(const propKey in this.def.config.propDefaults){
            if(!classifiedProps.has(propKey)){
                unclassifiedProps.add(propKey);
            }
        }

        categories.Unclassified = [...unclassifiedProps];
        return html`
<form>
${Object.keys(categories).map(category => {
    const categoryProps = categories[category];
    return html`
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

    renderProp(propKey: ssn){
        const propPresentation = this.visualHints.propPresentationMap?.[propKey as string];
        const propDefault = this.def.config.propDefaults?.[propKey as string];
        const propInfo = this.def.config.propInfo?.[propKey as string];
        const isInput = !propPresentation?.tagName;
        let tagName = isInput ? 'input' : propPresentation?.tagName;
        if(isInput){
            let type = 'text';
            let parseVal: 'int' | 'float' | 'bool' | 'date' | 'truthy' | 'falsy' | undefined | 'string' | 'object' = 'string';
            let vft = 'value';
            if(propPresentation?.inputType !== undefined){
                type = propPresentation.inputType;
            }else{
                switch(propInfo?.type){
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
                        switch(typeof propDefault){
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

            return html`
<tr part="field-container field-container-${propKey}" class="field-container field-container-${propKey}"> 
    <td>
        <label part="label label-${propKey}" class=label-${propKey} for=${propKey}>${label}:</label>
    </td>
    <td>
        <input id=${propKey} itemprop=${propKey} type=${type} value=${value} ${{
            beNoticed: {
                input: {prop: propKey, vft, parseValAs: parseVal},
            }
        } as mib}>
    </td>

</tr>
`;
        }else{
            throw 'NI';
        }

    }
}