# ArchCode — Specification v0.2 (draft)

> A semantic notation for describing the architecture of digital systems across C4 levels.
> Compact enough to paste into a README. Precise enough to validate, diff and generate from code.

| | |
|---|---|
| **Status** | draft v0.2 — the text describes what the reference engine does; marks say where it does not yet |
| **File extension** | `.arch` |
| **Compiled form** | `arch.json` (JSON Schema `archcode/v1`) |
| **Spec license** | CC BY 4.0 |
| **Reference implementation** | Apache-2.0 |
| **Dialects** | compact (this document), YAML, JSON — all three parse to the same model, see §15 |

**How to read the marks**

| | |
|---|---|
| {{v0.2}} | implemented in the engine and the Playground |
| {{partial}} | partly implemented — the text says which part |
| {{reserved v0.3}} | the parser keeps the block byte for byte and reports it; nothing is interpreted yet |
| {{soon}} | planned, not started |
| *no mark* | implemented as written |

---

## 0. Why another notation

Mermaid and PlantUML draw **shapes**. They do not know what a *service*, a *broker* or a *gateway* is,
what it exposes, what it consumes, or where it runs. So a diagram cannot be validated, cannot be compared
with the running system, and cannot be generated from a repository.

OpenAPI, AsyncAPI, proto and SQL describe systems **in depth** — one interface at a time.
Nothing describes a system **in breadth**.

ArchCode fills that gap and **refuses to compete with the depth standards**: it holds the *fact* of a
contract, its address and its version, and points at the real file. The grammar has no place to copy a
path, a field or a schema into.

<svg class="fig" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ArchCode covers the breadth of a system in one file and points at the standards that hold the depth of each contract">
<style>.fig text{font-family:'IBM Plex Sans',system-ui,sans-serif;font-size:12px;fill:var(--text)} .fig .m{font-family:'IBM Plex Mono',monospace;font-size:10.5px;fill:var(--text-3)} .fig .k{font-family:'IBM Plex Mono',monospace;font-size:10px;fill:var(--text-3)} .fig .ax{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;fill:var(--accent)} .fig .card{fill:var(--surface-2);stroke:var(--accent-dim);stroke-width:1.3} .fig .band{fill:none;stroke:var(--accent);stroke-width:1.5;stroke-dasharray:6 4} .fig .doc{fill:var(--surface);stroke:var(--line);stroke-width:1} .fig .ptr{stroke:var(--text-3);stroke-width:1.2;stroke-dasharray:3 3;fill:none} .fig .rel{stroke:var(--text-2);stroke-width:1.3;fill:none} .fig .t{font-weight:600} .fig .cap{fill:var(--text-2);font-size:12px}</style>
<defs><marker id="figar" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0.5 0.8 L7.2 4 L0.5 7.2" fill="none" stroke="var(--text-2)" stroke-width="1.3"/></marker><marker id="figptr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0.5 0.8 L7.2 4 L0.5 7.2" fill="none" stroke="var(--text-3)" stroke-width="1.2"/></marker></defs>
<text class="ax" x="20" y="22">BREADTH — ONE FILE: WHAT EXISTS · HOW IT CONNECTS · WHERE IT RUNS</text>
<rect class="band" x="20" y="34" width="720" height="100" rx="10"/>
<text class="k" x="730" y="50" text-anchor="end">archcode.arch</text>
<rect class="card" x="46" y="58" width="118" height="52" rx="7"/>
<text class="t" x="105" y="80" text-anchor="middle">Checkout</text><text class="k" x="105" y="97" text-anchor="middle">[service]</text>
<rect class="card" x="226" y="58" width="118" height="52" rx="7"/>
<text class="t" x="285" y="80" text-anchor="middle">Orders DB</text><text class="k" x="285" y="97" text-anchor="middle">[datastore]</text>
<rect class="card" x="406" y="58" width="118" height="52" rx="7"/>
<text class="t" x="465" y="80" text-anchor="middle">order.placed</text><text class="k" x="465" y="97" text-anchor="middle">[topic]</text>
<rect class="card" x="586" y="58" width="118" height="52" rx="7"/>
<text class="t" x="645" y="80" text-anchor="middle">prod</text><text class="k" x="645" y="97" text-anchor="middle">[env]</text>
<path class="rel" d="M166 84 L224 84" marker-end="url(#figar)"/><text class="k" x="195" y="78" text-anchor="middle">writes</text>
<path class="rel" d="M526 84 L584 84" marker-end="url(#figar)"/><text class="k" x="555" y="78" text-anchor="middle">runs on</text>
<path class="rel" d="M105 110 C 105 130, 465 130, 465 112" marker-end="url(#figar)"/><text class="k" x="285" y="128" text-anchor="middle">publishes</text>
<text class="ax" x="20" y="178">DEPTH — ONE STANDARD PER CONTRACT, REFERENCED BY POINTER, NEVER RESTATED</text>
<path class="ptr" d="M105 134 L105 198" marker-end="url(#figptr)"/>
<rect class="doc" x="32" y="200" width="146" height="60" rx="5"/>
<path class="doc" d="M164 200 l14 14 h-14 z"/>
<text class="t" x="42" y="222">OpenAPI</text>
<text class="m" x="42" y="242">openapi://checkout.yaml</text>
<path class="ptr" d="M285 134 L285 198" marker-end="url(#figptr)"/>
<rect class="doc" x="212" y="200" width="146" height="60" rx="5"/>
<path class="doc" d="M344 200 l14 14 h-14 z"/>
<text class="t" x="222" y="222">SQL</text>
<text class="m" x="222" y="242">sql://orders.sql</text>
<path class="ptr" d="M465 134 L465 198" marker-end="url(#figptr)"/>
<rect class="doc" x="392" y="200" width="146" height="60" rx="5"/>
<path class="doc" d="M524 200 l14 14 h-14 z"/>
<text class="t" x="402" y="222">AsyncAPI</text>
<text class="m" x="402" y="242">asyncapi://events.yaml</text>
<path class="ptr" d="M645 134 L645 198" marker-end="url(#figptr)"/>
<rect class="doc" x="572" y="200" width="146" height="60" rx="5"/>
<path class="doc" d="M704 200 l14 14 h-14 z"/>
<text class="t" x="582" y="222">Terraform</text>
<text class="m" x="582" y="242">terraform://prod</text>
<text class="cap" x="20" y="294">ArchCode holds the <tspan class="t">fact</tspan> of a contract, its <tspan class="t">address</tspan> and its <tspan class="t">version</tspan> — the grammar has no place to copy a path,</text>
<text class="cap" x="20" y="312">a field or a schema into. The file the pointer names stays the single source of that depth.</text>
</svg>

