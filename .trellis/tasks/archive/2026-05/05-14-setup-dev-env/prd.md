# Setup Local Dev Environment

## Summary
Configure the local development environment for it-tools so that `pnpm dev`, `pnpm test`, `pnpm lint`, and `pnpm typecheck` all pass.

## Requirements
1. Install Node.js 18.x (compatible with `.nvmrc` = 18.18.2) via fnm — isolated, not replacing the system Node v24
2. Ensure pnpm 9.11.0 is available (comes with the fnm-managed Node)
3. Run `pnpm install` to install all project dependencies
4. Verify: `pnpm typecheck` passes (zero errors)
5. Verify: `pnpm lint` passes (zero errors; warnings acceptable)
6. Verify: `pnpm test:unit` can run

## Technical Notes
- Project: Vue 3 + Vite + TypeScript + Naive UI
- Node version managed by fnm (installed to `/usr/local/bin/fnm`)
- fnm env activation: `eval "$(fnm env)" && fnm use 18`
- pnpm is provided by the Node 18 installation (corepack)
- Dependencies installed in `node_modules/` (local, not global)

## Done Criteria
- [x] fnm installed and Node 18.20.8 available
- [x] pnpm 9.11.0 available
- [x] `pnpm install` succeeded (1308 packages)
- [x] `pnpm typecheck` passes
- [x] `pnpm lint` passes (0 errors, 3 warnings)
