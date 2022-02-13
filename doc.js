export class CustomElementManifestGenerator {
    schema;
    encodeAndWrite;
    #wcInfo;
    constructor(schema, encodeAndWrite) {
        this.schema = schema;
        this.encodeAndWrite = encodeAndWrite;
        this.#wcInfo = JSON.parse(schema);
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
            const { tagName } = properties;
            if (tagName === undefined)
                continue;
            const enm = tagName.enum;
            const name = this.getStringVal(enm);
            const declarations = [];
            const module = {
                kind: 'javascript-module',
                path: 'tbd',
                declarations: declarations,
            };
            this.generateDeclarations(def, name, properties, declarations);
            modules.push(module);
        }
    }
    generateDeclarations(name, tagName, properties, declarations) {
        const { props, methods } = properties;
        const newDeclaration = {
            tagName,
            name,
            customElement: true,
        };
        declarations.push(newDeclaration);
    }
}
