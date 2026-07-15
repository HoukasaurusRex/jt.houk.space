# Peer Feedback Level Calibration

## Context

The `peer-feedback` script generates AI-written peer review answers from journal entries and Slack evidence. Today the prompt treats every subject identically, but what counts as "doing well" or a meaningful growth area depends heavily on the colleague's seniority. Praising a junior for shipping independently lands well; the same praise for a staff engineer reads as faint or off-base. This change adds an optional `--level` flag that calibrates both the expectations bar and the tone of the generated feedback.

## Goals

- Accept an optional `--level` enum to tune feedback for the subject's seniority.
- Adjust both the **expectations bar** (what counts as praise vs. growth) and the **tone** (developmental vs. peer-strategic).
- Stay fully backward compatible: omitting `--level` produces today's output verbatim.

## Non-goals

- Function/discipline (PM, design, EM), tenure, or reporting relationship. Seniority only.
- Free-form role text. The flag is a strict enum.
- Changing the two feedback questions or output format.

## CLI

Add to [src/peer-feedback.ts](src/peer-feedback.ts):

```
--level <junior|mid|senior|staff|principal>   (optional)
```

- Omitted → no calibration injected.
- Invalid value → print valid options and exit non-zero.
- Usage string updated to include the new flag.

## Templates

New directory: `src/templates/peer-feedback-calibration/` with one file per level:

- `junior.md`
- `mid.md`
- `senior.md`
- `staff.md`
- `principal.md`

Each file is a self-contained `<calibration>` block with two short sections:

1. **Expectations bar** — what merits praise and what counts as a growth area at this level.
2. **Tone** — how the voice should land (developmental → peer-strategic as level rises).

### Example: `senior.md`

```md
<calibration>
The subject is a senior engineer.

Expectations bar:
- Independent ownership of medium-scope projects is table stakes, not praise-worthy on its own.
- Praise belongs to: cross-team influence, mentorship that visibly lifts others, technical judgment under ambiguity, and unblocking peers.
- Growth areas should push toward staff-level patterns: setting scope, owning ambiguity, technical strategy beyond their immediate project.

Tone:
- Peer-to-peer and candid. Skip "great job ramping up" framing.
- Constructive growth areas should be specific and challenging, not gentle.
</calibration>
```

### Example: `junior.md`

```md
<calibration>
The subject is a junior engineer.

Expectations bar:
- Shipping independently, asking sharp questions, and producing clean PRs are praise-worthy.
- Growth areas should be concrete habits (code review depth, scoping their own work, escalating earlier), not abstract leadership skills.

Tone:
- Warm and developmental, but specific. Encourage without being parental.
- Avoid framing growth areas as deficiencies; frame them as the next rung.
</calibration>
```

Other levels follow the same shape, calibrated accordingly.

### System prompt change

In [src/templates/peer-feedback.system.md](src/templates/peer-feedback.system.md), insert a `{{levelCalibration}}` placeholder between `<task>` and `<rubric>`:

```md
</task>

{{levelCalibration}}

<rubric>
```

When `--level` is omitted the placeholder renders as an empty string, preserving today's output exactly.

## Implementation sketch

In `peerFeedback()`:

```ts
const VALID_LEVELS = ['junior', 'mid', 'senior', 'staff', 'principal'] as const
type Level = (typeof VALID_LEVELS)[number]

// after parseArgs
const level = values.level as Level | undefined
if (level && !VALID_LEVELS.includes(level)) {
  console.error(`Invalid --level. Must be one of: ${VALID_LEVELS.join(', ')}`)
  process.exit(1)
}

const levelCalibration = level
  ? await fs.readFile(
      path.join(process.cwd(), 'src/templates/peer-feedback-calibration', `${level}.md`),
      'utf-8',
    )
  : ''

const system = await loadTemplate('peer-feedback.system.md', {
  name,
  periodStart,
  periodEnd,
  levelCalibration,
})
```

Reuses existing utilities: `parseArgs`, `loadTemplate`, `fs.promises.readFile`. No new dependencies.

## Files touched

- [src/peer-feedback.ts](src/peer-feedback.ts) — new flag, validation, calibration load, extra template var.
- [src/templates/peer-feedback.system.md](src/templates/peer-feedback.system.md) — insert `{{levelCalibration}}` placeholder.
- `src/templates/peer-feedback-calibration/{junior,mid,senior,staff,principal}.md` — new partials.

## Verification

- `yarn tsc --noEmit` (or project equivalent) passes.
- Run without flag → output unchanged from current behavior (smoke test against a known subject).
- Run with `--level junior` and `--level staff` for the same subject → confirm differing bar and tone in the generated answers, and confirm the `<calibration>` block appears in the system prompt sent to the model (log/inspect if needed).
- Run with `--level bogus` → exits non-zero with the valid-options message.
