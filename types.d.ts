import {BeActiveVirtualProps} from 'be-active/types';
import {BeFerriedVirtualProps} from 'be-ferried/types';
import { BeIntersectionalVirtualProps } from 'be-intersectional/types';
import { BeMetamorphicVirtualProps } from 'be-metamorphic/types';
import { INotifyMap } from 'be-noticed/types'; 

export interface MayItBe<Self, Props, Actions>{
    beActive: BeActiveVirtualProps,
    beFerried: BeFerriedVirtualProps,
    beIntersectional: INotifyMap<Self, Props, Actions>,
    beNoticed: INotifyMap<Self, Props, Actions>,
}