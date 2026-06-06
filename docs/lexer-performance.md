# Lexer Token Matching Performance

## Purpose and Scope

This investigation profiles the existing `Lexer` token matching behavior for
representative token streams. It measures the lexer in isolation: each
benchmark constructs a `Lexer` and consumes tokens until end of input. Input
generation and token counting happen outside the measured callback.

The investigation does not modify the production lexer, compare alternative
lexer implementations, or measure parsing and value construction.

## Reproduction

Install dependencies and run the focused benchmarks:

```bash
npm install
npm run bench
```

Run the benchmark several times when comparing results. CPU frequency,
background activity, JIT compilation, and garbage collection can affect short
microbenchmarks.

To capture a V8 CPU profile for the Vitest worker:

```bash
PROFILE_DIR="$(mktemp -d)"
npx vitest bench --run \
  --pool=forks \
  --maxWorkers=1 \
  --execArgv=--cpu-prof \
  --execArgv=--cpu-prof-dir="$PROFILE_DIR" \
  --execArgv=--cpu-prof-interval=100 \
  bench/performance.bench.ts
find "$PROFILE_DIR" -name '*.cpuprofile' -print
```

The `--execArgv` options are important because the benchmark callback runs in
a Vitest worker rather than the parent CLI process. Load the generated
`.cpuprofile` in a CPU profile viewer, such as the Performance panel in Chrome
DevTools, and inspect bottom-up self time. The analysis below also grouped each
sample's `timeDeltas` by its node's source URL and function name.

## Measurement Environment

Measurements were collected on 2026-06-06 with:

- Node.js 24.16.0
- npm 11.13.0
- macOS 26.4.1, Darwin 25.4.0
- Apple A18 Pro
- Vitest 4.1.5

## Inputs

The benchmark covers two sizes for each representative shape:

| Shape          |           Small input |               Large input |
| -------------- | --------------------: | ------------------------: |
| Fixed tokens   | 100 tokens, 150 bytes | 1,000 tokens, 1,500 bytes |
| Identifiers    |  99 tokens, 349 bytes |   999 tokens, 3,499 bytes |
| Numbers        |  99 tokens, 489 bytes |   999 tokens, 5,389 bytes |
| Quoted strings |  99 tokens, 849 bytes |   999 tokens, 8,499 bytes |
| Mixed objects  | 141 tokens, 312 bytes | 1,401 tokens, 3,282 bytes |

Comma separators are included in the token counts for identifiers, numbers,
and quoted strings. Mixed inputs contain arrays, objects, identifiers, numbers,
booleans, punctuation, and separators.

## Results

The following values are the median throughput from three complete benchmark
runs. The range shows the lowest and highest result from those runs.

| Shape          | Small ops/s, median (range) | Large ops/s, median (range) |
| -------------- | --------------------------: | --------------------------: |
| Fixed tokens   |   120,922 (112,857-128,356) |      11,498 (11,141-12,526) |
| Identifiers    |      78,926 (73,249-79,085) |         9,136 (7,796-9,168) |
| Numbers        |      62,752 (60,482-73,035) |         6,755 (6,059-6,946) |
| Quoted strings |   129,775 (121,874-133,632) |      12,767 (11,954-13,927) |
| Mixed objects  |      63,138 (58,908-67,658) |         6,309 (6,193-6,376) |

These absolute values are environment-dependent and are not regression
thresholds. The large cases show approximately linear scaling with token
count. Numbers and mixed objects are slower per operation than fixed or quoted
tokens because they exercise more late-position rules and token kinds.

## CPU Profile Findings

Two profiles were captured with a 100 microsecond sampling interval. Grouping
self-time samples by source URL and function name produced these ranges:

| Sample group                                 | Share of profiled time |
| -------------------------------------------- | ---------------------: |
| `src/lexer.ts` rule matching and `nextToken` |            58.8%-60.3% |
| Benchmark callback and loop                  |            16.4%-18.0% |
| Tinybench harness                            |            11.6%-12.0% |
| Native regular expression execution          |              4.0%-4.3% |
| Garbage collection                           |              1.0%-1.1% |

The profile locates most measured self time in the lexer's rule callbacks.
For every token, rules are tried sequentially from `RULES` until one matches.
Native regular expression execution is visible but is not the dominant sampled
cost. Garbage collection is also not dominant in these runs.

The profile cannot reliably separate every inlined operation inside an
anonymous rule callback. In particular, it does not establish how much of a
regexp rule's cost comes from `source.slice(pos)` versus `RegExp.exec`.
Therefore, the evidence supports investigating rule dispatch and matching at
the current position, but not attributing a precise percentage to either
operation.

## Optimization Assessment

### Regular Expression Pre-compilation

The identifier and number regular expressions are already created once when
the module initializes and stored in `RULES`. Moving the same expressions
elsewhere would not add a pre-compilation benefit.

### Memoization

The lexer advances monotonically and does not revisit source positions during
normal tokenization. Memoizing matches would add lookup and storage costs
without reuse, so it is not recommended.

### Sticky Regular Expressions

Sticky regular expressions can match at `lastIndex = pos`, avoiding the
current `source.slice(pos)` before regexp matching. This directly targets work
inside the sampled rule callbacks, but this investigation does not measure an
alternative implementation. Issue #77 owns the production sticky-regexp
optimization and should validate it against these focused cases plus the
correctness test suite.

### Direct Dispatch

Dispatching from the current character could reduce unsuccessful rule calls,
especially for identifiers and numbers near the end of `RULES`. The profile
supports rule dispatch as an area worth evaluating, but does not quantify the
benefit. Direct dispatch also duplicates lexical classification logic and may
reduce readability, so it should only be adopted after an isolated
implementation demonstrates a meaningful improvement over sticky matching.

## Recommendation

Do not add pre-compilation or memoization changes. Use the benchmark as a
repeatable baseline for Issue #77, where sticky regular expressions should be
implemented and compared with the current lexer. Consider direct dispatch
only if sticky matching leaves a demonstrated bottleneck large enough to
justify the added complexity.

## Limitations

- Results cover one machine, operating system, Node.js version, and V8 build.
- Inputs are synthetic and do not represent every real Rison payload.
- The benchmark isolates tokenization and excludes parser and allocation costs
  for parsed values.
- Each case uses a short measurement window, so repeated runs are more useful
  than a single absolute result.
- Sampling profiles and JIT inlining limit attribution within anonymous rule
  callbacks.
- No alternative production implementation was measured in this issue.
