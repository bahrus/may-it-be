
import { BaseScaffoldGenerator } from './BaseScaffold';


export type ssn = string | symbol | number;



export interface DefineArgs{
    innerHTML: string,
    //beDefinitiveProps: Definitive,
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
    //mayItBe?: MayItBe<HTMLFormElement, TProps, TEventHandlers>,
}

export interface IPresentationElement{
    name?: string,
    description?: string,
    inputType?: string,
    tagName?: string,
    innerHTML?: string,
    style?: Partial<CSSStyleDeclaration>,
    //mayItBe?: MayItBe,
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


