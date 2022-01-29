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
import { BeExportableVirtualProps} from 'be-exportable/types';
import { BeConsensualVirtualProps } from 'be-consensual/types';
import { BeLookingUpVirtualProps } from 'be-looking-up/types';
import { BeReformableVirtualProps } from 'be-reformable/types';
import { BeImportingVirtualProps } from 'be-importing/types';

export type ssn = string | symbol | number;

export interface MayItBe<Self = any, Props = any, Actions = any>{
    beActive?: BeActiveVirtualProps,
    beConsensual?: BeConsensualVirtualProps,
    beConsensualMember?: boolean,
    beDefinitive?: BeDefinitiveVirtualProps<Props, Actions>,
    beExportable?: BeExportableVirtualProps,
    beFerried?: BeFerriedVirtualProps,
    beImporting?: BeImportingVirtualProps,
    beIntersectional?: BeIntersectionalVirtualProps,
    beLoaded?: BeLoadedVirtualProps,
    beLookingUp?: BeLookingUpVirtualProps,
    beNoticed?: INotifyMap<Self, Props, Actions>,
    beObservant?: IObserveMap<Self, Props, Actions>,
    beReformable?: BeReformableVirtualProps & Partial<HTMLFormElement>,
    beSwitched?: BeSwitchedVirtualProps,
    beTransactional?: any,
    beTransformative?: any,
    
}

export interface DefineArgs{
    innerHTML: string,
    beDefinitiveProps: BeDefinitiveVirtualProps,
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