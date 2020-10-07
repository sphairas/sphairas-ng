import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeEditorComponent } from './gradeeditor.component';

describe('GradeEditorComponent', () => {
  let component: GradeEditorComponent;
  let fixture: ComponentFixture<GradeEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradeEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
