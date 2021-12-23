import {BeActiveVirtualProps} from 'be-active/types';
import {BeFerriedVirtualProps} from 'be-ferried/types';
import { BeIntersectionalVirtualProps } from 'be-intersectional/types';

export interface MayItBe<Self, Props, Actions>{
    beActive: BeActiveVirtualProps,
    beFerried: BeFerriedVirtualProps,
    beIntersectional: BeIntersectionalVirtualProps,
}