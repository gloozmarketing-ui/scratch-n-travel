# Nous Hermes — Travel Design Skill System

This package is a modular Creative Director system for generating original travel/fashion products.

## Skill order

00_MASTER_ORCHESTRATOR
01_COLOR_PSYCHOLOGY
02_CONTRAST_PERCEPTION
03_COMPOSITION_GAZE
04_TYPOGRAPHY_PSYCHOLOGY
05_PATTERN_GEOMETRY
06_TRAVEL_SEMANTICS
07_BADGE_INTEGRATION
08_DESIGN_GENOME
09_EMOTION_ART_DIRECTION
10_FASHION_PRODUCT_TRANSLATION
11_EASTER_EGG_DISCOVERY
12_CRITIC_SCORING
13_GENERATION_PROMPT_ENGINE
14_CREATIVE_RESEARCH
15_OUTPUT_SCHEMA

## Core philosophy

The system separates:
- emotional intent
- perceptual mechanics
- visual language
- travel meaning
- product reality
- uniqueness
- critique

This prevents the agent from producing the same generic "travel shirt" repeatedly.

## Recommended agent loop

BRIEF
→ EMOTION
→ PSYCHOLOGY
→ 5 CONCEPTS
→ GENOME
→ ANTI-REPETITION
→ COMPOSITION
→ DETAILS
→ PRODUCT TRANSLATION
→ CRITIQUE
→ REFINEMENT
→ FINAL PROMPT

## Important implementation idea

Maintain a persistent `design_archive.json` containing the Design Genome of every approved product. Before generating a new product, compare its genome against the archive.

A new destination is not automatically a new design.

A new visual grammar is.

## Badge integration

If a badge CSV/database is available, load it during concept development. Badges should become transformed visual ingredients, not pasted icons.
