import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapRoleComponent } from './swap-role.component';

describe('SwapRoleComponent', () => {
  let component: SwapRoleComponent;
  let fixture: ComponentFixture<SwapRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwapRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwapRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
