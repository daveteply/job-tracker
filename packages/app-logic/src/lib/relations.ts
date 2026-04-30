export interface EntitySelection {
  id?: string | null;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  title?: string | null;
  isNew: boolean;
  shouldRemove: boolean;
  displayValue?: string | null;
  [key: string]: unknown;
}

export interface ResolveEntityIdInput {
  selection?: EntitySelection | null;
  currentId?: string | null;
  upsertEntity?: (input: Record<string, unknown>) => Promise<{ id: string }>;
  createId?: () => string;
  nameField?: string;
  additionalFields?: Record<string, unknown>;
}

/**
 * Resolves an entity ID from a selection.
 * If the selection is new, it will upsert the entity using the provided upsert function.
 * If the selection is marked for removal, it will return null.
 * Otherwise, it will return the existing ID.
 */
export async function resolveEntityId(
  input: ResolveEntityIdInput,
): Promise<string | null | undefined> {
  const {
    selection,
    currentId,
    upsertEntity,
    createId = () => crypto.randomUUID(),
    nameField = 'name',
    additionalFields = {},
  } = input;

  if (selection?.shouldRemove) {
    return null;
  }

  if (!selection) {
    return currentId;
  }

  if (selection.id && !selection.isNew) {
    return selection.id;
  }

  // Determine the name to use for upserting if it's a simple name-based entity
  const selectionAsRecord = selection as Record<string, unknown>;
  const rawNameValue =
    selection.id === undefined
      ? (selection.name ?? selection.displayValue ?? '')
      : (selectionAsRecord[nameField] ?? selection.name ?? selection.displayValue ?? '');

  const name = String(rawNameValue ?? '').trim();

  // If it's not a new entity and no name is provided, return current ID
  if (!selection.isNew && !name && !selection.firstName && !selection.title) {
    return currentId;
  }

  if (!upsertEntity) {
    throw new Error('Repository upsert is required to create a new entity');
  }

  // Prepare the upsert data
  // Omit UI-specific or "new-flag" fields that aren't part of the schema
  const idToUse = selection.id || createId();
  const upsertData: Record<string, unknown> = {
    ...additionalFields,
    id: idToUse,
  };

  // Copy all other fields from selection EXCEPT the ones we want to omit
  // We omit 'id' here because we've already handled it specifically to avoid nulls
  const omitFields = ['isNew', 'shouldRemove', 'displayValue', 'name', 'id'];
  Object.keys(selectionAsRecord).forEach((key) => {
    if (!omitFields.includes(key)) {
      const value = selectionAsRecord[key];
      if (value !== undefined) {
        upsertData[key] = value;
      }
    }
  });

  // If nameField is provided and not already in upsertData, add it (using selection.name or name)
  if (name && !upsertData[nameField]) {
    upsertData[nameField] = selection.name ?? name;
  }

  const upsertedEntity = await upsertEntity(upsertData);

  return upsertedEntity.id;
}

export interface ResolveCompanyIdInput {
  selection?: EntitySelection | null;
  currentCompanyId?: string | null;
  upsertCompany?: (input: { id: string; name: string }) => Promise<{ id: string }>;
  createId?: () => string;
}

export async function resolveCompanyId(
  input: ResolveCompanyIdInput,
): Promise<string | null | undefined> {
  const { upsertCompany } = input;
  // Wrap upsertCompany to match the expected signature
  const upsertEntityFn = upsertCompany
    ? (data: Record<string, unknown>) =>
        upsertCompany({
          id: String(data.id),
          name: String(data.name),
        })
    : undefined;

  return resolveEntityId({
    selection: input.selection,
    currentId: input.currentCompanyId,
    upsertEntity: upsertEntityFn,
    createId: input.createId,
    nameField: 'name',
  });
}

export interface DeriveEventCompanyIdInput {
  roleCompanyId?: string | null;
  contactCompanyId?: string | null;
  explicitCompanyId?: string | null;
}

export function deriveEventCompanyId(input: DeriveEventCompanyIdInput): string | null | undefined {
  return input.roleCompanyId ?? input.contactCompanyId ?? input.explicitCompanyId;
}
