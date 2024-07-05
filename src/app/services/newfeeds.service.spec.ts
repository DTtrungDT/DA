import { TestBed } from '@angular/core/testing';

import { NewsFeedService } from './newfeeds.service';

describe('NewfeedsService', () => {
  let service: NewsFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
