import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvtCreateComponent } from './evt-create.component';

describe('EvtCreateComponent', () => {
  let component: EvtCreateComponent;
  let fixture: ComponentFixture<EvtCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvtCreateComponent]
    });
    fixture = TestBed.createComponent(EvtCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
