import { camelToLisp } from './camelToLisp.js';
import * as TJS from "typescript-json-schema";
export function getTypesInfo(path, config) {
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
    const program = TJS.getProgramFromFiles([path], compilerOptions, basePath);
    const schema = TJS.generateSchema(program, 'EndUserProps', settings);
    const name = config.name;
    const p = {
        schemaVersion: '1.0.0',
        readme: './README.md',
        modules: [{
                kind: 'javascript-module',
                path: 'index.js',
                declarations: [
                    {
                        tagName: name,
                        name: name,
                        kind: 'class',
                        members: [...generateProps(schema, config)]
                    } //as CustomElement
                ]
            }]
    };
    return {
        schema,
        package: p
    };
}
function generateProps(schemaFile, config) {
    const propMembers = [];
    const { propDefaults, propInfo } = config;
    const mergedPropInfo = { ...propInfo };
    const properties = schemaFile.properties;
    for (const key in propDefaults) {
        const val = propDefaults[key];
        let propInfoProp = mergedPropInfo[key];
        if (propInfoProp === undefined) {
            switch (typeof val) {
                case 'bigint':
                case 'boolean':
                case 'number':
                case 'string':
                    propInfoProp = {
                        attrName: camelToLisp(key),
                        parse: true,
                    };
                    break;
                default:
                    propInfoProp = {};
            }
        }
        propInfoProp.def = val;
        mergedPropInfo[key] = propInfoProp;
    }
    for (const key in mergedPropInfo) {
        const propInfo = mergedPropInfo[key];
        const { def } = propInfo;
        const typeDefProp = properties[key];
        const propMember = {
            kind: 'field',
            name: key,
            default: def,
            description: typeDefProp ? typeDefProp.description : ''
        };
        propMembers.push(propMember);
    }
    return propMembers;
}
