# Rison Implementation Performance Comparison

## Purpose and Scope

This benchmark compares the public APIs for standard Rison values:
`rison2`'s `RISON.stringify` and `RISON.parse` against the `rison` npm
package's `encode` and `decode` functions. O-Rison and A-Rison APIs are outside
its scope.

## Reproduction

Install dependencies and run the comparison benchmarks:

```bash
npm install
npm run bench -- bench/rison-comparison.bench.ts
```

Run the lexer-only benchmark separately when attributing parser performance
changes to tokenization:

```bash
npm run bench -- bench/lexer.bench.ts
```

Run the benchmark several times when comparing results. CPU frequency,
background activity, JIT compilation, and garbage collection can affect short
microbenchmarks.

## Comparison Inputs

The public API comparison covers four JSON-compatible structures:

- A small object with primitive values.
- A nested medium object with arrays.
- A large array containing 1,000 objects.
- A large object containing 1,000 properties.

It also includes focused parse cases for representative Rison values:

- A bare string and a quoted string.
- A number.
- True and null literals.
- A small object and a small array containing mixed primitive values.

Both implementations receive the same JavaScript value in each stringify
case. Both parse implementations receive the same Rison source, generated
once before measurement. The focused parse sources are declared directly so
that each implementation parses identical input.

## Lexer Attribution

The lexer-only benchmark tokenizes the same 1,000-property large object used
by the public API comparison. Its Rison source is generated with
`RISON.stringify` before measurement. Each timed iteration creates a new
`Lexer` and consumes all tokens.

This internal benchmark helps determine whether a parser performance change
comes from tokenization. Its throughput must not be compared directly with the
public parse or stringify cases because it measures a different operation.

## Correctness Checks

Before measurement, each implementation parses the other implementation's
encoded output. `node:assert.deepStrictEqual` verifies that the result matches
the original fixture. The focused parse cases similarly verify each parser's
result against an explicit expected value. These checks and all source
generation run outside the timed callbacks.

Encoded strings are not required to match exactly because object key ordering
can differ while representing the same value.

## Interpreting Results

Vitest reports operations per second for `rison2` and `rison` within each
fixture group. Higher throughput indicates better performance for that input
and operation.

Compare several runs and consider their median. Absolute values depend on the
hardware, Node.js and V8 versions, and current system load. They are not
regression thresholds.

## Limitations

- Inputs are synthetic and do not represent every real-world Rison payload.
- O-Rison, A-Rison, URI escaping, and error paths are not measured.
- The lexer benchmark is an internal attribution tool, not a public API
  comparison with the `rison` package.
- The short measurement window increases sensitivity to JIT compilation,
  inlining, garbage collection, and background activity.
- Results from different machines or runtime versions are not directly
  comparable.
