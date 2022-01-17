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
    constructor(public def: BeDefinitiveVirtualProps, public visualHints: VisualHints = {
        stylePaths: []
    }){}

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
        const unclassifiedMembers = new Set<string>();
        for(const propKey in this.def.config.propDefaults){
            if(!classifiedProps.has(propKey)){
                unclassifiedMembers.add(propKey);
            }
        }
        const ppm = this.visualHints.propPresentationMap;
        if(ppm !== undefined){
            for(const propKey in ppm){
                if(!classifiedProps.has(propKey)){
                    unclassifiedMembers.add(propKey);
                }
            }
        }
        const apm = this.visualHints.actionPresentationMap;
        if(apm !== undefined){
            for(const actionKey in apm){
                if(!classifiedProps.has(actionKey)){
                    unclassifiedMembers.add(actionKey);
                }
            }
        }
        if(unclassifiedMembers.size > 0){
            categories.Unclassified = [...unclassifiedMembers];
        }
        return html`
${this.style}
<form>
${Object.keys(categories).map(category => {
    const categoryMembers = categories[category];
    return html`
    <fieldset>
        <legend>${category}</legend>
        <table>
            ${categoryMembers.map(memberKey => this.renderMember(memberKey))}
        </table>
        
    </fieldset>
    `;
})}
</form>
<template be-active>
    <script data-version=0.0.34 data-when=be-importing id=be-loaded/be-loaded.js></script>
    <script data-version=latest data-when=be-loaded id=be-observant/be-observant.js></script>
    <script data-version=latest data-when=be-observant id=be-noticed/be-noticed.js></script>
</template>
<be-hive></be-hive>
`;
    }

    get style(){
        const stylePaths = this?.visualHints?.stylePaths || [];
        return html`
<style>
    :host{
        display: block;
    }
</style>
${stylePaths.map(path => html`
<style ${{
    beLoaded: {
        removeStyle: true,
        preloadRef: path,
        fallback: path,
    }
} as mib}>
    form{
        pointer-events: none;
    }
</style>
`)}
        `;

    }

    renderMember(memberKey: ssn){
        const propPresentation = this.visualHints.propPresentationMap?.[memberKey as string];
        const propDefault = this.def.config.propDefaults?.[memberKey as string];
        const propInfo = this.def.config.propInfo?.[memberKey as string];
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
                        checked: '.' + (memberKey as string),
                    }
                    break;
                case 'text':
                case 'number':
                    beObservant = {
                        value: '.' + (memberKey as string),
                    }
                    break;
            }
            
        }
        
        const value = propDefault;
        const label = propPresentation?.name ?? memberKey;

        return html`
<tr part="field-container field-container-${memberKey}" class="field-container field-container-${memberKey}"> 
    ${isInput ? html`
        <td>
            <label part="label label-${memberKey}" class=label-${memberKey} for=${memberKey}>${label}:</label>
        </td>
        <td>

            <input ${this.renderStyle(propPresentation)} id=${memberKey} itemprop=${memberKey} type=${type} value=${value} ${{
                beNoticed: {
                    input: {prop: memberKey, vft, parseValAs: parseVal},
                },
                beObservant
            } as mib} ${this.renderMayItBe(propPresentation)}>
            
        </td>
    ` : html`
        <td colspan=2>
            <div><label part="label label-${memberKey}" class=label-${memberKey} for=${memberKey}>${label}:</label></div>
            ${this.renderCEProp(memberKey, propPresentation)}
        </td>
    `}
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