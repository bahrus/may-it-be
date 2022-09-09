import { EndUserProps as Active} from 'be-active/types';
import { EndUserProps as Definitive } from 'be-definitive/types';
import { EndUserProps as Ferried} from 'be-ferried/types';
import { INotifyMap } from 'be-noticed/types'; 
import { IObserveMap } from 'be-observant/types';
import { EndUserProps as Switched } from 'be-switched/types';
import { EndUserProps as Loaded } from 'be-loaded/types';
import { BaseScaffoldGenerator } from './BaseScaffold';
import { EndUserProps as Exportable} from 'be-exportable/types';
import { EndUserProps as Consensual } from 'be-consensual/types';
import { EndUserProps as LookingUp } from 'be-looking-up/types';
import { EndUserProps as Reformable } from 'be-reformable/types';
import { EndUserProps as Importing } from 'be-importing/types';
import { EndUserProps as Based } from 'be-based/types';
import { EndUserProps as Repeated } from 'be-repeated/types';
import { IChannel } from 'be-channeling/types';

export {Definitive as BeDefinitive}

export type ssn = string | symbol | number;

// May it be decorators that make sense when applied to a DOM Fragment.
export interface MayItBeTransformable<Self = any, Props = any, Actions = any> {
    beBased?: Based;
}

export interface MayItBe<Self = any, Props = any, Actions = any> extends MayItBeTransformable<Self, Props, Actions> {
    beActive?: Active,
    beChanneling?: IChannel[],
    beConsensual?: Consensual,
    beConsensualMember?: boolean,
    beDefinitive?: Definitive<Props, Actions>,
    beExportable?: Exportable,
    beFerried?: Ferried,
    beImporting?: Importing,
    beLoaded?: Loaded,
    beLookingUp?: LookingUp,
    beNoticed?: INotifyMap<Self, Props, Actions>,
    beObservant?: IObserveMap<Self, Props, Actions> | IObserveMap<Self, Props, Actions>[],
    beReformable?: Reformable & Partial<HTMLFormElement>,
    beRepeated?: Repeated,
    beSwitched?: Switched,
    beTransactional?: any,
    beTransformative?: any,
    
}

export interface DefineArgs{
    innerHTML: string,
    beDefinitiveProps: Definitive,
    encodeAndWrite: (html: string) => void,
    mode: '-js' | '-html' | '-dfn',
    bundled?: boolean,
    dependencies?: string[],
    globalStylePaths?: string[],
    scaffoldGenerator?: BaseScaffoldGenerator,
}

export interface VisualHints<TProps = any, TEventHandlers = TProps>{
    propPresentationMap?: Partial<{[key in keyof TProps]: PropPresentation}>,
    actionPresentationMap?: Partial<{[key in keyof TEventHandlers]: ActionPresentation}>,
    triggerPresentationMap?: Partial<{[key in keyof TEventHandlers]: EventTriggerPresentation}>,
    fieldSets?: {[key: ssn]: ((keyof TProps) | (keyof TEventHandlers))[]},
    stylePaths?: string[],
    mayItBe?: MayItBe<HTMLFormElement, TProps, TEventHandlers>,
}

export interface IPresentationElement{
    name?: string,
    description?: string,
    inputType?: string,
    tagName?: string,
    innerHTML?: string,
    style?: Partial<CSSStyleDeclaration>,
    mayItBe?: MayItBe,
    max?: number,
    min?: number,
}


export interface PropPresentation extends IPresentationElement{
    //readOnly?: boolean, [TODO]
    //editor?: any,
}

export interface ActionPresentation extends IPresentationElement{
}

export type MemberPresentation = PropPresentation | ActionPresentation;

export interface EventTriggerPresentation extends IPresentationElement{
    name: string,
    description: string,
    category: string
}


