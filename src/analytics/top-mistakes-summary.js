import { CandidateStore } from '../repository/candidate-store.js';

const PRIORITY_ORDER = {
  'investigate-now': 0,
  'review-soon': 1,
  routine: 2,
};

const SEVERITY_ORDER = {
  high: 0,
  medium: 1,
  low: 2,
};

export async function buildTopMistakesSummary({ baseDir }) {
  const candidates = await new CandidateStore(baseDir).list();
  const groups = new Map();

  for (const candidate of candidates) {
    const key = candidate.family?.familyId ?? `type:${candidate.mistakeType}`;
    const label = candidate.family?.displayName ?? candidate.mistakeType;
    const group = groups.get(key) ?? createGroup({ key, label, candidate });
    addCandidate(group, candidate);
    groups.set(key, group);
  }

  const items = [...groups.values()]
    .map(finalizeGroup)
    .sort(compareGroups);

  return {
    totalCandidates: candidates.length,
    groupCount: items.length,
    items,
  };
}

function createGroup({ key, label, candidate }) {
  return {
    key,
    label,
    mistakeType: candidate.mistakeType,
    familyId: candidate.family?.familyId ?? null,
    severity: candidate.ranking?.severity ?? 'low',
    priorityBand: candidate.ranking?.priorityBand ?? 'routine',
    totalCount: 0,
    statusCounts: {},
    candidateIds: [],
    representativeCandidateId: candidate.candidateId,
    reasons: new Set(),
  };
}

function addCandidate(group, candidate) {
  group.totalCount += 1;
  group.statusCounts[candidate.status] = (group.statusCounts[candidate.status] ?? 0) + 1;
  group.candidateIds.push(candidate.candidateId);

  const severity = candidate.ranking?.severity ?? 'low';
  const priorityBand = candidate.ranking?.priorityBand ?? 'routine';
  if (SEVERITY_ORDER[severity] < SEVERITY_ORDER[group.severity]) {
    group.severity = severity;
  }
  if (PRIORITY_ORDER[priorityBand] < PRIORITY_ORDER[group.priorityBand]) {
    group.priorityBand = priorityBand;
  }

  for (const reason of candidate.ranking?.reasons ?? []) {
    group.reasons.add(reason);
  }
}

function finalizeGroup(group) {
  return {
    ...group,
    candidateIds: group.candidateIds.sort(),
    reasons: [...group.reasons],
  };
}

function compareGroups(a, b) {
  return (
    PRIORITY_ORDER[a.priorityBand] - PRIORITY_ORDER[b.priorityBand]
    || SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
    || b.totalCount - a.totalCount
    || a.label.localeCompare(b.label)
  );
}
