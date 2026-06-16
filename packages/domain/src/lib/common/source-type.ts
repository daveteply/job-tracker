/**
 * SOURCE TYPE SEED IDs
 * These are used to map systemic source types across the application.
 */
export const SYSTEM_SOURCE_EMAIL_ID = 'system_source_email';
export const SYSTEM_SOURCE_LINKEDIN_ID = 'system_source_linkedin';
export const SYSTEM_SOURCE_WEBSITE_ID = 'system_source_website';
export const SYSTEM_SOURCE_RECRUITER_ID = 'system_source_recruiter';
export const SYSTEM_SOURCE_REFERRAL_ID = 'system_source_referral';
export const SYSTEM_SOURCE_INDEED_ID = 'system_source_indeed';
export const SYSTEM_SOURCE_GLASSDOOR_ID = 'system_source_glassdoor';

/**
 * @deprecated Use dynamic SourceType collection and SYSTEM_SOURCE_*_ID constants instead.
 */
export enum SourceType {
  Email = 'Email',
  LinkedIn = 'LinkedIn',
  Website = 'Website',
  Recruiter = 'Recruiter',
  Referral = 'Referral',
}
