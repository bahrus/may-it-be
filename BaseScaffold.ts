import {BeDefinitiveVirtualProps, VisualHints, MayItBe as mib, ssn, PropPresentation, ActionPresentation, MemberPresentation} from './types';
import { IObserveMap } from 'be-observant/types';
import {html} from './html.js';
import { camelToLisp } from './camelToLisp.js';
import { camelToLabel } from './camelToLabel.js';
import { INotifyMap } from '../be-noticed/types';
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
        // if(unclassifiedMembers.size > 0){
        //     categories.Unclassified = [...unclassifiedMembers];
        // }
        return html`
${this.style}
<form ${this.visualHints.mayItBe}>
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
${Array.from(unclassifiedMembers).map(memberKey => this.renderMember(memberKey))}
</form>
<template be-active>
    <script data-version=0.0.49 id=be-loaded/be-loaded.js data-when=be-importing ></script>
    <script data-version=0.0.99 id=be-observant/be-observant.js data-when=be-loaded ></script>
    <script data-version=0.0.55 id=be-noticed/be-noticed.js data-when=be-observant ></script>
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
        const actionPresentation = this.visualHints.actionPresentationMap?.[memberKey as string];
        if(actionPresentation !== undefined){
            return this.renderAction(memberKey, actionPresentation);
        }else{
            return this.renderProp(memberKey);
        }
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
        const label = propPresentation?.name ?? camelToLabel(propKey.toString());

        return html`
<tr part="field-container field-container-${propKey}" class="field-container field-container-${propKey}"> 
    ${isInput ? html`
        <td>
            <label part="label label-${propKey}" class=label-${propKey} for=${propKey}>${label}:</label>
        </td>
        <td>

            <input ${this.renderValidation(propPresentation)} ${this.renderStyle(propPresentation)} id=${propKey} itemprop=${propKey} type=${type} value="${value}" ${{
                beNoticed: {
                    input: {prop: propKey, vft, parseValAs: parseVal},
                },
                beObservant
            } as mib} ${this.renderMayItBe(propPresentation)}>
            
        </td>
    ` : html`
        <td colspan=2>
            <fieldset>
                <legend>${label}</legend>
                ${this.renderCEProp(propKey, propPresentation)}
            </fieldset>
        </td>
    `}
</tr>
`;

    }

    renderMayItBe(propPresentation: MemberPresentation | undefined){
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
        return html`<${propPresentation.tagName} ${this.renderStyle(propPresentation)} ${this.renderMayItBe(propPresentation)}  id=${propKey} itemprop=${propKey}>${propPresentation.innerHTML}</${propPresentation.tagName}>`; 
    }

    renderValidation(propPresentation: PropPresentation | undefined){
        if(propPresentation === undefined){
            return '';
        }
        const {max, min} = propPresentation;
        const attrs: string[] = [];
        if(max !== undefined){
            attrs.push(`max='${max}'`);
        }
        if(min !== undefined){
            attrs.push(`min='${min}'`);
        }
        return attrs.join(' ');
    }

    renderAction(actionKey: ssn, actionPresentation: ActionPresentation){
        const {name, mayItBe} = actionPresentation;
        const beNoticed = mayItBe?.beNoticed || {
            click: {fn: actionKey},
        } as INotifyMap;
        const mayItBeExt = {...mayItBe, beNoticed};
        const actionPresentationExt = {...actionPresentation, mayItBe: mayItBeExt}; 
        return html`
        <tr part="action-container action-container-${actionKey}" class="action-container action-container-${actionKey}">
            <td colspan=2>
                <button type=button ${this.renderMayItBe(actionPresentationExt)}}>${name || actionKey}</button>
            </td>
        </tr>`;    
    }
}