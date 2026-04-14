# Plan: P1 plugin-owned UI routes MVP

## Stories
- P1 Install as OpenClaw plugin
- F1 Top mistakes dashboard
- F3 Compare eval runs
- F4 Review candidates

## Why this is next
The repo already has a working thin UI for top mistakes, candidate review, and eval comparisons.
What it lacks is a plugin-owned surface that makes this UI part of the plugin story.

## Goal
Let the plugin start and own the existing thin UI server, then report the route information clearly.

## In scope
- plugin method to start the existing UI server
- boring config defaults for host/port
- plugin response containing local route URLs
- focused tests proving plugin-owned UI startup and route availability
- docs describing how the plugin UI surface works

## Out of scope
- a second frontend stack
- auth hardening beyond local/operator assumptions
- embedding into broader OpenClaw dashboards
- live route registration into the gateway UI shell

## Design stance
Reuse the existing thin review server.
Do not build a second UI just to say the plugin has UI.
The plugin should own startup and provide stable local route info.

## Definition of done
This slice is done when the plugin can start the existing thin UI server and return usable local URLs for top mistakes, candidates, and comparisons, with focused tests proving the routes respond.
