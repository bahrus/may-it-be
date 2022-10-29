import { EndUserProps as Active, EndUserProps} from './types/be-active';
import { EndUserProps as Definitive } from './types/be-definitive';
import { EndUserProps as Ferried} from './types/be-ferried';
import { INotifyMap } from './types/be-noticed'; 
import { EndUserProps as Observant } from './types/be-observant';
import { EndUserProps as Switched } from './types/be-switched';
import { EndUserProps as Loaded } from './types/be-loaded';
import { BaseScaffoldGenerator } from './BaseScaffold';
import { EndUserProps as Exportable} from './types/be-exportable';
import { EndUserProps as Consensual } from './types/be-consensual';
import { EndUserProps as LookingUp } from './types/be-looking-up';
import { EndUserProps as Reformable } from './types/be-reformable';
import { EndUserProps as Importing } from './types/be-importing';
import { EndUserProps as Based } from './types/be-based';
import { EndUserProps as Repeated } from './types/be-repeated';
import { IChannel } from './types/be-channeling';

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
    beObservant?: Observant<Self, Props, Actions> | Observant<Self, Props, Actions>[],
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


