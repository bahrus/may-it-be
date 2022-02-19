export interface SimpleWCInfo<TProps = any, TPublicMethods = any>{
    tagName: string;
    cssParts?: {[key: string]: string};
    props?: any;
    methods?: any;
    nonAttribProps?: (keyof TProps)[];
    cssProps?: {[key: string]: string};
}