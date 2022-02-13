import {SchemaFile, SchemaDefinition, SchemaProperty} from './schemaTypes';
import {Package, Module, CustomElementDeclaration, CustomElement, JavaScriptModule, Declaration} from 'node_modules/custom-elements-manifest/schema';

export class CustomElementManifestGenerator{
    #wcInfo: SchemaFile;
    constructor(public schema: string, public encodeAndWrite: (s: string) => void){
        this.#wcInfo = JSON.parse(schema) as SchemaFile;
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

    getStringVal(enm: string[] | undefined): string{
        if(enm === undefined) return '';
        if(enm.length === 0) return '';
        const firstE = enm[0] as string;
        return firstE;
    }
    
    generateModules(modules: Module[]){
        const {definitions} = this.#wcInfo;
        if(definitions === undefined) return;
        for(const def in definitions){
            const definition = definitions[def];
            const {properties} = definition;
            if(properties === undefined) continue;
            const {tagName} = properties;
            if(tagName === undefined) continue;
            const enm = tagName.enum;
            const name = this.getStringVal(enm);
        
            const declarations: CustomElement[] = [];
            const module: JavaScriptModule = {
                kind: 'javascript-module',
                path: 'tbd',
                declarations: declarations as Declaration[],
            };
            this.generateDeclarations(def, name, properties, declarations);
            modules.push(module as any as Module);
        }
    }

    generateDeclarations(name: string, tagName: string, properties: {[key: string]: SchemaProperty}, declarations: CustomElement[]){
        const {props, methods} = properties;
        const newDeclaration: CustomElement = {
            tagName,
            name,
            customElement: true,
        };
        declarations.push(newDeclaration);
    }
}