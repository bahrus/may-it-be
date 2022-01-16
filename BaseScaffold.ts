import {BeDefinitiveVirtualProps, VisualHints, MayItBe as mib, ssn, PropPresentation} from './types';
import { IObserveMap } from 'be-observant/types';
import {html} from './html.js';
import { camelToLisp } from './camelToLisp.js';
export { camelToLisp };
export {html};
export {VisualHints, ssn};

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
        for(const propKey in this.def.config.propDefaults){
            if(!classifiedProps.has(propKey)){
                unclassifiedProps.add(propKey);
            }
        }
        const ppm = this.visualHints.propPresentationMap;
        if(ppm !== undefined){
            for(const propKey in this.visualHints.propPresentationMap){
                if(!classifiedProps.has(propKey)){
                    unclassifiedProps.add(propKey);
                }
            }
        }
        if(unclassifiedProps.size > 0){
            categories.Unclassified = [...unclassifiedProps];
        }
        return html`
<style>
    :host{
        display: block;
    }
</style>
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
    <script data-version=latest id=be-noticed/be-noticed.js></script>
    <script data-version=latest id=be-importing/be-importing.js></script>
    <script data-version=latest id=be-observant/be-observant.js></script>
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
        let type = 'text';
        let parseVal: 'int' | 'float' | 'bool' | 'date' | 'truthy' | 'falsy' | undefined | 'string' | 'object' = 'string';
        let vft = 'value';
        let beObservant : IObserveMap<Partial<HTMLInputElement>> | undefined = undefined;
        if(isInput){
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
            switch(type){
                case 'checkbox':
                    beObservant = {
                        checked: '.' + (propKey as string),
                    }
                    break;
                case 'text':
                case 'number':
                    beObservant = {
                        value: '.' + (propKey as string),
                    }
                    break;
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
        ${isInput ? html`
            <input ${this.renderStyle(propPresentation)} id=${propKey} itemprop=${propKey} type=${type} value=${value} ${{
                beNoticed: {
                    input: {prop: propKey, vft, parseValAs: parseVal},
                },
                beObservant
            } as mib} ${this.renderMayItBe(propPresentation)}>` : this.renderCEProp(propKey, propPresentation)
        }
    </td>
</tr>
`;

    }

    renderMayItBe(propPresentation: PropPresentation | undefined){
        if(propPresentation === undefined){
            return '';
        }
        const {mayItBe} = propPresentation;
        if(mayItBe === undefined){
            return '';
        }
        const mayItBeTokens: string[] = [];
        for(const key in mayItBe){
            const val = (<any>mayItBe)[key];
            mayItBeTokens.push(` ${camelToLisp(key)}='${JSON.stringify(val)}'`);
        }
        return mayItBeTokens.join('');
    }

    renderStyle(propPresentation:  PropPresentation | undefined){
        if(propPresentation === undefined){
            return '';
        }
        const {style} = propPresentation;
        if(style === undefined){
            return '';
        }
        const styleTokens: string[] = [];
        for(const key in style){
            styleTokens.push(`${camelToLisp(key)}: ${style[key]}`);
        }
        return ` style="${styleTokens.join(';')}"` ;
    }

    renderCEProp(propKey: ssn, propPresentation: PropPresentation){
        //TODO:  distinguish between form associated custom elements (with label support?)
        const {ssrPath} = propPresentation;
        const ssr = ssrPath ? `be-importing=${ssrPath}` : '';
        return html`
        <${propPresentation.tagName} ${this.renderStyle(propPresentation)} ${this.renderMayItBe(propPresentation)}  id=${propKey}  ${ssr} itemprop=${propKey}></${propPresentation.tagName}>
`; 
    }
}