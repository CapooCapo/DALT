import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QlPageProductComponent } from './ql-page-product.component';

describe('QlPageProductComponent', () => {
  let component: QlPageProductComponent;
  let fixture: ComponentFixture<QlPageProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QlPageProductComponent]
    });
    fixture = TestBed.createComponent(QlPageProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
