import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFamilyMembersComponent } from './edit-family-members.component';

describe('EditFamilyMembersComponent', () => {
  let component: EditFamilyMembersComponent;
  let fixture: ComponentFixture<EditFamilyMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFamilyMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFamilyMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
