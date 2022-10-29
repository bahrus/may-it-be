import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface EndUserProps{
    rules?: BeBasedRule[],
    recursive?: boolean,
    beVigilant?: boolean,
}

export interface VirtualProps extends EndUserProps, MinimalProxy{
    beDecorProps?: BeDecoratedProps,
}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy:  Proxy,
}

export type PP = ProxyProps;

export interface BeBasedRule {
    selector?: string,
    attr?: string,
    ifNot?: string,
    baseHref?: string,
}

export interface Actions{
    onRules(pp: PP): void;
    intro(proxy: Proxy, target: Element, beDecorProps: BeDecoratedProps): void;
}

