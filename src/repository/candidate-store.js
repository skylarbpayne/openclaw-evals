import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export class CandidateStore {
  constructor(baseDir, options = {}) {
    this.baseDir = baseDir;
    this.dbFileName = options.dbFileName ?? 'mistake-registry.sqlite';
  }

  async saveAll(candidates) {
    const saved = [];

    for (const candidate of candidates) {
      const storagePath = await this.save(candidate);
      saved.push({ candidate: normalizeCandidate(candidate), filePath: storagePath });
    }

    return saved;
  }

  async save(candidate) {
    const normalized = normalizeCandidate(candidate);
    const db = await this.#open();

    try {
      const now = new Date().toISOString();
      const existing = db.prepare('SELECT created_at FROM mistake_candidates WHERE candidate_id = ?').get(normalized.candidateId);
      const createdAt = existing?.created_at ?? now;

      db.prepare(`
        INSERT INTO mistake_candidates (
          candidate_id,
          story_id,
          mistake_type,
          status,
          source_session_id,
          source_turn_start,
          source_turn_end,
          merged_into,
          payload_json,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(candidate_id) DO UPDATE SET
          story_id = excluded.story_id,
          mistake_type = excluded.mistake_type,
          status = excluded.status,
          source_session_id = excluded.source_session_id,
          source_turn_start = excluded.source_turn_start,
          source_turn_end = excluded.source_turn_end,
          merged_into = excluded.merged_into,
          payload_json = excluded.payload_json,
          updated_at = excluded.updated_at
      `).run(
        normalized.candidateId,
        normalized.storyId,
        normalized.mistakeType,
        normalized.status,
        normalized.sourceSessionId ?? null,
        normalized.sourceTurnRange?.start ?? null,
        normalized.sourceTurnRange?.end ?? null,
        normalized.mergedInto ?? null,
        JSON.stringify(normalized),
        createdAt,
        now,
      );

      db.prepare('DELETE FROM curation_audit_events WHERE candidate_id = ?').run(normalized.candidateId);

      const insertAudit = db.prepare(`
        INSERT INTO curation_audit_events (
          candidate_id,
          event_type,
          reviewer,
          rationale,
          event_json,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const event of normalized.auditHistory) {
        insertAudit.run(
          normalized.candidateId,
          event.type,
          event.reviewer ?? null,
          event.rationale ?? null,
          JSON.stringify(event),
          event.at ?? now,
        );
      }

      return this.getPath();
    } finally {
      db.close();
    }
  }

  async read(candidateId) {
    const db = await this.#open();

    try {
      const row = db.prepare('SELECT payload_json FROM mistake_candidates WHERE candidate_id = ?').get(candidateId);
      if (!row) {
        throw new Error(`candidate not found: ${candidateId}`);
      }

      return normalizeCandidate(JSON.parse(row.payload_json));
    } finally {
      db.close();
    }
  }

  async list() {
    const db = await this.#open();

    try {
      const rows = db.prepare('SELECT payload_json FROM mistake_candidates ORDER BY candidate_id').all();
      return rows.map((row) => normalizeCandidate(JSON.parse(row.payload_json)));
    } finally {
      db.close();
    }
  }

  getPath() {
    return path.join(this.baseDir, this.dbFileName);
  }

  async #open() {
    await mkdir(this.baseDir, { recursive: true });
    const db = new DatabaseSync(this.getPath());
    this.#ensureSchema(db);
    return db;
  }

  #ensureSchema(db) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS mistake_candidates (
        candidate_id TEXT PRIMARY KEY,
        story_id TEXT NOT NULL,
        mistake_type TEXT NOT NULL,
        status TEXT NOT NULL,
        source_session_id TEXT,
        source_turn_start INTEGER,
        source_turn_end INTEGER,
        merged_into TEXT,
        payload_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS curation_audit_events (
        event_id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        reviewer TEXT,
        rationale TEXT,
        event_json TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);
  }
}

function normalizeCandidate(candidate) {
  return {
    ...candidate,
    status: candidate.status ?? 'candidate',
    auditHistory: Array.isArray(candidate.auditHistory) ? candidate.auditHistory : [],
  };
}