---

## 1. Design rules

1. **Define once.** Every object is declared once. Views *select* from the catalogue; nothing is redeclared per picture.
2. **Semantic, not shapes.** `service`, `datastore`, `broker`, `gateway` — real patterns that map onto C4 levels.
3. **Relations are verbs.** `checkout writes payments_db` — a verb carries meaning an arrow loses.
4. **Contracts by pointer.** `exposes http openapi://checkout.yaml` — the address, not the content.
5. **Layout is not architecture.** Coordinates exist only inside `view`, and only when a human pinned them.
6. **Stable ids, free names.** The id is referenced; the display name is a string and may change at will.
7. **Minimal ceremony.** Three lines must produce a useful diagram, or nobody will replace Mermaid with this.

---

## 2. The smallest useful document

```archcode
service   checkout   "Checkout"      tech Go
datastore orders_db  "Orders DB"     tech PostgreSQL 16

checkout writes orders_db over SQL
```

Three lines, a real diagram, and enough semantics for a linter to say
*"a service writes a datastore directly — is that intended?"*

---

## 3. Grammar

### 3.1 Statements

A document is a sequence of statements, one per line, in any order. Six forms:

| form | example | where |
|---|---|---|
| declaration | `service checkout "Checkout" tech Go { … }` | §3.2 |
| attribute | `owner @team-payments` | §3.3, inside a body or on a declaration line |
| relation | `checkout writes orders_db over SQL` | §3.4 |
| interface | `exposes http openapi://checkout.yaml @9f3c2e1` | §4.3 |
| placement | `run checkout replicas 3 cpu 0.7/2` | §6.2, inside a placement block |
| version pragma | `archcode 0.2` | first line, optional (§17.8) |

Comments run from `#` to the end of the line. Blank lines, comments, spacing and the order of
everything are preserved: the parser keeps a lossless tree, and `parse → serialise` returns the
bytes it was given (§12).

### 3.2 Declaration form

```
<kind> <id> ["<display name>"] [<inline attributes>] [{ <body> }]
```

* `<kind>` — one of the object kinds in §4.1.
* `<id>` — a word: letters, digits, `_` and `-`, starting with a letter or `_`; case is significant (§17.7). Inside a body the id is local; the full id is the path from the root (`shop.checkout`, §17.1). A `topic` id may itself be dotted (`order.placed`) and is never prefixed.
* `"<display name>"` — optional; the id is shown when it is absent.
* Inline attributes follow on the same line. A body holds the rest — attributes, nested declarations, relations with the subject implied, `run` lines in placement blocks.
* A body opened and closed on one line (`{ transit  auth oidc }`) reads like the declaration line: several attributes side by side.

### 3.3 Attribute form

```
<key> <value>[, <value>…]
```

No `=`. Values are words, quoted strings, or numbers written as one token — `4Gi`, `180ms`,
`24x7`, `800Gi/mo`, `0.7/2`, `2026-12-01`. A value with spaces is quoted. Every attribute holds a
list; `tech Go, Gin` is a list of two, `tech "PostgreSQL 16"` a list of one.

**Several attributes on one line.** On a declaration line, and on a body line, a value list ends
where the next known key begins: `host app-01  ip 10.20.30.11  os "Debian 12"` is three attributes,
`dc dc1  vlan 3076` is two. The known keys are the ones in §4 and §6 (Appendix A lists them);
`data` is not one of them, because it is a sub-key of `disk` (`disk system 30Gi data 200Gi`).
Two keys keep their whole line: `at` (a moment with its own pairs, §6.3) and `capacity`
(open-ended pairs: `capacity rps 300 p99 250ms`). On a declaration line an *unknown* word also
starts a new attribute (`auth oidc`), while numbers and strings continue the value (`tech Go 1.21`).

**Flags.** `transit` is complete on its own: `{ transit  auth oidc }` sets `transit` and `auth`.

**Unknown keys** are kept and reported as information (`AC104`); keys starting with `x-` are yours
and never reported (§17.5).

Unit checking (seconds against gigabytes) is planned {{soon}}.

### 3.4 Relation form

```
[<subject>] <verb> <object> [over <protocol>] [via <transit>[, <transit>…]] [port <n>] [spec <pointer>] [as <name>] ["<label>"] [{ <body> }]
```

* `<verb>` — one of §4.2. A line whose first word is a *known attribute key* is an attribute even
  when its second word is a verb: `capacity calls 20000/day` is not a relation. A declared id or a
  dotted path as the first word is always a subject.
* `over` — the protocol, drawn on the arrow.
* `via` — the transit nodes the call passes through, in traffic order (`via waf, gw`). In the
  logical lens they fold into the label; in the infrastructure lens they become boxes on the way (§9.2).
