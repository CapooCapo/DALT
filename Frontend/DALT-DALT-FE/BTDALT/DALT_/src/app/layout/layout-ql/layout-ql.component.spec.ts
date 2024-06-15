import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutQlComponent } from './layout-ql.component';

describe('LayoutQlComponent', () => {
  let component: LayoutQlComponent;
  let fixture: ComponentFixture<LayoutQlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutQlComponent]
    });
    fixture = TestBed.createComponent(LayoutQlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
