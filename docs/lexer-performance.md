# Lexer Token Matching Performance

## Purpose and Scope

This document records the investigation and optimization of `Lexer` token
matching for representative token streams. The benchmark measures the lexer in
isolation: each iteration constructs a `Lexer` and consumes tokens until end of
input. Input generation and token counting happen outside the measured
callback.

The optimized lexer uses sticky regular expressions to match against the
original source at the current position. This avoids allocating
`source.slice(pos)` for every attempted regexp rule. The benchmark does not
measure parsing or value construction.

## Reproduction

Install dependencies and run the lexer benchmarks:

```bash
npm install
npm run bench -- --testNamePattern='Lexer token matching'
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
runs of the current implementation. The range shows the lowest and highest
result from those runs.

| Shape          | Small ops/s, median (range) | Large ops/s, median (range) |
| -------------- | --------------------------: | --------------------------: |
| Fixed tokens   |   175,022 (168,786-183,915) |      19,734 (17,279-20,281) |
| Identifiers    |   132,720 (120,831-133,532) |      10,969 (10,908-13,722) |
| Numbers        |    101,678 (97,297-109,696) |       10,258 (9,755-10,912) |
| Quoted strings |   205,415 (203,973-208,407) |      20,639 (19,683-21,231) |
| Mixed objects  |    100,279 (96,229-101,070) |         9,453 (9,212-9,625) |

These absolute values are environment-dependent and are not regression
thresholds.

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

Regexp rules now clone their expression with the sticky (`y`) flag when the
rule is created. Before each match, the rule sets `lastIndex = pos` and executes
the expression against the original source. The identifier and number patterns
no longer use `^`, because sticky matching already requires the match to begin
at `lastIndex`.

Resetting `lastIndex` for every attempt is required because sticky regular
expressions are stateful. Regression tests cover regexp tokens at non-zero
positions and matching after preceding rules fail.

### Direct Dispatch

Dispatching from the current character could reduce unsuccessful rule calls,
especially for identifiers and numbers near the end of `RULES`. The profile
supports rule dispatch as an area worth evaluating, but does not quantify the
benefit. Direct dispatch also duplicates lexical classification logic and may
reduce readability, so it should only be adopted after an isolated
implementation demonstrates a meaningful improvement over sticky matching.

## Recommendation

Keep the sticky-regexp implementation and use this benchmark for future lexer
changes. Do not add memoization, because normal tokenization does not revisit
source positions. Consider direct dispatch only if a separate benchmark shows
an improvement large enough to justify the additional lexical classification
logic.

## Limitations

- Results cover one machine, operating system, Node.js version, and V8 build.
- Inputs are synthetic and do not represent every real Rison payload.
- The benchmark isolates tokenization and excludes parser and allocation costs
  for parsed values.
- Each case uses a short measurement window, so repeated runs are more useful
  than a single absolute result.
- JIT compilation and inlining can affect short benchmark runs.
