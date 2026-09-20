# Yukino Mario

An original endless-runner platformer. Sprint across a procedurally extended course, stomp enemies, collect coins, and break blocks to build a distance-weighted score — then defend your run on the local leaderboard across four difficulty tiers, from Low to Hell.

**Play it live:** <https://hangtiancheng.github.io/yukino-mario/>

---

## Features

- **Infinite world** — the level extends segment by segment with deterministic, seeded enemy variation (position jitter, speed scaling, phase offsets); entities behind the camera are pruned to keep memory flat.
- **Dual renderers, one visual language** — switch at runtime between a DOM renderer (Tailwind-styled divs) and a PixiJS WebGL renderer. Both consume a shared palette and scenery data, so they are pixel-consistent.
- **Tight platforming feel** — fixed-timestep simulation with coyote time, jump buffering, jump cut, moving-platform carry, stomp bounce, and post-revive invulnerability frames.
- **Four difficulty tiers** — enemy count, speed, patrol variance, camera easing, lives, and score multiplier all scale from Low to Hell.
- **Audio** — sound effects are synthesized at runtime into WAV data URIs and played through Howler.js; a looping background track starts on the first user gesture and respects the global mute toggle.
- **Installable PWA** — offline-capable via a Workbox service worker; the app shell is precached and the background music is cached on first playback.
- **Local leaderboard** — scores, difficulty, and player name persist in `localStorage`, validated with Zod on every read.

## Controls

| Action  | Keys                    |
| ------- | ----------------------- |
| Move    | `A` / `D` or arrow keys |
| Jump    | `Space`, `W`, or `↑`    |
| Restart | `R`                     |

Touch controls appear automatically on small screens. A distraction-free fullscreen mode is available at `/fullscreen`.

---

## Tech Stack

| Layer          | Technology               | Version  | Role                                                              |
| -------------- | ------------------------ | -------- | ----------------------------------------------------------------- |
| Framework      | React                    | 19.2     | UI rendering, component tree                                      |
| Language       | TypeScript               | 6.0      | Strict static typing (`noUncheckedIndexedAccess` enabled)         |
| Build          | Vite                     | 8.0      | Dev server, HMR, bundling                                         |
| Styling        | Tailwind CSS             | 4.3      | Utility-first CSS                                                 |
| State          | Jotai                    | 2.20     | Atom-based state (difficulty, leaderboard, player name, renderer) |
| Graphics (alt) | PixiJS                   | 8.18     | Optional WebGL renderer, lazy-loaded                              |
| Animation      | GSAP                     | 3.15     | Score counter tween                                               |
| Audio          | Howler.js                | 2.2      | Synthesized sound effects and looping background music            |
| PWA            | vite-plugin-pwa          | 1.3      | Service worker, web app manifest, offline support                 |
| Validation     | Zod                      | 4.4      | Runtime schema checks (level data, leaderboard, storage, env)     |
| Routing        | React Router             | 7.15     | SPA routing: home, fullscreen, 404                                |
| Error Tracking | Sentry                   | 10.53    | Exception capture in production                                   |
| Testing        | Vitest + Testing Library | 4.1      | Unit and integration tests                                        |
| E2E            | Playwright               | 1.60     | Browser-level end-to-end tests                                    |
| Component Dev  | Storybook                | 10.4     | Isolated component development                                    |
| Linting        | ESLint + Prettier        | 10 / 3.8 | Code quality, formatting                                          |

---

## Architecture

```
src/
  components/        UI components (game stage, HUD, selectors, sprites, overlays)
    renderers/       DOM and PixiJS renderers (switchable at runtime)
  constants/         Game physics, level data, difficulty presets, shared palette
  hooks/             React hooks (game loop, simulation, session, keyboard, audio)
  pages/             Route-level pages (home, fullscreen, 404)
  routes/            Layout wrapper
  schema/            Zod schemas
  services/          Sentry, Howler sound bank, BGM, WAV synthesis
  stores/            Jotai atoms with localStorage persistence
  types/             TypeScript type definitions
  utils/             Pure game logic (physics, collision, enemies, map, camera, scoring)
```

The simulation lives outside the React render cycle: `useGameSimulation` holds an immutable `GameState` in a ref and advances it with a fixed-timestep `requestAnimationFrame` loop. Each tick produces a new state, published to subscribers through `useSyncExternalStore` — the DOM renderer consumes it declaratively, while the Pixi renderer redraws imperatively from the same snapshot.

All gameplay rules (physics, collision, enemy AI, scoring, world extension) are pure functions in `src/utils`, which keeps them deterministic and unit-testable without a browser.

---

## Development

```sh
pnpm install
pnpm dev          # Start dev server
pnpm test         # Run unit tests
pnpm e2e          # Run Playwright e2e tests (requires pnpm build first)
pnpm storybook    # Component explorer
pnpm typecheck    # TypeScript project check
pnpm lint         # ESLint
pnpm build        # Production build
```

End-to-end tests run against the production build served by `vite preview` under the `/yukino-mario/` base path, mirroring the deployed environment.

## Deployment

Pushing to `main` with the commit message `ci: Deploy yukino-mario` (or triggering the workflow manually) runs unit tests, builds with the `/yukino-mario/` base, and publishes to GitHub Pages via `.github/workflows/deploy.yml`. A `404.html` copy of the app shell provides the SPA fallback for deep links.
