# Acceptance Test - C3-lite runtime failure families MVP

## Story metadata
- Story ID: C3
- Owner: Skylar
- Related architecture subsystem(s): Eval generation, Registry
- Environment: local repo with real runtime-failure fixture and eval conversion path

## Intent
Prove that repeated runtime/provider failure artifacts can carry deterministic family metadata, and that approved eval artifacts preserve that family lineage.

## Commands under test
```bash
node --test test/c3-runtime-failure-families.test.js test/a3-runtime-failure.test.js test/b3-severity-frequency.test.js test/c1-convert-approved-candidate.test.js
```

## Acceptance criteria under test
1. Runtime/provider failure artifacts derive a stable family identifier from a normalized error signature
2. Identical normalized error signatures produce the same family identifier
3. Approved eval artifacts preserve candidate family provenance

## Result summary
- Runtime/provider failure family signature normalized to `oauth-auth-not-allowed`
- Stable family id preserved for matching signatures
- Eval artifact provenance now includes `candidateFamily`
- Overall verdict: pass
- Approval status: accepted in current working tree
