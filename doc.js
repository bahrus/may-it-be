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
            if (name === '')
                continue;
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
        const { $ref } = props;
        const members = [];
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
            if (props === undefined)
                return;
            for (const prop in props) {
                const { type, description } = props[prop];
                const member = {
                    kind: 'field',
                    name: prop,
                    description,
                };
                members.push(member);
            }
        }
        const newDeclaration = {
            tagName,
            name,
            customElement: true,
            members,
        };
        declarations.push(newDeclaration);
    }
}
