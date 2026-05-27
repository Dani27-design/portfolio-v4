# Gimmick Text Reduction Plan V2

## Context
Follow-up audit after completing all 10 phases of the original plan. Found **31 remaining decorative text instances** across section/layout/game components and gimmick background components.

---

## Category A: REMOVE — Section/Layout/Game Components

These are in real content areas and create noise for visitors:

| # | Text | File | Line | Visibility | Why Remove |
|---|------|------|------|-----------|------------|
| 1 | `ALL_RIGHTS_RESERVED // SYS_INTEGRITY_ACK - [V4.4.2-LDP]` | Footer.tsx | 39 | Always visible (7px) | Fake system code appended to real copyright. Should be normal copyright text. |
| 2 | `Ready for secure transit. All packets are encrypted via high-integrity protocols. Local latency: 0.05ms` | Contact.tsx | 165 | XL only (7px) | Fake security jargon in an info box nobody reads |
| 3 | `SIM_STABLE` | SkyForceGame.tsx | 1098 | Always visible (7px) | Fake game engine status |
| 4 | `DRIVER: CANVAS_2D` | SkyForceGame.tsx | 1101 | Always visible (7px) | Fake driver label |
| 5 | `BUILD_VERSION_8.0.4` | SkyForceGame.tsx | 1104 | Always visible (7px) | Fake build version |

---

## Category B: REMOVE — Gimmick Background Components

Text labels baked into animated background decorations. At 5-10px, extremely low opacity, zero value — only visual noise if anyone notices them. The visual animations (shapes, lines, pulses) work fine without text labels.

| # | Text | File | Line | Why Remove |
|---|------|------|------|------------|
| 6 | `BRIDGE_NODE_0{i}` (×6) | NeuralBridgeGimmick.tsx | 49 | 6px, 40% opacity on 10% opacity parent |
| 7 | `BRIDGE_STATE` + `LISTEN_MODE` | NeuralBridgeGimmick.tsx | 114, 120 | 8-10px, 40% opacity, XL only |
| 8 | `Sector_01: Integrity_Core` | SystemGimmick.tsx | 85 | 10px, 45% opacity, inside spinning shape |
| 9 | `Coord_Ref: X-772 / Y-991` | SystemGimmick.tsx | 88 | 10px, 45% opacity |
| 10 | `SECURE_{i}` (×5) + hex codes | SystemGimmick.tsx | 111-113 | 9px, 45%/15% opacity, XL only |
| 11 | `ENTRY_PARSER_0{i}` (×3) | LogStreamGimmick.tsx | 87 | 8px, inside 30% opacity floating boxes, XL only |
| 12 | `Buffer_Read: OK / Status: Indexing_Logs...` | LogStreamGimmick.tsx | 99-100 | 6px, 20% opacity |
| 13 | `Documentation_Stream :: Trace_Ref_0{i}...` (×10) | LogStreamGimmick.tsx | 128 | 9px, 10% opacity scrolling rail |
| 14 | `NODE::{i}` (×10) | ServiceClusterGimmick.tsx | 118 | 8px, on floating hexagons |
| 15 | `Global_Sync` + `Operational / Optimal` | ServiceClusterGimmick.tsx | 155-156 | 10px/7px, XL only |
| 16 | `Cluster_Load: Nominal` | ServiceClusterGimmick.tsx | 172 | 9px, XL only |
| 17 | `[{hex}]` coordinate labels (×64) | ServiceClusterGimmick.tsx | 33 | 6px, 30% of 8% opacity |
| 18 | `SEQ_{i}` (×4) + `Tracing...` | TacticalTrajectoryGimmick.tsx | 53, 59 | 7px/5px, XL only |
| 19 | `SCANRAW` | TacticalTrajectoryGimmick.tsx | 110 | 7px, moving label |
| 20 | `REALTIME_ANALYSIS` | TacticalTrajectoryGimmick.tsx | 118 | 10px, 20% opacity, 2XL only |
| 21 | `DEPLOYMENT_STABILITY` | TacticalTrajectoryGimmick.tsx | 126 | 10px, 20% opacity, 2XL only |
| 22 | `Module_Ref: Core_Engine` | ArchitectureSchematicGimmick.tsx | 33 | 8px, inside floating blueprint |
| 23 | `Cluster_Deployment: Node_LTS` | ArchitectureSchematicGimmick.tsx | 44 | 8px, inside floating blueprint |
| 24 | `Integrity_Check: Verified` | ArchitectureSchematicGimmick.tsx | 111 | 10px, md+ only |
| 25 | `System_Load: 0.04ms / Optimized` | ArchitectureSchematicGimmick.tsx | 117 | 9px, md+ only |
| 26 | `Topology_Map: Node_Cluster_Delta` | NetworkTopologyGimmick.tsx | 105 | 9px, lg+ only |
| 27 | `Lat: 0.12ms` + `Cluster: Sync_Active` | NetworkTopologyGimmick.tsx | 111, 115 | 8px, XL only |
| 28 | `SEC_0{i}` (×4) | MobileMenuGimmick.tsx | 42 | 6px, 15% opacity |
| 29 | `Status_Nominal` + `Enc: AES_256_V2 / Sig: OK` | MobileMenuGimmick.tsx | 53-57 | 7px/5px, 20% opacity |
| 30 | `SYS_ACK_NULL` | MobileMenuGimmick.tsx | 62 | 8px, 20% opacity |
| 31 | `[ 00 00 01 ] / [ FF 00 X1 ]` | MobileMenuGimmick.tsx | 68-69 | 7px, 5% opacity |

