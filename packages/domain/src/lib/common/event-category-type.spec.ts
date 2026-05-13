import { EventCategoryType } from './event-category-type';

describe('EventCategoryType', () => {
  it('should have correct enum values', () => {
    expect(EventCategoryType.Application).toBe('Application');
    expect(EventCategoryType.Communication).toBe('Communication');
    expect(EventCategoryType.Interview).toBe('Interview');
    expect(EventCategoryType.Outcome).toBe('Outcome');
  });
});
