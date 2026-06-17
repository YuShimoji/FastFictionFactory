# Freeform Review Intake

## Operating Rule

When user review is needed, Fast Fiction Factory should accept natural review text instead of requiring fixed phrases such as `accept`, `reject`, or `small_adjustment`.

The user review text is treated as the source of truth. The agent may internally interpret it into target, intent, constraints, confidence, and default action, but the user should not be asked to rewrite the review in a rigid format.

## Review Card Shape

A Review Card should appear near the top of a report or immediately after artifact access when user review is required. It should include:

- Target artifact or section.
- Up to three things to inspect.
- Freeform review allowed: yes.
- Examples of freeform feedback.
- How the agent will interpret and continue.
- Completion signal.

If review would be helpful but is not required, record it as Review Debt and continue with reversible scoped work.

## Agent Handling

Medium or high confidence interpretation should continue through reversible local work:

- Update docs or artifacts.
- Regenerate reviewable proof.
- Update manifest or status packets.
- Run validation.

Low confidence interpretation should produce one Review Clarification Card only when a wrong interpretation would materially change artifact direction.

## Current Application

`fff-extraction-contract-001` uses freeform review as a human authority boundary. Extraction candidates can be reviewed through local status controls, but any user freeform review overrides generated suggestions for story-sensitive decisions.

The currently human-owned decisions remain:

- Toma fate.
- Brass moth truth.
- Council motive.

No review text should be converted into final canon unless the user clearly asks for that story decision.
