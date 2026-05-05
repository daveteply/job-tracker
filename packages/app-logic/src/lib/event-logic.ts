import { DirectionType } from '@job-tracker/domain';

export function inferDirectionFromEventType(name: string): DirectionType | null {
  const n = name.toLowerCase();

  // Outbound markers
  if (
    n.includes('applied') ||
    n.includes('sent') ||
    n.includes('accepted') ||
    n.includes('withdrew') ||
    n.includes('outbound')
  ) {
    return DirectionType.Outbound;
  }

  // Inbound markers
  if (
    n.includes('received') ||
    n.includes('outreach') ||
    n.includes('viewed') ||
    n.includes('scheduled') ||
    n.includes('not selected') ||
    n.includes('lead') ||
    n.includes('invite') ||
    n.includes('inbound') ||
    n.includes('interview') ||
    n.includes('screening') ||
    n.includes('assessment')
  ) {
    return DirectionType.Inbound;
  }

  return null;
}
