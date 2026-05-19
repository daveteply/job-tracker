// Mock ViewTransition since it might not be available in the test environment
import { render } from '@testing-library/react';

import { SignInView } from './common/auth/sign-in-view';
// Components to cover
import { ExternalLink } from './common/data-display/external-link';
import * as Skeletons from './common/feedback/skeletons';
import { SyncIndicator } from './common/feedback/sync-indicator';
import { EntityDelete } from './common/forms/entity-delete';
import { EnumSelector } from './common/forms/enum-selector';
import { ErrorMsg } from './common/forms/error-msg';
import { BottomNav } from './common/layout/bottom-nav';
import { Breadcrumbs } from './common/layout/bread-crumbs';
import { FloatingActionButton } from './common/layout/floating-action-button';
import { FloatingButtonContainer } from './common/layout/floating-button-container';
import { Header } from './common/layout/header';
import { PageHeader } from './common/layout/page-header';
import { DashboardMenuLinks } from './common/navigation/dashboard-menu-links';
import { CompanyInfoCard } from './company/company-info-card';
import { CompanyList } from './company/company-list';
import { ContactInfoCard } from './contact/contact-info-card';
import { ContactList } from './contact/contact-list';
import { EventInfoCard } from './event/event-info-card';
import { EventList } from './event/event-list';
import { EventTypeInfoCard } from './event-type/event-type-info-card';
import { EventTypeSelect } from './event-type/event-type-select';
import { ReminderInfoCard } from './reminder/reminder-info-card';
import { ReminderList } from './reminder/reminder-list';
import { Pipeline } from './role/pipeline';
import { RoleInfoCard } from './role/role-info-card';
import { RoleList } from './role/role-list';

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return {
    ...actual,
    ViewTransition: actual.ViewTransition || (({ children }: any) => children),
  };
});

// Mock Next hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { name: 'Test' } }, status: 'authenticated' }),
}));

// Mock custom hooks
jest.mock('@job-tracker/hooks', () => ({
  useDb: jest.fn(),
  useCompanyActions: () => ({ upsertCompany: jest.fn(), removeCompany: jest.fn() }),
  useContactActions: () => ({ upsertContact: jest.fn(), removeContact: jest.fn() }),
  useRoleActions: () => ({ upsertRole: jest.fn(), removeRole: jest.fn() }),
  useEventActions: () => ({ upsertEvent: jest.fn(), removeEvent: jest.fn() }),
  useReminderActions: () => ({ upsertReminder: jest.fn(), removeReminder: jest.fn() }),
  useEventTypeActions: () => ({ upsertEventType: jest.fn(), removeEventType: jest.fn() }),
  useCanDeleteCompany: () => [{}, true],
  useCanDeleteContact: () => [{}, true],
  useCanDeleteRole: () => [{}, true],
  useCanDeleteEvent: () => [{}, true],
  useCanDeleteEventType: () => [{}, true],
  useUserSettings: () => ({
    settings: { showInactiveRoles: false },
    updateSettings: jest.fn(),
    isLoading: false,
  }),
  useBetaApproved: () => true,
  useIsClient: () => true,
  useCompany: () => ({ company: null, loading: false }),
  useContactWithCompany: () => ({ contact: null, loading: false }),
  useRoleWithCompany: () => ({ role: null, loading: false }),
  useEventWithChildren: () => ({ event: null, loading: false }),
  useReminder: () => ({ reminder: null, loading: false }),
  ACTION_CONSTRAINTS: {
    roles: [],
    contacts: [],
    companies: [],
  },
  useAvailableActions: () => ({
    canAddCompany: true,
    canAddContact: true,
    canAddRole: true,
    canAddEvent: true,
    canAddReminder: true,
  }),
}));

jest.mock('./common/context/floating-ui-context', () => ({
  useFloatingUI: () => ({
    setIsContainerActive: jest.fn(),
    isContainerActive: false,
  }),
}));

jest.mock('./common/feedback/toast-context', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

describe('UI Components Coverage', () => {
  it('should render common components', () => {
    render(<ExternalLink url="https://test.com" linkText="Link" />);
    render(<Skeletons.CardSkeleton />);
    render(<SyncIndicator />);
    render(
      <SignInView
        title="Sign In"
        description="Test description"
        appName="Vireo"
        appIconSrc="/icon.png"
        providers={[]}
      />,
    );
    render(<FloatingButtonContainer>Child</FloatingButtonContainer>);
    render(<PageHeader title="Test" />);
    render(<BottomNav />);
    render(<Breadcrumbs />);
    render(<FloatingActionButton />);
    render(<ErrorMsg name="test" errors={{}} tValidation={(key) => key} />);
    render(
      <EnumSelector
        enumObject={{ A: 'A' }}
        register={{ name: 'test', onBlur: jest.fn(), onChange: jest.fn(), ref: jest.fn() } as any}
      />,
    );
    render(<DashboardMenuLinks />);
    render(<Header title="Vireo" />);
  });

  it('renders entity cards', () => {
    const mockCompany = { id: '1', name: 'C1' } as any;
    const mockContact = { id: '1', firstName: 'J', lastName: 'D' } as any;
    const mockRole = { id: '1', title: 'R1' } as any;
    const mockEvent = { id: '1', occurredAt: '2023-01-01' } as any;
    const mockReminder = { id: '1', remindAt: '2023-01-01' } as any;
    const mockEventType = { id: '1', name: 'ET1' } as any;

    render(<CompanyInfoCard company={mockCompany} />);
    render(<ContactInfoCard contact={mockContact} />);
    render(<RoleInfoCard role={mockRole} />);
    render(<EventInfoCard event={mockEvent} />);
    render(<ReminderInfoCard reminder={mockReminder} />);
    render(<EventTypeInfoCard eventType={mockEventType} />);
  });

  it('renders entity lists and others', () => {
    render(<CompanyList activeCompanies={[]} />);
    render(<ContactList contacts={[]} />);
    render(<RoleList activeRoles={[]} />);
    render(<EventList events={[]} />);
    render(<ReminderList reminders={[]} />);
    render(
      <EventTypeSelect
        options={[]}
        onChange={() => {
          /* no-op */
        }}
      />,
    );
    render(<Pipeline roles={[]} />);
    render(
      <EntityDelete
        id="1"
        entityName="Test"
        onDeleteAction={() => Promise.resolve({ success: true, message: 'Deleted' })}
        postActionRoute="/"
      />,
    );
  });
});
