export function createReviewApi(repository) {
  return {
    listCandidates() {
      return repository.list();
    },
    getCandidate(candidateId) {
      return repository.get(candidateId);
    },
    approveCandidate(candidateId, decision) {
      requireDecision(decision);
      return repository.approve(candidateId, decision);
    },
    dismissCandidate(candidateId, decision) {
      requireDecision(decision);
      return repository.dismiss(candidateId, decision);
    },
    editCandidate(candidateId, patch, decision) {
      requireDecision(decision);
      return repository.edit(candidateId, patch, decision);
    },
    mergeCandidate(sourceCandidateId, targetCandidateId, decision) {
      requireDecision(decision);
      return repository.merge(sourceCandidateId, targetCandidateId, decision);
    },
  };
}

function requireDecision(decision) {
  if (!decision || typeof decision !== 'object') {
    throw new Error('decision is required');
  }
}
