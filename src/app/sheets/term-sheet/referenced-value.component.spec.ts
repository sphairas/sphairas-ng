import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencedValueComponent } from './referenced-value.component';

describe('ReferencedValueComponent', () => {
  let component: ReferencedValueComponent;
  let fixture: ComponentFixture<ReferencedValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencedValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencedValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