* `port` — the number a firewall request asks for; drawn as `:5432` after the protocol.
* `spec` — a pointer to the contract the relation is bound by.
* `as` — a name, so a view or a decision can refer to this one relation (§17.3).
* `"<label>"` — free text, drawn instead of the protocol.
* the body holds attributes of the relation: `{ phase transit }`, `{ timeout 2s }`.

The subject may be omitted inside an object's body — it is the enclosing object:

```archcode
service checkout "Checkout" {
  writes payments_db over SQL      # subject implied
  calls  stripe      over HTTPS
}
```

At top level a relation needs a subject; `calls stripe` alone is reported (`AC101`).

---

## 4. Vocabulary

### 4.1 Object kinds × C4 level

| C4 | kinds | meaning |
|---|---|---|
| **L1 Context** | `system` · `external` · `actor` | your system · a third-party system · a human or role |
| **L2 Container** | `service` · `webapp` · `app` · `gateway` · `broker` · `datastore` · `cache` · `function` · `job` | the deployable building blocks; `app` is a mobile or desktop client |
| **L3 Component** | `component` | a module inside a container |
| **channel** | `topic` | a named message flow: `topic order.placed { via kafka  publisher checkout  subscriber billing }` |
| **placement** | `env` · `segment` · `cluster` · `managed` · `node` | where things run (§6) — frames on the deployment picture, never cards on the model |
| **document** | `arch` | the root of a document; a name and the document-wide attributes (`owner`, `domain`) |

A `system` with members renders as a C4 boundary; so does a container with components.
`contract` is accepted by the parser but has no semantics yet {{reserved v0.3}}.

**Transit.** A `gateway` or a `broker` marked `{ transit }` is transport: real, owned, with its own
failure — and noise on most pictures. The model records it once; the view's lens decides whether it
is drawn (§9.2). A `topic` is never drawn as a box: its `publisher`s and `subscriber`s get arrows,
labelled with the topic, passing `via` its broker.

**Ownership.** `datastore x { owned_by checkout }` keeps a store beside its service on every picture.

### 4.2 Relation verbs

`calls` · `publishes` · `subscribes` · `reads` · `writes` · `uses` · `streams` · `depends_on`

Sugar: `emits X` = `publishes X`, `listens X` = `subscribes X`.

### 4.3 Interface kinds → the standard each binds to {{v0.2}}

| kind | standard | example |
|---|---|---|
| `http` | OpenAPI | `exposes http openapi://checkout.yaml` |
| `event` | AsyncAPI | `emits orders.created via kafka spec asyncapi://orders.yaml` |
| `grpc` | proto | `exposes grpc proto://checkout.proto` |
| `sql` | schema / migrations | `stores schema sql://payments.dbml` |
| `graphql` | SDL | `exposes graphql sdl://api.graphql` |
| `cli` | — | `exposes cli` |

Pointer syntax: `<standard>://<path>[@<revision>]`.
The revision is the commit or migration the declaration was made against — a mismatch with the repository is **contract drift**, visible without reading a diff.

`exposes` and `stores` are **interface statements, not relations**: nothing stands on the other end, so nothing is drawn as an arrow. The form is `[subject] exposes|stores <kind> [<pointer>[ @rev]] ["label"] [{ attributes }]`; written inside an object's body the subject is that object, written at top level it names one (`checkout exposes graphql sdl://api.graphql`). `exposes cli` is a kind without a pointer. In the model they are the object's `interfaces`, in document order.

---

## 5. Worked example

```archcode
arch shop "Shop Platform" {
  owner  platform-team
  domain retail
}

actor customer "Customer"

system shop "Shop Platform" {
  criticality business_critical

  gateway api_gw "API Gateway" tech Envoy

  service checkout "Checkout Service" tech Go, Gin {
    description "Orchestrates the purchase flow."
    owner   payments-team
    tags    pci, tier-1
    repo    repo:acme/checkout

    exposes http  openapi://checkout.yaml @9f3c2e1
    emits   orders.created  via kafka  spec asyncapi://orders.yaml

    writes  payments_db  over SQL
    calls   stripe       over HTTPS  "authorise payment" { timeout 2s }

    capacity rps 1200  p99 180ms  burst 3x
  }

  service fulfillment "Fulfillment Service" tech Go {
    listens orders.created via kafka
    reads   payments_db over SQL
  }

  datastore payments_db "Payments DB" tech PostgreSQL 16 {
    stores schema sql://payments.dbml @0142
    pii       true
    retention 5y
    capacity  size 340Gi  growth 11Gi/mo
  }
}

broker   kafka  "Kafka"  tech Kafka
external stripe "Stripe" tech REST { owner external }

customer calls api_gw   over HTTPS
api_gw   calls checkout over gRPC
```

---

## 6. Deployment {{v0.2}}

Placement **references** a logical object; it never copies it.
One container deployed in four environments is described once.

### 6.1 Placement blocks

| kind | holds | meaning |
|---|---|---|
| `env` | `segment` · `cluster` · `managed` · `node` | an environment: `prod`, `stage`, `test` |
| `segment` | `segment` · `cluster` · `managed` · `node` | a network zone: `dmz`, `gray`, `lan`; may nest (`dmz ⊃ gray ⊃ lan`) |
| `cluster` | `node` | an orchestrator: Kubernetes / OKD / Swarm |
| `managed` | — | a service somebody else runs: RDS, a managed broker |
| `node` | — | a host: a VM, a physical server, a worker |

Placement blocks are drawn as frames on the **deployment** picture (§16.1) and never on the model picture.

