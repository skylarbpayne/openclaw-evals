export function createReviewApi(repository) {
  return {
    listMistakes() {
      return repository.list();
    },
    reviewMistake(id, decision) {
      if (!decision || typeof decision !== 'object') throw new Error('decision is required');
      return repository.review(id, decision);
    },
  };
}
