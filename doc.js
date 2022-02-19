import { camelToLisp } from './camelToLisp.js';
import { resolve } from "path";
import * as TJS from "typescript-json-schema";
export class CustomElementManifestGenerator {
    type;
    encodeAndWrite;
    #wcInfo;
    constructor(type, encodeAndWrite) {
        this.type = type;
        this.encodeAndWrite = encodeAndWrite;
        // optionally pass argument to schema generator
        const settings = {
            required: true,
        };
        // optionally pass ts compiler options
        const compilerOptions = {
            strictNullChecks: true,
        };
        // optionally pass a base path
        const basePath = "./";
        const program = TJS.getProgramFromFiles([resolve("types.d.ts")], compilerOptions, basePath);
        this.#wcInfo = TJS.generateSchema(program, this.type, settings);
        // if(schema === undefined || !schema.trim().endsWith('}')){
        //     console.log("Incomplete JSON - likely due to build in progress");
        //     return;
        // }
        // this.#wcInfo = JSON.parse(schema) as SchemaFile;
        this.generatePackage();
    }
    generatePackage() {
        const modules = [];
        const pkg = {
            schemaVersion: '1.0.0',
            readme: '',
            modules,
        };
        this.generateModules(modules);
        this.encodeAndWrite(JSON.stringify(pkg, null, 2));
    }
    getStringVal(enm) {
        if (enm === undefined)
            return '';
        if (enm.length === 0)
            return '';
        const firstE = enm[0];
        return firstE;
    }
    generateModules(modules) {
        const { definitions } = this.#wcInfo;
        if (definitions === undefined)
            return;
        for (const def in definitions) {
            const definition = definitions[def];
            const { properties } = definition;
            if (properties === undefined)
                continue;
            const { tagName, src } = properties;
            if (tagName === undefined)
                continue;
            const enm = tagName.enum;
            const name = this.getStringVal(enm);
            let path = '';
            if (src !== undefined) {
                const srcEnm = src.enum;
                path = this.getStringVal(srcEnm);
            }
            if (name === '')
                continue;
            const declarations = [];
            const module = {
                kind: 'javascript-module',
                path,
                declarations: declarations,
            };
            this.generateDeclarations(def, name, properties, declarations);
            modules.push(module);
        }
    }
    generateDeclarations(name, tagName, properties, declarations) {
        const { props, methods, nonAttribProps } = properties;
        const members = [];
        const attributes = [];
        const attribExclusions = [];
        if (nonAttribProps !== undefined) {
            const { items } = nonAttribProps;
            if (items !== undefined) {
                for (const item of items) {
                    const enm = item.enum;
                    if (enm !== undefined) {
                        attribExclusions.concat(enm);
                    }
                }
            }
        }
        if (props !== undefined) {
            //props
            const { $ref } = props;
            if ($ref !== undefined) {
                const split = $ref.split('/');
                let ctx = this.#wcInfo;
                let first = true;
                for (const s of split) {
                    if (first) {
                        first = false;
                        continue;
                    }
                    ctx = ctx[s];
                }
                const propsDef = ctx;
                if (propsDef === undefined)
                    return;
                const props = propsDef.properties;
                if (props !== undefined) {
                    for (const prop in props) {
                        const { type, description } = props[prop];
                        const member = {
                            kind: 'field',
                            name: prop,
                            description,
                        };
                        members.push(member);
                        if (!attribExclusions.includes(prop)) {
                            const attrib = {
                                name: camelToLisp(prop),
                                description,
                            };
                            attributes.push(attrib);
                        }
                    }
                }
            }
        }
        if (methods !== undefined) {
            //methods
            const { $ref } = methods;
            if ($ref !== undefined) {
                const split = $ref.split('/');
                let ctx = this.#wcInfo;
                let first = true;
                for (const s of split) {
                    if (first) {
                        first = false;
                        continue;
                    }
                    ctx = ctx[s];
                }
                const methodsDef = ctx;
                if (methodsDef === undefined)
                    return;
                const methods = methodsDef.properties;
                if (methods !== undefined) {
                    for (const method in methods) {
                        const { type, description } = methods[method];
                        const member = {
                            kind: 'method',
                            name: method,
                            description,
                        };
                        members.push(member);
                    }
                }
            }
        }
        const newDeclaration = {
            tagName,
            name,
            customElement: true,
            members,
            attributes,
        };
        declarations.push(newDeclaration);
    }
}
