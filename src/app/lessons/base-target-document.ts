import { BaseDocument } from './base-document';

export interface BaseTargetDocument extends BaseDocument {

    units: string[],
    targets: BaseTargetDocument[]
    
}