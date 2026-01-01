import { TestBed } from '@angular/core/testing';

import { EvtService } from '../services/evt.service';

describe('EvtService', () => {
  let service: EvtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
