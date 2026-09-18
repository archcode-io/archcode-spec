# Conformance suite

Documents an implementation of ArchCode must agree with the reference engine on.
Each fixture states its own expectations in its first comment lines:

```
# conformance: valid — §6.3 `at <moment>` on hosts and runs
# expect: objects=3 relations=0 placements=1
# expect: diagnostics=none
```

`valid/` holds documents that must build without an error — some carry warnings or
information on purpose, and say so. `invalid/` holds documents that must produce a
specific diagnostic: code, severity and line. Every fixture, valid or not, must
survive `parse → serialize` byte for byte: the tree is lossless (§12.1).

```sh
node run.mjs                                   # against @archcode-io/engine (npm i @archcode-io/engine)
node run.mjs --engine ../path/to/your/index.js # against another implementation
node run.mjs --only invalid/ --json
```

An implementation "passes v0.2 conformance" when every fixture here passes. The
diagnostic codes are the ones in spec §17.10; an implementation may report more than
the fixture expects only as `info`.

Licensed under Apache-2.0 (see `../LICENSE-CODE`): copy these into your own test suite.
