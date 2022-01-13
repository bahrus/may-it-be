import {DefineArgs, Scaffold, MayItBe as mib} from './types';
import {html} from './html';
export {html} from './html';

export class BaseScaffoldGenerator{
    constructor(public args: DefineArgs, public scaffold: Scaffold){}

    render(){
        const categories: {[key: string]: string[]} = {
            unclassified: [],
        };
        const propPresentationMap = this.scaffold.propPresentationMap;
        for(const propKey in this.scaffold.propPresentationMap){
            const propPresentation = propPresentationMap[propKey];
            if(propPresentation.category === undefined){
                categories.unclassified.push(propKey);
            }else{
                if(categories[propPresentation.category] === undefined){
                    categories[propPresentation.category] = [];
                }
                categories[propPresentation.category].push(propKey);
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
        const propPresentation = this.scaffold.propPresentationMap[propKey];
        const propDefaults = this.args.beDefinitiveProps.config.propDefaults;
        const propDefault = propDefaults[propKey];
        const propInfo = this.args.beDefinitiveProps.config.propInfo[propKey];
        let tagName = propPresentation.tagName || 'input';
        let type = 'text';
        if(propPresentation.inputType !== undefined){
            type = propPresentation.inputType;
        }else{
            switch(propInfo.type){
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

        return html`
        <input itemprop=${propKey} type=${type} ${{

        } as mib}>
        `;
    }
}