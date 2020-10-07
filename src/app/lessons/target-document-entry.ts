import { GradeEditorComponent } from '../termsheets/gradeeditor/gradeeditor.component';
import { TargetDocumentSelector } from './target-document-selector';

export interface TargetDocumentEntry extends TargetDocumentSelector {

    value: string,
    tickets: {id: string, scope: string},
    timestamp: number

}