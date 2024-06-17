import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutQLComponent } from './layout-ql.component';

describe('LayoutQLComponent', () => {
  let component: LayoutQLComponent;
  let fixture: ComponentFixture<LayoutQLComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutQLComponent]
    });
    fixture = TestBed.createComponent(LayoutQLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
