import {DefineArgs, Scaffold} from './types';
import {html} from './html';
export {html} from './html';

export class BaseScaffoldGenerator{
    constructor(public args: DefineArgs, public scaffold: Scaffold){
    
    }

    render(){
        const categories: {[key: string]: string[]} = {
            unclassified: [],
        };
        const props = this.scaffold.propPresentation;
        for(const propKey in this.scaffold.propPresentation){
            const prop = props[propKey];
            if(prop.category === undefined){
                categories.unclassified.push(propKey);
            }else{
                if(categories[prop.category] === undefined){
                    categories[prop.category] = [];
                }
                categories[prop.category].push(propKey);
            }
        }
        return html`<form>
${Object.keys(categories).map(category => {
    const categoryProps = categories[category];
    return html`
    <fieldset>
        <legend>${category}</legend>
        ${categoryProps.map(propKey => {
            const prop = props[propKey];
            return html`
            <input>
            `;
        })}
    </fieldset>
    `;
})}
</form>`;
    }
}