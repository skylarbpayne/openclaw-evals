export class InMemoryMistakeRepository {
  constructor() {
    this.items = new Map();
  }

  save(candidate) {
    this.items.set(candidate.id, candidate);
    return candidate;
  }

  list() {
    return [...this.items.values()];
  }

  get(id) {
    return this.items.get(id) ?? null;
  }

  review(id, update) {
    const current = this.get(id);
    if (!current) throw new Error(`Unknown candidate: ${id}`);
    const next = { ...current, ...update, reviewedAt: new Date().toISOString() };
    this.items.set(id, next);
    return next;
  }
}
