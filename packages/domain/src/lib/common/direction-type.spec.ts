import { DirectionType } from './direction-type';

describe('DirectionType', () => {
  it('should have correct enum values', () => {
    expect(DirectionType.Inbound).toBe('Inbound');
    expect(DirectionType.Outbound).toBe('Outbound');
  });
});
