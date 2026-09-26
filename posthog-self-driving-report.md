# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for this web application. Session Replay, Error Tracking, and Support were enabled; health, error-tracking, and support signal sources were enabled; and Replay Vision monitors plus a selective scout troop were configured.

Findings will begin appearing in the [Self-driving inbox](https://us.posthog.com/project/592485/inbox) within about 30 minutes as new data arrives and scouts run.

## AI data processing

Approved by the wizard’s organization-level gate.

## GitHub

Connected before this setup run through the PostHog GitHub App.

## Products enabled

| Product | Result | Notes |
|---|---|---|
| Session Replay | Enabled | Browser SDK initialization does not disable session recording. No recordings were present during setup. |
| Error Tracking | Enabled | Browser SDK initialization explicitly captures exceptions. No active issues were present during setup. |
| Support | Enabled | Support tickets require an inbound email, inbox, or Slack channel before data arrives. |

## Signal sources

| Signal source | Action | Notes |
|---|---|---|
| `health_checks` / `health_issue` | Enabled | Created for setup and instrumentation health findings. |
| `error_tracking` / `issue_created` | Enabled | Created. |
| `error_tracking` / `issue_reopened` | Enabled | Created. |
| `error_tracking` / `issue_spiking` | Enabled | Created. |
| `conversations` / `ticket` | Enabled | Created; dormant until an inbound Support channel is connected. |
| `signals_scout` / `cross_source_issue` | Skipped | Scout findings are enabled by default; no opt-out row exists. |
| Session replay source | Skipped | Replay coverage is supplied by the Replay Vision monitors below; the retired session-analysis source was not created. |
| `replay_vision` source | Skipped | Replay Vision is self-authorizing through each scanner’s `emits_signals` setting. |

## Connected tools

No external connected tools were selected. No external warehouse sources or connected-tool responders were created.

## Scout troop

**Run budget:** 100 runs/day; 0 used at setup time; 100 remaining. The current announcement says scouts are early access and requests for more capacity can be made through the Self-driving team.

### Active scouts

| Scout | Why it is active |
|---|---|
| General | Watches cross-product correlations and surfaces not owned by a specialist. |
| Product analytics | The application captures course discovery and learning engagement interactions. |
| Learning discovery handoff | Custom scout for the product-specific discovery-to-lesson journey. |
| Learner continuation | Custom scout for changes after course or lesson entry. |

### Disabled built-in scouts

| Scout | Why it is disabled |
|---|---|
| AI observability | No confirmed LLM observability data. |
| Anomaly detection | No active saved insight or dashboard evidence was available. |
| APM | No confirmed tracing surface. |
| Conversations | Support has no inbound channel or ticket activity yet; the native support source is enabled. |
| CSP violations | No configured CSP reporting was found. |
| Customer analytics | No confirmed account or group analytics surface. |
| Data pipelines | No confirmed CDP, batch-export, or workflow surface. |
| Data warehouse | No connected warehouse source was selected. |
| Error tracking | Covered by native Error Tracking signal sources. |
| Experiments | No active experiment evidence. |
| Feature flags | No active flag evidence. |
| Inbox validation | No resolved Self-driving reports exist yet to validate. |
| Insight alerts | No configured alert evidence. |
| Logs | No confirmed PostHog Logs usage. |
| MCP tool calls | No confirmed product MCP telemetry surface. |
| Observability gaps | Kept off to retain a focused initial troop. |
| PR follow-up | No established Self-driving report and merge history yet. |
| Replay Vision | New monitors have no accumulated observations yet. |
| Revenue analytics | No payment or revenue integration evidence. |
| Session replay | Covered by the Replay Vision monitors below. |
| Skills store | Not a product surface for this setup. |
| Surveys | No surveys exist. |
| Tasks | No confirmed PostHog Tasks usage. |
| Web analytics | No confirmed traffic or attribution usage evidence. |
| Web vitals | No confirmed web-vitals usage evidence. |

## Custom scouts

| Scout | What it watches | Report discriminator | Why it adds coverage |
|---|---|---|---|
| `signals-scout-learning-discovery-handoff` | Search or course browsing through course and lesson entry. | The share of people reaching a course or lesson falls materially while upstream discovery remains steady. | It directly follows the product’s learner journey in `HeroSearch`, `CourseCardItem`, `CourseContentAccordion`, and `CourseHero`; the enabled product-analytics scout has broader, partial coverage. |
| `signals-scout-learner-continuation` | Continuation after course or lesson entry, including learning actions and saved interest. | Continuation falls materially while discovery and entry remain broadly stable. | It targets a product-specific post-entry behavior not owned by another active specialist. |

Surfaces considered and ruled out: error tracking and session replay are already covered by their dedicated native and Replay Vision routes; AI, revenue, surveys, logs, experiments, flags, CSP, and data-pipeline surfaces lacked evidence of current use.

If either custom scout becomes noisy, set its configuration’s `emit` value to `false` in PostHog to switch it to dry-run without disabling its analysis.

## Replay Vision scanners

A Replay Vision scanner is an LLM that watches individual session recordings on a schedule and pushes qualifying findings to the inbox. These scanners are the only part of this setup that spends Replay Vision quota. Findings arrive at half weight and require corroboration before they are promoted into a report.

| Scanner | Status | What it watches | Query scope | Sampling | Estimated monthly spend |
|---|---|---|---|---:|---:|
| [Course discovery breakage](https://us.posthog.com/project/592485/replay-vision/01a0dd88-0ac9-781e-9a6f-b083390048b0) | Created | Visible breakage while learners search, browse courses, open course content, or enter a lesson. | URLs containing `/courses`, the product’s course-discovery and course-entry flow. | 50% | 0 observations / 0 credits (no recordings yet) |
| [Learning journey frustration](https://us.posthog.com/project/592485/replay-vision/01a0dd88-0cc7-7702-af62-98049cc287a1) | Created | Clear on-screen learner struggle such as repeated failed interactions in discovery or continuation flows. | Sessions containing `$rageclick` only. | 100% | 0 observations / 0 credits (no recordings yet) |

Replay Vision has 2,500 credits remaining in the current period and is not exhausted. Both monitors are armed and will begin observing automatically once recordings arrive. Rate their future observations in the scanner views to receive configuration recommendations.

## Follow-ups

- [ ] Connect an inbound Support channel (email, inbox, or Slack) in PostHog so Support tickets can reach the enabled responder.
- [ ] Drive real browser traffic with the configured PostHog client so Session Replay, scanners, and learning-flow scouts have recordings and events to analyze.
- [ ] Review the first Replay Vision observations and rate them to tune the monitors if needed.

## What happens next

The scout coordinator picks up fresh configurations within about 30 minutes. Scouts draw from the project’s daily run budget, findings cluster into reports in the Self-driving inbox, and immediately actionable findings can begin coding tasks.

Reference: [PostHog Self-driving signal sources documentation](https://posthog.com/docs/self-driving/inbox/sources).
