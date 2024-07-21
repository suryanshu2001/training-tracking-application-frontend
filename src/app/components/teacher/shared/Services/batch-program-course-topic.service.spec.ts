import { TestBed } from '@angular/core/testing';

import { BatchProgramCourseTopicService } from './batch-program-course-topic.service';

describe('BatchProgramCourseTopicService', () => {
  let service: BatchProgramCourseTopicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchProgramCourseTopicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
