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
            const { type } = tagName;
            const e = tagName.enum;
            if (e === undefined || type === 'string' || e.length === 0)
                continue;
            const firstE = e[0];
            const module = {
                name: firstE,
                kind: 'class',
            };
            modules.push(module);
        }
    }
}
