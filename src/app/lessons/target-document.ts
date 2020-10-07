import { BaseDocument } from './base-document';

export interface TargetDocument extends BaseDocument {
    select: {},
    markers: any[],
    convention: string
}