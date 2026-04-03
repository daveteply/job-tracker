export interface UpsertEntityOptions<TInput extends { id: string }, TResult> {
  create: (input: TInput) => Promise<TResult>;
  update: (id: string, input: TInput) => Promise<TResult | null>;
  findExisting: (id: string) => Promise<unknown | null>;
  entityName: string;
}

export async function upsertEntity<TInput extends { id: string }, TResult>(
  input: TInput,
  options: UpsertEntityOptions<TInput, TResult>,
): Promise<TResult> {
  const existing = await options.findExisting(input.id);

  if (!existing) {
    return options.create(input);
  }

  const updated = await options.update(input.id, input);
  if (!updated) {
    throw new Error(`Failed to update ${options.entityName} with id "${input.id}"`);
  }

  return updated;
}
