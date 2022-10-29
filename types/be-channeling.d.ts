import {INotify} from 'trans-render/lib/types';
import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface EndUserProps{
    channels: IChannel | IChannel[],
}
export interface VirtualProps extends EndUserProps, MinimalProxy{
    
}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface IChannel extends INotify{
    eventFilter: string | Partial<Event>,
    composedPathMatch: string;
}

export interface Actions{
    onChannels(pp: PP): Promise<void>;
    finale(proxy: Proxy, target:Element, beDecorProps: BeDecoratedProps): void;
}