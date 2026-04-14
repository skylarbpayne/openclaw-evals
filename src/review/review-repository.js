import { CandidateStore } from '../repository/candidate-store.js';

export class ReviewRepository {
  constructor(baseDir, options = {}) {
    this.baseDir = baseDir;
    this.store = new CandidateStore(baseDir, options.storeOptions);
    this.now = options.now ?? (() => new Date().toISOString());
  }

  async list() {
    return this.store.list();
  }

  async get(candidateId) {
    return this.store.read(candidateId);
  }

  async approve(candidateId, decision = {}) {
    return this.#mutate(candidateId, (candidate) => ({
      ...candidate,
      status: 'approved',
      review: {
        ...(candidate.review ?? {}),
        approvedBy: decision.reviewer ?? null,
        rationale: decision.rationale ?? null,
        approvedAt: this.now(),
      },
      auditHistory: appendAudit(candidate.auditHistory, {
        type: 'approve',
        reviewer: decision.reviewer ?? null,
        rationale: decision.rationale ?? null,
        at: this.now(),
      }),
    }));
  }

  async dismiss(candidateId, decision = {}) {
    return this.#mutate(candidateId, (candidate) => ({
      ...candidate,
      status: 'dismissed',
      dismissal: {
        reviewer: decision.reviewer ?? null,
        rationale: decision.rationale ?? null,
        dismissedAt: this.now(),
      },
      auditHistory: appendAudit(candidate.auditHistory, {
        type: 'dismiss',
        reviewer: decision.reviewer ?? null,
        rationale: decision.rationale ?? null,
        at: this.now(),
      }),
    }));
  }

  async edit(candidateId, patch, decision = {}) {
    if (!patch || typeof patch !== 'object') {
      throw new Error('edit patch is required');
    }

    return this.#mutate(candidateId, (candidate) => ({
      ...candidate,
      ...patch,
      sourceSessionId: candidate.sourceSessionId,
      sourceTurnRange: candidate.sourceTurnRange,
      provenance: candidate.provenance,
      auditHistory: appendAudit(candidate.auditHistory, {
        type: 'edit',
        reviewer: decision.reviewer ?? null,
        rationale: decision.rationale ?? null,
        patch,
        at: this.now(),
      }),
    }));
  }

  async merge(sourceCandidateId, targetCandidateId, decision = {}) {
    if (sourceCandidateId === targetCandidateId) {
      throw new Error('source and target candidate ids must differ');
    }

    const source = await this.get(sourceCandidateId);
    await this.get(targetCandidateId);

    const mergedSource = {
      ...source,
      status: 'merged',
      mergedInto: targetCandidateId,
      auditHistory: appendAudit(source.auditHistory, {
        type: 'merge',
        reviewer: decision.reviewer ?? null,
        rationale: decision.rationale ?? null,
        targetCandidateId,
        at: this.now(),
      }),
    };

    await this.store.save(mergedSource);
    return mergedSource;
  }

  async #mutate(candidateId, updater) {
    const candidate = await this.get(candidateId);
    const updated = normalizeCandidate(updater(candidate));
    await this.store.save(updated);
    return updated;
  }
}

function appendAudit(existing = [], entry) {
  return [...existing, entry];
}

function normalizeCandidate(candidate) {
  return {
    ...candidate,
    status: candidate.status ?? 'candidate',
    auditHistory: Array.isArray(candidate.auditHistory) ? candidate.auditHistory : [],
  };
}
