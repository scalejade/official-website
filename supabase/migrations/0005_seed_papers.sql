-- Seed the papers table with the three launch papers.
-- Idempotent: re-running updates the existing rows (on conflict by slug).

insert into public.papers
    (slug, title, summary, abstract, authors, published_at, topics, venue, links, sections, bibtex)
values
(
    'tutorbench',
    'TutorBench: Evaluating Large Language Models as Adaptive Tutors',
    'A benchmark and evaluation suite for measuring how well LLMs teach — not just answer — across adaptivity, correctness, and pedagogy.',
    'Large language models are increasingly deployed as tutors, yet existing benchmarks reward correct final answers rather than effective teaching. We introduce TutorBench, a benchmark of 3,200 multi-turn tutoring sessions spanning mathematics, programming, and reading comprehension, annotated for pedagogical quality. TutorBench evaluates models along three axes — adaptivity to a learner''s evolving state, correctness of guidance, and pedagogical soundness — using a rubric validated against expert educators. Across 14 frontier and open models, we find that answer accuracy correlates only weakly with teaching quality, and that the strongest models still over-explain, reveal answers prematurely, and fail to diagnose misconceptions. We release the benchmark, rubric, and an automated judge to support reproducible progress on AI tutoring.',
    '["ScaleJade Research", "A. Pradana", "M. Wibowo", "S. Tan"]'::jsonb,
    '2026-05-12',
    '["Applied AI", "Evaluation", "Education"]'::jsonb,
    'Preprint · 2026',
    '{"pdf": "#", "arxiv": "#", "code": "#", "dataset": "#"}'::jsonb,
    '[
      {"heading": "Motivation", "paragraphs": ["Tutoring is a teaching task, not a question-answering task. A model that immediately reveals the answer may score well on accuracy benchmarks while being a poor tutor. We set out to measure the gap between answering and teaching."]},
      {"heading": "The Benchmark", "paragraphs": ["TutorBench contains 3,200 multi-turn sessions across mathematics, programming, and reading comprehension. Each turn is annotated for adaptivity, correctness, and pedagogical soundness using a rubric validated against expert educators.", "An automated judge reproduces expert ratings with high agreement, enabling low-cost, reproducible evaluation of new models."]},
      {"heading": "Findings", "paragraphs": ["Across 14 frontier and open models, final-answer accuracy correlates only weakly with teaching quality. The strongest models still over-explain, reveal answers prematurely, and fail to diagnose learner misconceptions.", "Prompting for Socratic behavior helps modestly but does not close the gap, suggesting that teaching is a capability that must be measured and trained for directly."]}
    ]'::jsonb,
    '@article{scalejade2026tutorbench,
  title  = {TutorBench: Evaluating Large Language Models as Adaptive Tutors},
  author = {ScaleJade Research and Pradana, A. and Wibowo, M. and Tan, S.},
  year   = {2026},
  note   = {Preprint},
  url    = {https://www.scalejade.com/research/tutorbench}
}'
),
(
    'ledgerproof',
    'LedgerProof: Verifiable Settlement for Permissioned Blockchain Networks',
    'A settlement protocol that produces succinct, externally verifiable proofs of finality for permissioned ledgers used in regulated finance.',
    'Permissioned blockchain networks underpin a growing share of regulated financial settlement, yet auditors and regulators must currently trust the operators of the network to attest to finality. We present LedgerProof, a settlement layer that emits succinct cryptographic proofs of transaction finality that any third party can verify without replaying the ledger. LedgerProof combines a BFT consensus core with a proof-aggregation scheme, reducing verification cost from linear in the number of transactions to constant. In a 32-node deployment processing 4,000 transactions per second, proof generation adds under 9ms of median latency while enabling continuous, independent audit. We discuss deployment in cross-border payment and securities-settlement settings.',
    '["ScaleJade Research", "R. Halim", "D. Putri"]'::jsonb,
    '2026-03-03',
    '["Blockchain", "Security", "Distributed Systems"]'::jsonb,
    'Preprint · 2026',
    '{"pdf": "#", "arxiv": "#"}'::jsonb,
    '[
      {"heading": "Problem", "paragraphs": ["Auditors of permissioned ledgers must trust operators to attest to finality, or replay the entire ledger to verify it. Neither scales for continuous regulatory oversight."]},
      {"heading": "Approach", "paragraphs": ["LedgerProof pairs a BFT consensus core with a proof-aggregation scheme so that finality can be verified in constant time by any third party, without replaying transactions."]},
      {"heading": "Results", "paragraphs": ["In a 32-node deployment at 4,000 TPS, proof generation adds under 9ms median latency while enabling continuous, independent audit — suitable for cross-border payment and securities settlement."]}
    ]'::jsonb,
    '@article{scalejade2026ledgerproof,
  title  = {LedgerProof: Verifiable Settlement for Permissioned Blockchain Networks},
  author = {ScaleJade Research and Halim, R. and Putri, D.},
  year   = {2026},
  note   = {Preprint},
  url    = {https://www.scalejade.com/research/ledgerproof}
}'
),
(
    'driftguard',
    'DriftGuard: Detecting Silent Data Drift in Production ML Pipelines',
    'A lightweight monitoring method that flags distribution shift in deployed models before it degrades downstream business metrics.',
    'Production machine-learning systems fail quietly: input distributions drift, model accuracy degrades, and the first signal is often a downstream business metric weeks later. We introduce DriftGuard, a monitoring method that detects feature- and prediction-level drift using a streaming two-sample test with controlled false-alarm rate. DriftGuard requires no labels at inference time and runs in-line with serving at negligible overhead. Across five production datasets from financial and logistics domains, DriftGuard detects injected drift a median of 11 days earlier than accuracy-based monitoring, with a 3x lower false-alarm rate than fixed-threshold baselines. We provide an open implementation and integration guidance for MLOps pipelines.',
    '["ScaleJade Research", "N. Sari", "K. Lim"]'::jsonb,
    '2026-01-20',
    '["Applied AI", "MLOps", "Data Analytics"]'::jsonb,
    'Preprint · 2026',
    '{"pdf": "#", "code": "#"}'::jsonb,
    '[
      {"heading": "The Silent Failure", "paragraphs": ["Deployed models degrade as input distributions shift, but the first visible signal is usually a lagging business metric. By then, weeks of poor decisions have accrued."]},
      {"heading": "Method", "paragraphs": ["DriftGuard runs a streaming two-sample test over features and predictions with a controlled false-alarm rate. It needs no inference-time labels and adds negligible serving overhead."]},
      {"heading": "Evaluation", "paragraphs": ["Across five production datasets in finance and logistics, DriftGuard flags injected drift a median of 11 days earlier than accuracy-based monitoring, with a 3x lower false-alarm rate than fixed-threshold baselines."]}
    ]'::jsonb,
    '@article{scalejade2026driftguard,
  title  = {DriftGuard: Detecting Silent Data Drift in Production ML Pipelines},
  author = {ScaleJade Research and Sari, N. and Lim, K.},
  year   = {2026},
  note   = {Preprint},
  url    = {https://www.scalejade.com/research/driftguard}
}'
)
on conflict (slug) do update set
    title        = excluded.title,
    summary      = excluded.summary,
    abstract     = excluded.abstract,
    authors      = excluded.authors,
    published_at = excluded.published_at,
    topics       = excluded.topics,
    venue        = excluded.venue,
    links        = excluded.links,
    sections     = excluded.sections,
    bibtex       = excluded.bibtex;
