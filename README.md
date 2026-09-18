# ArchCode — the specification

ArchCode is an open notation for describing the architecture of digital systems across
C4 levels. Compact enough to paste into a README, precise enough to validate, diff and
generate from code.

```archcode
service   checkout   "Checkout"      tech Go
datastore orders_db  "Orders DB"     tech PostgreSQL 16

checkout writes orders_db over SQL
```

Three lines, a real diagram, and enough semantics for a linter to say
*"a service writes a datastore directly — is that intended?"*

**Status: draft v0.2.** Read it at [archcode.io/docs](https://archcode.io/docs/), try it at
[archcode.io/play](https://archcode.io/play/). The text marks every section: implemented,
partial, reserved for v0.3, or planned.

## What is in this repository

| path | what | license |
|---|---|---|
| `spec.md` | the specification — the prose, the vocabulary, the grammar in Appendix A | CC BY 4.0 |
| `examples/` | reference documents (`.arch`), the ones the site renders | Apache-2.0 |
| `conformance/` | fixtures every implementation must agree on, and the runner | Apache-2.0 |
| `grammar/`, `schema/` *(coming)* | EBNF, the tree-sitter grammar, the JSON Schema of the compiled form | Apache-2.0 |

The site renders `spec.md` as [archcode.io/docs](https://archcode.io/docs/) and the examples
as the gallery; this repository is where both are edited.

## Design rules

1. **Define once.** Every object is declared once. Views select from the catalogue; nothing is redeclared per picture.
2. **Semantic, not shapes.** `service`, `datastore`, `broker`, `gateway` — real patterns that map onto C4 levels.
3. **Relations are verbs.** `checkout writes payments_db` — a verb carries meaning an arrow loses.
4. **Contracts by pointer.** `exposes http openapi://checkout.yaml` — the address, not the content.
5. **Layout is not architecture.** Coordinates exist only inside `view`, and only when a human pinned them.
6. **Stable ids, free names.** The id is referenced; the display name is a string and may change at will.
7. **Minimal ceremony.** Three lines must produce a useful diagram, or nobody will replace Mermaid with this.

## Versions

| version | state |
|---|---|
| 0.2 | draft — what the reference engine and the Playground do today |
| 0.3 | reserved words get their meaning: `decision`, `rule`, `board`, `contract`, YAML/JSON as input |
| 1.0 | frozen syntax; changes only by the compatibility rules in §11 |

## Contributing

The spec is an early draft and we are not accepting pull requests yet. What helps most
right now is *using* it: write a real system down, and when the notation gets in the way,
tell us — Issues open with the first public release. See
[CONTRIBUTING](https://github.com/archcode-io/.github/blob/main/CONTRIBUTING.md).

## License

Two licenses, on purpose, from the first commit:

- **The text of the specification** (`spec.md` and the prose it contains) is licensed under
  [Creative Commons Attribution 4.0 International](LICENSE) — copy it, translate it, quote
  it, build on it; say where it came from.
- **Everything a tool would copy** — grammars, schemas, example documents, test fixtures —
  is licensed under [Apache-2.0](LICENSE-CODE), so that it can go into your parser, your
  editor plugin or your product without attribution notices in binaries and with an explicit
  patent grant.

The boundary: if it is meant to be read, CC BY 4.0; if it is meant to be executed or
embedded, Apache-2.0. (W3C and CommonMark draw the line in the same place.)

ArchCode is an open standard created and maintained by Baryshev Labs.
© Baryshev Labs · CC BY 4.0
