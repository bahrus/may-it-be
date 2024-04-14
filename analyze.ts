import {camelToLisp} from './camelToLisp.js';

import * as TJS from "typescript-json-schema";
import { SchemaFile, SchemaProperty } from './schemaTypes.js';
import {OConfig} from 'trans-render/froop/types';
import {Package, CustomElement, CustomElementMixinDeclaration, PropertyLike, ClassMember, Attribute} from 'custom-elements-manifest';

export function analyze(path: string, config: OConfig){
    // optionally pass argument to schema generator
    const settings: TJS.PartialArgs = {
        required: true,
    };

    // optionally pass ts compiler options
    const compilerOptions: TJS.CompilerOptions = {
        strictNullChecks: true,
    };

    // optionally pass a base path
    const basePath = "./";

    const program = TJS.getProgramFromFiles(
        [path],
        compilerOptions,
        basePath
    );

    const schema = TJS.generateSchema(program, 'EndUserProps', settings) as SchemaFile;
    const propMembers: Array<PropertyLike & ClassMember> = [];
    const attributes: Array<Attribute> = [];
    generateProps(schema, config, propMembers, attributes);
    const name = config.name!;
    const p: Package = {
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
                    members: [...propMembers],
                    attributes
                } //as CustomElement
            ]
        }]
    } 
    return {
        schema,
        package: p
    }
}

function generateProps(
    schemaFile: SchemaFile, 
    config: OConfig,
    propMembers: Array<PropertyLike & ClassMember>,
    attrs: Array<Attribute>
){
    
    const {propDefaults, propInfo} = config;
    const mergedPropInfo = {...propInfo};
    const properties = (<any>schemaFile).properties as {[key: string]: SchemaProperty}
    for(const key in propDefaults){
        const val = propDefaults[key];
        let propInfoProp = mergedPropInfo[key]
        if(propInfoProp === undefined){
            switch(typeof val){
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
    for(const key in mergedPropInfo){
        const propInfo = mergedPropInfo[key];
        const {def} = propInfo!;
        const typeDefProp = properties[key];
        const propMember : PropertyLike & ClassMember = {
            kind: 'field',
            name: key,
            default: def,
            description: typeDefProp ? typeDefProp.description : ''
        };
        propMembers.push(propMember);
        if(propInfo?.parse && propInfo.attrName){
            attrs.push({
                name: propInfo.attrName,
                description: typeDefProp ? typeDefProp.description : ''
            });
        }
    }
}