```archcode
env prod "Production" {
  dc dc1   vlan 3076

  segment lan "LAN" {
    node app "Application VMs" count 2 cpu 12 mem 16Gi disk 300Gi {
      host app-01.internal.example   ip 10.20.30.11   os "Debian 12"
      run web_ui, contracts_api, notifier
      agent antivirus, grafana_alloy         # on every VM of this kind
    }
    node dbs "DB VMs" count 3 cpu 8 mem 12Gi {
      disk system 30Gi data 100Gi
      run contracts_db
    }
    node arm "ARM" cpu 12 mem 24Gi disk 500Gi gpu "RTX 4090" { run ollama }
    node mon "Monitoring VM" cpu 4 mem 8Gi { agent loki, grafana }   # nothing of the model runs here
  }

  cluster okd "OKD" nodes 3 cpu 8 mem 16Gi disk 30Gi {
    manifest k8s://deploy/checkout.yaml
    run checkout replicas 6 cpu 0.7/2 mem 800Mi/2Gi
  }

  managed rds "AWS RDS" {
    run payments_db  role "primary + 2 replica"  disk 2Ti
  }
}
```

`agent` is a list: the software installed on the host that is **not** part of the model — an antivirus, a metrics collector, a load balancer, a backup client. It is drawn as a row of small chips along the bottom of the host's frame (or card, when nothing of the model runs there), and a view can switch the row off with `agents off`. In a one-line body (`{ run s3  agent restic }`) the `run` takes only its sizing and phase; everything else belongs to the host.

### 6.2 `run` — the placement statement

```
run <ref>[, <ref>…] [<sizing>] [{ <body> }]
```

`<ref>` is a logical object. Sizing keys on a `run` describe **one replica**; on a `node` they describe **one host**.

| key | on | form |
|---|---|---|
| `count` | `node` | how many identical hosts — `x2`, `x3` in a slide |
| `nodes` | `cluster` | how many worker nodes of the stated size |
| `replicas` | `run` | how many copies |
| `cpu` | any | `2` · `0.7/2` (Kubernetes `requests/limit`) |
| `mem`, `disk` | any | `4Gi` · `800Mi/2Gi` · `2Ti` · `disk system 30Gi data 200Gi` |
| `gpu` | `node` | a count, or the card: `gpu "RTX 4090"` |
| `host`, `ip`, `os`, `agent` | `node` | what a firewall request or an ops handover asks for |

### 6.3 Sizing over time

Committees approve **starting** resources and **target** resources. Both live on the same line item:

```archcode
node app count 2 cpu 12 mem 16Gi {
  at 2026-12 count 3 cpu 16          # figures at a later moment; the rest carry over
}
```

`at <moment> <key> <value>…` — a date (`2026`, `2026-12`, `2026-12-01`) or an offset (`+1y`). Later moments overlay earlier ones. The resources table (§16.1 `kind capacity`) gets one column group per moment.

### 6.4 Resources table — a projection, never a slide

`view sizing { kind capacity }` sums, per environment and per moment:

* every `node` × its `count`;
* every `cluster` that states `cpu`/`mem` × its `nodes`;
* every sized `run` inside a `managed` service or an **unsized** cluster × its `replicas`.

Pods inside a **sized** cluster are listed as demand and not summed — the cluster row already counts that capacity. Memory and disk are normalised to GiB; `a/b` takes the limit `b`. A store with `capacity size 340Gi growth 11Gi/mo` adds a `· data` line under the environment it runs in — what it holds now and at each moment, projected by the growth; content, not sizing, so it is not summed into disk.

### 6.5 Phases — transit and target on one model

A defence usually shows two pictures: what ships next month and where it ends up. They are one model with `phase` marks, not two files:

```archcode
service kvell "Kvell" { phase transit }             # leaves in the target
broker  rabbit "RabbitMQ" { phase target }
ordering calls product_api over REST { phase transit }
ordering publishes orders via rabbit  { phase target }

view c2_transit "C2 — transit (2025)" { level container  phase transit }
view c2_target  "C2 — target (2026)"  { level container  phase target }
```

An object, relation or `run` without `phase` belongs to every phase. `phase` names are free; a document with phases offers a switch in every picture.

### 6.6 Ports and the network

A relation may carry `port <n>` after its protocol: `contracts_api calls nexus over HTTPS port 9001`. On the deployment picture the port is shown on the edge — the figure a firewall request is made of.

`segment` blocks may state a data policy: `segment dmz { data forbidden }`, `segment gray { data transient }`, `segment lan { data allowed }` — the legend every zone diagram carries, made checkable by a rule.

### 6.7 Non-functional keys

Standard keys, so that tooling can read them and a rule can require them: `availability 24x7` · `criticality business_critical | business_operational | mission_critical` · `rto 5m` · `rpo 1h` · `backup "weekly full + 7 daily incr"` · `capacity calls 20000/day`.

---

## 7. Decisions {{reserved v0.3}}

> **Status in v0.2:** reserved. The engine keeps a `decision` block byte for byte, reports it as `AC103` (info) and reads nothing inside it as objects or relations. The grammar below is the intent for v0.3.

```archcode
decision ADR-114 "Split warehouse reservation into its own service" {
  status  accepted
  date    2026-03-11
  author  n.baryshev
  affects checkout, inventory.reserve
  because "sale peaks take down the warehouse monolith; reservation must be synchronous under 200 ms"
  instead "cache stock in checkout — drifts from fact by 3–5 %"
  cost    "+3 pods, +1 schema, +1 on-call rotation"
  revisit 2027-01-01
}
```

`affects` is what makes impact analysis possible: the decisions that merely *reference* an object are
exactly the ones forgotten when that object changes.

---

## 8. Rules {{reserved v0.3}}

> **Status in v0.2:** reserved. The engine keeps a `rule` block byte for byte, reports it as `AC103` (info) and reads nothing inside it as objects or relations. The grammar below is the intent for v0.3.

