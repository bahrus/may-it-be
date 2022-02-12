import {JSONSchema6, } from 'json-schema/index';
import {Package, Module, CustomElementDeclaration} from 'node_modules/custom-elements-manifest/schema';

export class CustomElementManifestGenerator{
    #wcInfo: JSONSchema6;
    constructor(public schema: string, public encodeAndWrite: (s: string) => void){
        this.#wcInfo = JSON.parse(schema) as JSONSchema6;
        this.generatePackage();
    }

    generatePackage(){
        const modules: Module[] = [];
        const pkg: Package = {
            schemaVersion: '1.0.0',
            readme: '',
            modules,
        }
        this.generateModules(modules);
        this.encodeAndWrite(JSON.stringify(pkg, null, 2));
    }
    
    generateModules(modules: Module[]){
        const {definitions} = this.#wcInfo;
        if(definitions === undefined) return;
        for(const def in definitions){
            const definition = definitions[def] as JSONSchema6;
            const {properties} = definition;
            if(properties === undefined) continue;
            const {tagName} = properties as {tagName: JSONSchema6};
            if(tagName === undefined) continue;
            const {type} = tagName;
            const e = tagName.enum;
            if(e === undefined || type === 'string' || e.length === 0) continue;
            const firstE = e[0] as string;
            const module: CustomElementDeclaration = {
                name: firstE,
                kind: 'class',
            };
            modules.push(module as any as Module);
        }
    }
}