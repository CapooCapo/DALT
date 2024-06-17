import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderQLComponent } from './header-ql.component';

describe('HeaderQLComponent', () => {
  let component: HeaderQLComponent;
  let fixture: ComponentFixture<HeaderQLComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderQLComponent]
    });
    fixture = TestBed.createComponent(HeaderQLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
