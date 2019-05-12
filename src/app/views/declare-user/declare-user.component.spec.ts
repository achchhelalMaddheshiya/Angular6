import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclareUserComponent } from './declare-user.component';

describe('DeclareUserComponent', () => {
  let component: DeclareUserComponent;
  let fixture: ComponentFixture<DeclareUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclareUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclareUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