```archcode
rule no_edge_to_db "The perimeter must not write datastores directly" {
  forbid   writes  from tag edge  to kind datastore
  severity error
}

rule owned "Every container has an owner" {
  require container.owner
  severity warn
}
```

Rules are declarative matches over the graph. Severity is `error` · `warn` · `info`.
A rule may be scoped to a maturity level so that adoption can be gradual (see ArchLens, not part of this spec).

---

## 9. Views — what a picture shows, and where things sit {{partial}}

A view never declares an object. It says which picture to draw, what to fold, and — only where a
human pinned something — where it sits. The Playground reads and writes one `view` block per
document; the lines below are its whole vocabulary.

```archcode
view c2 "Shop — containers" {
  kind   model                          # model | deployment | capacity  (§16.1)
  phase  target                         # one variant of the architecture, or `all` (§6.5)
  lens   logical                        # logical | infrastructure — is transit drawn? (§9.2)
  show   transit gw                     # one transit node opened in the logical lens
  hide   transit kafka                  # one folded in the infrastructure lens
  collapse fulfillment                  # a system shown as one box
  agents off                            # deployment: hide the agent chips on hosts
  layout rows aspect 1.78               # auto | rows | columns | compact [aspect n] — after `balance`
  at     checkout 460 210               # a pinned card; written only for cards a human moved
  size   shop 720 400                   # a frame held open (a floor — it still hugs its members)
  route  checkout calls billing from right 0.35 to left via 640 220, 640 380 label 0.3 below
  route  api_gw checkout auto           # this arrow stays with the engine
}
```

### 9.1 Pins and routes are all-or-nothing

Coordinates live only here, never on objects (§1). Moving one card pins every card on screen —
a single floating pin has nothing to hold on to. `unpin` releases everything back to the layout;
`balance` lays everything out for the screen's proportions and pins the result.

`route` is an arrow's memory: which side of each card it leaves and enters (`from`/`to`, with an
optional position along the side, 0…1), the bends it passes through (`via`, canvas coordinates),
where its label sits (`label`, 0…1 along the length, `below`/`left` for the other side of the line).
The verb may be omitted to address every relation between the pair. `auto` records the opposite
intention: let the engine route this one.

### 9.2 Lenses

| lens | transit (`gateway`/`broker` marked `transit`) | `via` chains |
|---|---|---|
| `logical` (default) | folded: the arrow goes straight to the target, the label says `via gw` | folded |
| `infrastructure` | drawn: a box on the way, arrows through it | drawn |

`show transit <id>` / `hide transit <id>` open or fold one node against the lens's default.

### 9.3 Planned view vocabulary {{soon}}

`level context|container|component`, `include <ref>` / `include tag <t>`, `group by tag <t>` (§17.6),
`kind sequence` with `path a → b → c`, `kind dataflow` with `mark pii`, `kind cascade` (§16.1),
and lenses `capacity | drift | ownership | maturity`. Several named views per document, and a `board`
that places them side by side (§16), come with them.

---

## 10. Identity and renames {{partial}}