---

## Category C: KEEP — Functional or Real Content

| # | Text | File | Why Keep |
|---|------|------|----------|
| 1 | `LOG_DATE: {date}` | Blog.tsx, BlogListPage.tsx | Real data |
| 2 | `LOG_TYPE :: TECHNICAL_LOG` / `STATUS :: DEPLOYED` | BlogDetailsPage.tsx | Contextual badges |
| 3 | `[01] PRODUCTION` | Projects.tsx, ProjectListPage.tsx | Card indexing |
| 4 | `Secure_Endpoint:` / `Response_Time: <24h` | Contact.tsx | Functional labels |
| 5 | `Sys_Diagnostics` | Contact.tsx | Section label |
| 6 | `Distributed_Eng` / `Security_First` / `High_Performance` | HireMeBanner.tsx | Real skill tags |
| 7 | `BACK_TO_ROOT` / `RETURN_TO_ARCHIVES` | Various | Navigation labels |
| 8 | `DANIANSYAH_CORE` | BlogDetailsPage.tsx | Author name |
| 9 | Game HUD labels (score, high score, leaderboard) | SkyForceGame.tsx | Functional game UI |
| 10 | Owner name + role | Footer.tsx | Real identity |
| 11 | Copyright `© {year}` | Footer.tsx | Legal (the appended system code is noise — item #1 above) |

---

## Execution Plan

### Phase 1: Footer Copyright Cleanup
- **Footer.tsx:39** — Replace `ALL_RIGHTS_RESERVED // SYS_INTEGRITY_ACK - [V4.4.2-LDP]` with clean copyright text

### Phase 2: Contact Side Panel Cleanup
- **Contact.tsx:163-167** — Remove the fake security transit paragraph box

### Phase 3: Game Footer Metadata Cleanup
- **SkyForceGame.tsx:1093-1105** — Remove the SIM_STABLE / DRIVER / BUILD_VERSION footer bar

### Phase 4: NeuralBridgeGimmick Text Removal
- **NeuralBridgeGimmick.tsx:49** — Remove `BRIDGE_NODE_0{i}` labels from constellation nodes
- **NeuralBridgeGimmick.tsx:105-125** — Remove Tactical Status Ring text (BRIDGE_STATE, LISTEN_MODE) — keep the spinning ring visual

### Phase 5: SystemGimmick Text Removal
- **SystemGimmick.tsx:79-90** — Remove Technical Annotations div (Sector_01, Coord_Ref)
- **SystemGimmick.tsx:100-116** — Remove Floating Tactical Data section (hex codes, SECURE_ labels)

### Phase 6: LogStreamGimmick Text Removal
- **LogStreamGimmick.tsx:86-101** — Remove text from Scanning Parsers (ENTRY_PARSER, Buffer_Read, Status labels) — keep the animated boxes and progress bars
- **LogStreamGimmick.tsx:120-131** — Remove Moving Text Rails section entirely

### Phase 7: ServiceClusterGimmick Text Removal
- **ServiceClusterGimmick.tsx:31-35** — Remove coordinate hex labels from grid
- **ServiceClusterGimmick.tsx:117-119** — Remove `NODE::{i}` labels from floating clusters
- **ServiceClusterGimmick.tsx:151-174** — Remove Precision Telemetry HUD text (Global_Sync, Operational, Cluster_Load) — keep the animated bars

### Phase 8: TacticalTrajectoryGimmick Text Removal
- **TacticalTrajectoryGimmick.tsx:52-60** — Remove SEQ_ labels and Tracing text from HUD brackets — keep the visual bracket lines
- **TacticalTrajectoryGimmick.tsx:110** — Remove SCANRAW label — keep the moving element
- **TacticalTrajectoryGimmick.tsx:116-137** — Remove Center Operational HUD text (REALTIME_ANALYSIS, DEPLOYMENT_STABILITY) — keep the animated bars

### Phase 9: ArchitectureSchematicGimmick Text Removal
- **ArchitectureSchematicGimmick.tsx:33** — Remove `Module_Ref: Core_Engine` label
- **ArchitectureSchematicGimmick.tsx:44** — Remove `Cluster_Deployment: Node_LTS` label
- **ArchitectureSchematicGimmick.tsx:106-120** — Remove Tactical HUD Overlays text (Integrity_Check, System_Load) — keep the accent lines

### Phase 10: NetworkTopologyGimmick Text Removal
- **NetworkTopologyGimmick.tsx:103-117** — Remove both text blocks (Topology_Map, Lat, Cluster)

### Phase 11: MobileMenuGimmick Text Removal
- **MobileMenuGimmick.tsx:41-43** — Remove `SEC_0{i}` labels — keep the dot markers
- **MobileMenuGimmick.tsx:49-65** — Remove bottom status bar text (Status_Nominal, Enc, Sig, SYS_ACK_NULL) — keep the border line
- **MobileMenuGimmick.tsx:67-70** — Remove hex byte labels
