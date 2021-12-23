import {BeActiveVirtualProps} from 'be-active/types';
import {BeFerriedVirtualProps} from 'be-ferried/types';
import { BeIntersectionalVirtualProps } from 'be-intersectional/types';
import { BeMetamorphicVirtualProps } from 'be-metamorphic/types';
import { INotifyMap } from 'be-noticed/types'; 
import { IObserveMap } from 'be-observant/types';
import { BeSwitchedVirtualProps } from 'be-switched/types';
import { BeTransformativeVirtualProps } from 'be-transformative/types';
import { BeLoadedVirtualProps } from 'be-loaded/types';

export interface MayItBe<Self = any, Props = any, Actions = any>{
    beActive?: BeActiveVirtualProps,
    beFerried?: BeFerriedVirtualProps,
    beIntersectional?: INotifyMap<Self, Props, Actions>,
    beLoaded?: BeLoadedVirtualProps,
    beNoticed?: INotifyMap<Self, Props, Actions>,
    beObservant?: IObserveMap<Self, Props, Actions>,
    beSwitched?: BeSwitchedVirtualProps,
    beTransformative?: any,
}