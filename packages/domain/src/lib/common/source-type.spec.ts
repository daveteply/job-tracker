import {
  SYSTEM_SOURCE_EMAIL_ID,
  SYSTEM_SOURCE_GLASSDOOR_ID,
  SYSTEM_SOURCE_INDEED_ID,
  SYSTEM_SOURCE_LINKEDIN_ID,
  SYSTEM_SOURCE_RECRUITER_ID,
  SYSTEM_SOURCE_REFERRAL_ID,
  SYSTEM_SOURCE_WEBSITE_ID,
} from './source-type';

describe('Systemic Source IDs', () => {
  it('should have correct ID values', () => {
    expect(SYSTEM_SOURCE_EMAIL_ID).toBe('system_source_email');
    expect(SYSTEM_SOURCE_LINKEDIN_ID).toBe('system_source_linkedin');
    expect(SYSTEM_SOURCE_WEBSITE_ID).toBe('system_source_website');
    expect(SYSTEM_SOURCE_RECRUITER_ID).toBe('system_source_recruiter');
    expect(SYSTEM_SOURCE_REFERRAL_ID).toBe('system_source_referral');
    expect(SYSTEM_SOURCE_INDEED_ID).toBe('system_source_indeed');
    expect(SYSTEM_SOURCE_GLASSDOOR_ID).toBe('system_source_glassdoor');
  });
});
