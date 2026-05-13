import { SourceType } from './source-type';

describe('SourceType', () => {
  it('should have correct enum values', () => {
    expect(SourceType.Email).toBe('Email');
    expect(SourceType.LinkedIn).toBe('LinkedIn');
    expect(SourceType.Website).toBe('Website');
    expect(SourceType.Recruiter).toBe('Recruiter');
    expect(SourceType.Referral).toBe('Referral');
  });
});
