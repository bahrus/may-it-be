export interface SchemaFile{
    $schema: string;
    definitions: {[key: string]: SchemaDefinition};
}

export interface SchemaDefinition{
    properties: {[key: string]: SchemaProperty};
}

export interface SchemaProperty{
    $ref?: string;
    type?: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null' | 'any';
    enum?: string[];
}