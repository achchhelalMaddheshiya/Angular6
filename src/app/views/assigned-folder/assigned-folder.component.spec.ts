import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedFolderComponent } from './assigned-folder.component';

describe('AssignedFolderComponent', () => {
  let component: AssignedFolderComponent;
  let fixture: ComponentFixture<AssignedFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
