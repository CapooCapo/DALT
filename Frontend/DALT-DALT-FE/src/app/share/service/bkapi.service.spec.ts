import { TestBed } from '@angular/core/testing';

import { BkapiService } from './bkapi.service';

describe('BkapiService', () => {
  let service: BkapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BkapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
