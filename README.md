# jwt-crack

Multi-threaded brute force JWT cracker in pure Node.js.

Cracks **HS256** tokens by trying every secret built from a character alphabet, up to a maximum length. Work is split across Node cluster workers so all CPU cores stay busy.

Only use this on tokens you own or have permission to test.

## Installation

[![NPM](https://nodei.co/npm/jwt-crack.png?compact=true)](https://npmjs.org/package/jwt-crack)

```bash
npm install -g jwt-crack
```

Or run from a clone:

```bash
npm install
node bin/jwt-crack.js <jwt> [options]
```

## Basic usage

```bash
jwt-crack eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U
```

On success it prints the secret and exits. On failure (exhausted search space) it exits with code 1.

## Options

```
Usage: jwt-crack <jwt> [options]

  -c, --chars <v>       Alphabet for brute-force secrets (default: letter frequency set)
  -m, --maxlen <n>      Maximum secret length to try (default: 12)
  -p, --progress <n>    Start at this attempt number (resume)
  -w, --workers <n>     Worker processes to spawn (default: CPU count)
  -S, --session [file]  Persist state to resume later (default: <jwt>.json)
  -P, --progressbar     Show a progress bar
```

### Resume a session

```bash
jwt-crack eyJhbG... --session crack.json
```

With `--session` alone, state is stored in `<jwt>.json`. Re-run the same command to pick up where you left off. Progress is saved periodically and on exit.

### Narrow the search

Short secrets over a small alphabet finish fastest:

```bash
jwt-crack eyJhbG... --chars abc0123456789 --maxlen 6
```

## How it works

1. Parse the JWT header and payload (everything before the last `.`).
2. Split work across workers. Each worker tries secrets at offsets `progress + offset`, `progress + offset + workers`, and so on.
3. For each candidate secret, compute `HMAC-SHA256` and compare to the token signature (base64, padding normalized).
4. First match wins; all workers stop.

The default alphabet orders characters by English letter frequency to find common secrets sooner.

## Limitations

- **HS256 only.** Other algs (`RS256`, `none`, etc.) are not supported.
- Brute force only works for **weak or short** secrets. Long random secrets are not practical to crack.
- Search space grows as `alphabet.length ^ maxlen`. Use `--chars` and `--maxlen` wisely.

## Tests

HMAC implementation benchmarks live under `test/hmac/`. There is no full integration test suite yet.

## TODO

- Implement --minlen option
- Find a faster HMAC SHA256 module
- Add forecasts to progress notifications (either ETA or estimated finish time)
- Use a CLI progress bar module for progress?
- Output string secret instead of number when aborting? If so also accept it on --start
- Resume if worker dies? Maybe not needed why would they die?
- Read header, detect alg and support them?

## LICENSE

MIT. See [LICENSE.md](LICENSE.md).
