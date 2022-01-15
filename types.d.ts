import {BeActiveVirtualProps} from 'be-active/types';
import { BeDefinitiveVirtualProps } from 'be-definitive/types';
import {BeFerriedVirtualProps} from 'be-ferried/types';
import { BeIntersectionalVirtualProps } from 'be-intersectional/types';
import { BeMetamorphicVirtualProps } from 'be-metamorphic/types';
import { INotifyMap } from 'be-noticed/types'; 
import { IObserveMap } from 'be-observant/types';
import { BeSwitchedVirtualProps } from 'be-switched/types';
import { BeTransformativeVirtualProps } from 'be-transformative/types';
import { BeLoadedVirtualProps } from 'be-loaded/types';
export { BeDefinitiveVirtualProps} from 'be-definitive/types';
import { BaseScaffoldGenerator } from './BaseScaffold';

export type ssn = string | symbol | number;

export interface MayItBe<Self = any, Props = any, Actions = any>{
    beActive?: BeActiveVirtualProps,
    beDefinitive?: BeDefinitiveVirtualProps<Props, Actions>,
    beFerried?: BeFerriedVirtualProps,
    beIntersectional?: BeIntersectionalVirtualProps,
    beLoaded?: BeLoadedVirtualProps,
    beNoticed?: INotifyMap<Self, Props, Actions>,
    beObservant?: IObserveMap<Self, Props, Actions>,
    beSwitched?: BeSwitchedVirtualProps,
    beTransformative?: any,
    
}

export interface DefineArgs{
    innerHTML: string,
    beDefinitiveProps: BeDefinitiveVirtualProps,
    encodeAndWrite: (html: string) => void,
    mode: '-js' | '-html' | '-dfn',
    bundled?: boolean,
    dependencies?: string[],
    scaffoldGenerator?: BaseScaffoldGenerator,
}

export interface VisualHints<TProps = any, TEventHandlers = TProps>{
    propPresentationMap?: Partial<{[key in keyof TProps]: PropPresentation}>,
    triggerPresentationMap?: Partial<{[key in keyof TEventHandlers]: EventTriggerPresentation}>,
    fieldSets?: {[key: ssn]: ((keyof TProps) | (keyof TEventHandlers))[]},
}

export interface IPresentationElement{
    name?: string,
    description?: string,
    inputType?: string,
    tagName?: string,
    ssrPath?: string,
}

export interface PropPresentation extends IPresentationElement{
    readOnly?: boolean,
    editor?: any,
}

export interface EventTriggerPresentation extends IPresentationElement{
    name: string,
    description: string,
    category: string
}