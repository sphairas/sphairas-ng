import { TargetDocumentEntry } from './target-document-entry';

export interface TargetDocumentSelector {

    id: string,
    type: string,
    label: string,
    entries: TargetDocumentEntry[],
    select: TargetDocumentSelector[]

}