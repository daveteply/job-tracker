import { DirectionType } from '@job-tracker/domain';

import { inferDirectionFromEventType } from './event-logic';

describe('inferDirectionFromEventType', () => {
  it('should infer Outbound for "Applied"', () => {
    expect(inferDirectionFromEventType('Applied')).toBe(DirectionType.Outbound);
  });

  it('should infer Inbound for "Email Received"', () => {
    expect(inferDirectionFromEventType('Email Received')).toBe(DirectionType.Inbound);
  });

  it('should infer Outbound for "Email Sent"', () => {
    expect(inferDirectionFromEventType('Email Sent')).toBe(DirectionType.Outbound);
  });

  it('should infer Inbound for "Recruiter Outreach"', () => {
    expect(inferDirectionFromEventType('Recruiter Outreach')).toBe(DirectionType.Inbound);
  });

  it('should infer Outbound for "Follow-up Sent"', () => {
    expect(inferDirectionFromEventType('Follow-up Sent')).toBe(DirectionType.Outbound);
  });

  it('should infer Inbound for "Offer Received"', () => {
    expect(inferDirectionFromEventType('Offer Received')).toBe(DirectionType.Inbound);
  });

  it('should infer Outbound for "Offer Accepted"', () => {
    expect(inferDirectionFromEventType('Offer Accepted')).toBe(DirectionType.Outbound);
  });

  it('should infer Inbound for "Not Selected"', () => {
    expect(inferDirectionFromEventType('Not Selected')).toBe(DirectionType.Inbound);
  });

  it('should infer Outbound for "Withdrew Application"', () => {
    expect(inferDirectionFromEventType('Withdrew Application')).toBe(DirectionType.Outbound);
  });

  it('should infer Inbound for interview types', () => {
    expect(inferDirectionFromEventType('Technical Interview')).toBe(DirectionType.Inbound);
    expect(inferDirectionFromEventType('Onsite Interview')).toBe(DirectionType.Inbound);
    expect(inferDirectionFromEventType('Screening Call')).toBe(DirectionType.Inbound);
  });

  it('should return null for unknown types', () => {
    expect(inferDirectionFromEventType('Some weird event')).toBeNull();
  });
});