The id is the reference; the display name is free text. A tool that renames an id rewrites every
reference in the document (the Playground's `rename` does), so a rename is one edit, not a hunt.

Recording a move so that history and drift survive it is reserved {{reserved v0.3}}:

```archcode
moved shop.reserve -> inventory.reserve since 2026-04-02
```

Old references would keep resolving; drift would report a move, not a deletion plus a creation.

---

## 11. Files {{partial}}

* A model is one or more `.arch` files, glob-merged. Order does not matter. *(v0.2 tools read one file; merging comes with the CLI.)*
* Ids are unique across the merged model.
* Convention: `arch/*.arch` at the repository root; `arch/context.arch`, `arch/<system>.arch`, `arch/envs.arch`, `arch/decisions.arch`.
* Unresolved import candidates live in the file itself as `# ? unresolved` comments, never in a side report.

---

## 12. Tooling contract {{soon}}

Anything calling itself an ArchCode implementation must satisfy:

1. **Round-trip.** `parse → serialise` is byte-identical for any valid document. Comments, blank lines,
   key order and indentation width are preserved as part of the tree.
2. **Canonical format.** `archcode fmt` output is stable and idempotent.
3. **Positioned errors.** Every parse error carries line, column and the expected token.
4. **Compiled form.** `archcode build` emits `arch.json` validating against the published JSON Schema.
   The JSON is a compilation artefact for tools, not a second authoring dialect.
5. **Conformance suite.** {{v0.2}} The spec ships positive and negative fixtures (`conformance/`, 28 valid + 14 invalid documents with expected model counts and diagnostics, `node run.mjs --engine <yours>`); an implementation states which it passes.

---

## 13. Explicitly out of scope

* Field-level API description — that is OpenAPI's job.
* Message payload schemas — AsyncAPI, Avro, JSON-Schema.
* Table and column definitions — DBML, SQL migrations.
* Infrastructure provisioning — Terraform, Helm, Pulumi.
* Code-level diagrams (C4 L4).

ArchCode points at all of these and restates none of them.

---

## 14. Open questions for v0.2

* Should `component` (L3) support nesting, or stay flat inside a container?
* Grammar strictness: how much may be omitted before a document becomes ambiguous?
* Whether `capacity` belongs in the core or in a profile extension.
* Single-file size limit before splitting becomes mandatory rather than advised.

---

## 15. Dialects — one fence, three inputs {{reserved}}

> **Status in v0.2:** the compact dialect is the only one the parser reads. The **YAML** and **JSON** tabs on every example in these docs show the *compiled form* (`arch.json`, `toYAML`/`toJSON` in the engine) — the same model as data, ids as full paths, every value a string. Reading YAML or JSON back as a source document is reserved; the authoring forms sketched below are the intent, not a contract.

A document may be written in any of three dialects. They are mechanically equivalent and
convert into one another without loss. The parser detects the dialect from the first
non-whitespace fragment:

```
{                       -> JSON
apiVersion: | <key>:    -> YAML
otherwise               -> compact
```

All three go inside the same fenced block, so no embedding surface ever needs to know which
one you used:

````
```archcode
service   checkout  "Checkout"   tech Go
datastore orders_db "Orders DB"  tech PostgreSQL 16
checkout writes orders_db over SQL
```
````

````
```archcode
apiVersion: archcode/v1
objects:
  - { id: checkout,  kind: service,   technology: [Go] }
  - { id: orders_db, kind: datastore, technology: [PostgreSQL 16] }
relations:
  - { from: checkout, to: orders_db, kind: writes, protocol: SQL }
```
````

**Documentation rule:** every example in the spec and on the site is shown in all three
dialects, the way Terraform shows HCL and JSON. Otherwise one dialect becomes second class
and the community splits.

**Exit rule (`ACL-5`):** if `compact → YAML → compact` is not byte-identical across the
conformance suite within two weeks of work, the compact dialect is dropped and YAML becomes
the only authoring form. The model does not change either way, so the cost of that reversal
is zero.

---

## 16. Boards — several views on one surface {{reserved v0.3}}

`view` produces one picture. `board` places several views side by side so they can be
discussed together. Three levels, nothing redefined at any of them:

```
model  →  view  →  board
```

### 16.1 View kinds {{partial}}

```archcode
view c2_orders    "Топология · Заказы"  { kind model       level container  include orders }
view prod_place   "Размещение"          { kind deployment  env prod }
view checkout_seq "Оформление заказа"   { kind sequence    path customer → api_gw → checkout → stripe }
view pii_routes   "Персональные данные" { kind dataflow    mark pii }
view est          "Оценки нагрузки"     { kind capacity    scope orders }
view impact_114   "Влияние ADR-114"     { kind cascade     from stock.reserve  waves 3 }
```

| `kind` | Draws | Derived from |
|---|---|---|
| `model` (default) | C4 objects and relations at a level | objects and relations |
| `deployment` | environments, segments, clusters, nodes; a card for every `run` | placement blocks (§6) |
| `sequence` | call order along a path | `path` over **declared** relations |
| `dataflow` | data routes, PII marking | `streams · writes · reads` + `pii` |
| `capacity` | the resources table: per environment, per moment, with totals (§6.4) | `node` · `cluster` · `run` sizing |
| `cascade` | impact waves from an object | relations + `affects` in decisions |
| `variants` | alternative configurations of the same objects | layouts, not copies |
| `sketch` | free-form drawing | nothing — this is not the model |

### 16.2 Grid board

> **Status in v0.2:** `board` is reserved — kept as written, reported as `AC103`, not rendered.

```archcode
board review "Вынос резерва — обсуждение" {
  layout grid 2 x 2

  panel "Топология"         { view c2_orders     cell 0 0 }
  panel "Размещение"        { view prod_place    cell 1 0 }
  panel "Оформление заказа" { view checkout_seq  cell 0 1 }
  panel "Черновик"          { sketch shards      cell 1 1 }

  note at "Размещение" "здесь p99 растёт — почему?"
}
```

### 16.3 Free board — for discussion and interviews

```archcode
board interview "Собеседование · сокращатель ссылок" {
  layout free

  panel "Оценки"     { view est          at   40  40  size 420 300 }
  panel "Топология"  { view c2_draft     at  500  40  size 760 520 }
  panel "Сценарий"   { view write_path   at   40 380  size 420 380 }
  panel "Размещение" { view prod_draft   at  500 600  size 760 340 }
  panel "Черновик"   { sketch sharding   at 1300  40  size 400 400 }
}
```

### 16.4 The four mechanics boards rest on

1. **Cross-panel highlighting is automatic.** Selecting an object in one panel highlights it in
   every panel that contains it. Nothing is declared — it is the same `id`. This is the reason
   to put views side by side, and no existing tool does it, because none of them has a shared
   model underneath the pictures.
2. **A panel cannot lie.** A sequence step is a *declared* relation. A step that does not exist
   in the model is a parse error. The sequence diagram physically cannot contradict the topology.
3. **`sketch` is the only place for free drawing.** Explicitly marked, never exported into
   projections, ignored by rules, and carries a "promote into the model" action.
4. **A board is presentation, not architecture.** Same discipline as `view`: coordinates only on
   explicit pinning. Convention: `boards/*.arch`.

---

## 17. Semantics — the ten binding decisions

These are the places where a wrong choice costs a parser rewrite, not an edit.
Several of them deliberately diverge from Structurizr; each divergence is noted.

### 17.1 Identifier scope — hierarchical, always

Ids are scoped to their parent. A short reference resolves from the current scope outward
to the root, then by suffix anywhere in the model. Ambiguity is reported with every candidate
(`AC102`) and the model keeps the first; it becomes an error in v0.3.

```archcode
system orders "Orders" {
  service api    "Orders API"      # full id: orders.api
  service worker "Orders Worker"   # full id: orders.worker
  api calls worker                 # short form resolves in scope
}

system stock "Stock" {
  service api "Stock API"          # full id: stock.api — no collision
}

orders.api calls stock.api         # from outside: full path only
```

*Diverges from Structurizr:* they offer `!identifiers flat | hierarchical`, a directive that
changes name resolution file-wide. It carries five dedicated test files and is the most fragile
part of their language. A mode that changes reference semantics is two languages in one.

### 17.2 Derived relations — computed at render, never written {{v0.2}}

A relation declared between containers appears on the system-level diagram as an **aggregated,
visibly derived** edge. It is never added to the model and never serialised.

* If all constituent relations share a verb, the aggregate shows that verb.
* If they differ, the aggregate shows a count and no verb — writing `orders calls payments`
  when one relation is `calls` and another is `publishes` would be a lie.
* An explicitly declared relation at that level suppresses the derived one; the count remains.

In the Playground: collapse a system (`collapse orders`) and its card says `3 inside`; the arrows into it read `calls ×2` when the verbs agree and `3 relations` when they do not.

*Diverges from Structurizr:* their `!impliedRelationships` writes implied relations **into the
model**. That is impossible for us — byte-exact round-trip is a product invariant (§12.1),
and a parser that emits what the text never contained breaks it on day one.
**Implication is a property of the view, not of the model.**

### 17.3 Relation identity {{partial}}

Identity is the tuple `(from, to, verb, label)`. An exact duplicate will be an error naming both
lines (not reported yet). A relation may carry an optional name (`as`) so views, decisions and rules
can reference it.

```archcode
checkout calls payments.api as auth   "authorise payment" { timeout 2s }
checkout calls payments.api as refund "refund"            { timeout 5s }

view checkout_seq { kind sequence  path customer → api_gw → checkout via auth }
decision ADR-114 { affects refund, payments.api }
```

### 17.4 Stage — and strictness as a function of it {{partial}}

```archcode
service refunds "Refunds" { stage sketch }
```

| `stage` | Validation | In projections | In views |
|---|---|---|---|
| `sketch` | none at all | no | dashed |
| `proposed` | soft, warnings only | no | dashed |
| `approved` | full | yes | normal |
| `live` (default) | full | yes | normal |
| `deprecated` | full | yes, marked | dimmed |
| `retired` | none | no | hidden by default, kept in the model |

This is what makes the validator quiet: a sketch cannot be scolded for having no owner —
it is a sketch. And `approved` cannot be set while the level's profile is unmet.

> **Status in v0.2:** the drawing and the quiet validator are in — `sketch` and `proposed` draw dashed, `deprecated` dimmed, `retired` is kept in the model and left off the picture; diagnostics under a `sketch` or `retired` declaration are dropped, under `proposed` errors become warnings. "In projections" and the `approved`/profile gate wait for profiles (v0.3).
Default is `live` because most people describe systems that exist; the canvas's Hypothesis
mode sets `sketch` automatically on everything drawn in it.

### 17.5 Unknown keys — attributes survive, blocks do not

* **Unknown attribute** → warning. Value preserved verbatim in the CST, survives round-trip
  byte-exactly, lands in `arch.json` under the extensions section.
* **`x-` prefix** → reserved for vendor extensions, never warned about (the OpenAPI pattern).
* **Reserved block kind** (`rule`, `decision`, `board`, `profile`) → kept byte for byte, reported as
  information (`AC103`), nothing inside is read as objects or relations. The same holds for the body
  of a `view`: its lines are the view's own vocabulary (§9).
* **Unknown block kind** → the line is not a declaration; at top level it is reported (`AC104`).
  A block defines structure; a parser cannot know how to nest what it does not understand.

Without this rule the language cannot evolve: any file written for 0.3 would break in a 0.2 parser.

### 17.6 No groups — tags, and `group by` in views {{partial}}

```archcode
service   checkout  "Checkout"   tech Go { tags pci, tier-1, team.payments }
datastore cards_db  "Card vault"         { tags pci, tier-1 }

view pci_zone "PCI zone" { kind model  include tag pci }
view by_team  "By team"  { kind model  group by tag team.* }
```

Tags compose; nested groups do not. An object is simultaneously in the PCI zone, in tier 1 and
owned by the payments team — trivial with tags, inexpressible as a nesting hierarchy.
Structurizr's `group` maps to a tag on import and back to a group on export; nothing is lost.

### 17.7 Case is significant

`checkout` and `Checkout` are different objects, as in any programming language.
`lower_snake` is a **linter rule, not grammar** — `archcode lint` will say the id is not lowercase,
but the file parses. Grammar must not enforce style.

*Diverges from Structurizr:* they are case-insensitive and lowercase ids internally, so `webApp`
and `WEBAPP` are one element and a re-declaration produces a surprising "identifier already in use".
On import we normalise to lowercase and warn if the normalisation creates collisions.

### 17.8 Language version in the file

```archcode
archcode 0.2
```

Optional, and only meaningful as the first statement (`AC105` otherwise). Absent means "the latest
version this parser knows". A version the engine does not know is reported (`AC105`) — the file is
still parsed, so the reader sees what it can. `archcode fmt --upgrade`, rewriting a file to a newer
version, comes with the CLI {{soon}}.

### 17.9 The rule language is deliberately small and closed {{reserved v0.3}}

```archcode
rule owned "Every container has an owner" {
  require  container.owner
  when     stage in (approved, live)
  severity warn
}

rule no_edge_to_db "The perimeter must not write datastores directly" {
  forbid   writes  from tag edge  to kind datastore
  severity error
}
```

| Clause | Accepts |
|---|---|
| `require` | `<kind>.<attribute>` — the attribute must be present |
| `forbid` | `<verb> from <selector> to <selector>` |
| `when` | scope condition: `kind`, `tag`, `owner`, `stage in (...)`, `in <ref>`, joined by `and` / `or` |
| `severity` | `error · warn · info` |

No arithmetic, no functions, no nested expressions. The moment a rule language gains computation
it becomes a program — to be debugged, versioned and protected from infinite loops.
**Anything not expressible as a match is a detector, not a rule**, and detectors are written
in a real language and live outside the notation.

### 17.10 Diagnostics — a broken file still yields a model {{v0.2}}

| Level | When | Model |
|---|---|---|
| `error` | syntax · duplicate id · `at` without a moment · `run` outside a placement block | broken statement excluded, the rest builds |
| `warning` | unresolved or ambiguous reference · relation without a subject at top level · relation between placement blocks · `run` of something that cannot run · unknown `archcode` version | builds fully; an unresolved arrow is not drawn |
| `info` | unknown attribute (`x-…` keys are silent) · reserved block kind kept as written | builds fully |

Codes as the engine reports them (v0.2): `AC001`–`AC005` syntax (parser) · `AC100` duplicate id · `AC101` unresolved reference · `AC102` ambiguous reference — several objects end in that name, write the path · `AC103` reserved block (`rule`, `decision`, `board`, `profile`) · `AC104` unknown attribute · `AC105` `archcode <version>` pragma · `AC106` `at` without a moment · `AC107` relation between placement blocks · `AC108` `run` outside a placement block · `AC109` `run` of an actor, external or topic.

This is a requirement, not a convenience: the canvas holds the last valid tree and freezes only
the broken subtree, so the parser must return a **partial model plus a diagnostics list**, never
throw on the first error. Every diagnostic carries line, column and the expected token — without
coordinates the editor cannot highlight anything.

---

## Appendix A. Grammar (compact dialect) {{draft}}

The reference parser is hand-written; this grammar mirrors it and is kept in step with `vocab.ts`.
Not yet machine-verified — the next step is a conformance suite run through an executable grammar.

```ebnf
document      = [ version-pragma ] , { statement } ;
version-pragma= "archcode" , version , NEWLINE ;

statement     = declaration | attribute | relation | interface | placement | comment ;

declaration   = kind , ident , [ string ] , { attribute } , [ block ] ;
kind          = c1-kind | c2-kind | c3-kind | channel-kind | placement-kind | doc-kind | reserved-kind ;
c1-kind       = "system" | "external" | "actor" ;
c2-kind       = "service" | "webapp" | "app" | "gateway" | "broker"
              | "datastore" | "cache" | "function" | "job" ;
c3-kind       = "component" ;
channel-kind  = "topic" ;
placement-kind= "env" | "segment" | "cluster" | "managed" | "node" ;
doc-kind      = "arch" ;
reserved-kind = "view" | "decision" | "rule" | "board" | "profile" | "contract" ;
                (* the body of a reserved kind is kept as text; `view` has its own vocabulary, §9 *)

block         = "{" , { statement } , "}" ;               (* one line or many; on one line, attributes sit side by side *)

attribute     = key , [ value-list ] ;                     (* a flag key takes no value: `transit` *)
key           = ident | "x-" , ident ;
value-list    = value , { "," , value } ;
value         = word | string | quantity | pointer ;
quantity      = digit , { letter | digit | "." | "/" | "-" } ;   (* one token: 4Gi · 0.7/2 · 800Gi/mo · 24x7 · 2026-12 *)
pointer       = scheme , "://" , path , [ "@" , revision ] ;

relation      = [ ref ] , verb , ref , { rel-modifier } , [ string ] , [ block ] ;
verb          = "calls" | "publishes" | "subscribes" | "reads" | "writes"
              | "uses"  | "streams"   | "depends_on" | "emits" | "listens" ;
rel-modifier  = ( "over" , value ) | ( "via" , ref , { "," , ref } ) | ( "port" , quantity )
              | ( "spec" , pointer ) | ( "as" , ident ) ;

interface     = [ ref ] , ( "exposes" | "stores" ) , ident , [ pointer , [ "@" , revision ] ] , [ string ] , [ block ] ;

placement     = "run" , ref , { "," , ref } , { sizing } , [ block ] ;   (* only inside a placement-kind body *)
sizing        = ( "replicas" | "count" | "nodes" | "cpu" | "mem" | "disk" | "gpu" | "phase" ) , value-list
              | moment ;
moment        = "at" , when , { key , value-list } ;       (* `at 2026-12 cpu 12 mem 24Gi`; also an attribute of hosts *)

ident         = ( letter | "_" ) , { letter | digit | "_" | "-" } ;
ref           = ident , { "." , ident } ;
string        = '"' , { character - '"' | '\"' } , '"' ;
comment       = "#" , { character - NEWLINE } ;
```

**Known attribute keys** (they end the value list before them on a shared line, §3.3):
`tech owner tags criticality retention pii stage description repo domain capacity availability rto rpo backup
phase scope code replicas count nodes cpu mem disk gpu host ip os agent region dc vlan data manifest role
auth ratelimit transit owned_by publisher subscriber via`.

**Reserved for v0.3:** `moved` (§10), the `rule` body (§17.9), `decision` (§7), `board` (§16).

**Deliberately absent:** computation, functions, conditional generation, remote includes, scripts.
Structurizr has `!script` and `!plugin` executing arbitrary Groovy, Kotlin, JS or Ruby — an
unacceptable surface for a language read in pull requests and parsed in a browser.

**File inclusion exists but stays simple:** a model is a set of files glob-merged
(`arch/*.arch`), with no include directive inside files. Merge order does not affect the result.

---

## Appendix B. Deliberately still open

1. **Time in the model.** `stage` describes an object's state, not "it was like this in Q3".
   Planned versus current is either `since` / `until` attributes or two git branches.
   Leaning towards git: it already knows about time, and duplicating that in the language is a mistake.
2. **C3 component nesting** — flat list inside a container, or a tree? Flat for now, untested on
   a live model with sixty components.
3. **Where one file breaks** — a forty-container system is around a thousand lines.
   The `horizon` import (1434 lines) will tell us whether splitting must be mandatory.
4. **`contract` as its own block kind.** Today `exposes http openapi://...` is a container
   attribute. A separate block with version and status is needed when two containers publish the
   same contract — a rare case, deferred to v0.3.
