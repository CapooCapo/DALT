import { TestBed } from '@angular/core/testing';

import { BarkeyApiService } from './barkey-api.service';

describe('BarkeyApiService', () => {
  let service: BarkeyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarkeyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
