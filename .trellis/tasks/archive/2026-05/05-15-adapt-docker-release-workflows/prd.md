# Adapt Docker Release Workflows For Fork

## Goal

Make the existing GitHub Actions Docker release workflows usable in this fork by replacing the upstream image naming and registry assumptions with settings that match the user's repository and release flow.

## What I Already Know

* The repository already contains Docker automation in `.github/workflows/releases.yml` and `.github/workflows/docker-nightly-release.yml`.
* `releases.yml` builds and pushes multi-arch images on `v*.*.*` tags, and also creates a GitHub Release.
* `docker-nightly-release.yml` builds and pushes multi-arch nightly images on a schedule or manual trigger.
* Both workflows currently publish to hard-coded upstream image names: `corentinth/it-tools` and `ghcr.io/corentinth/it-tools`.
* The repository root contains a `Dockerfile`, so the main build input already exists.

## Assumptions (Temporary)

* The user wants to keep GitHub Actions based release automation rather than switching to local-only publishing.
* The fork should publish under the user's own GitHub owner or organization namespace.
* The user may want either GHCR-only publishing or dual publishing to GHCR and Docker Hub.

## Open Questions

* None.

## Requirements (Evolving)

* Update existing Docker GitHub Actions workflows so they can publish images for this fork.
* Preserve tag-based release automation.
* Keep the resulting setup easy for the user to configure in GitHub.
* Use GHCR as the default registry target for the fork.
* Remove or disable the nightly Docker workflow.

## Acceptance Criteria (Evolving)

* [ ] Release workflow publishes images using this fork's namespace instead of upstream hard-coded names.
* [ ] Nightly workflow is no longer part of the publishing flow.
* [ ] Required GitHub repository secrets and settings are documented for the user.

## Definition Of Done

* Relevant workflow files are updated.
* Release behavior is explained clearly for the user.
* Verification steps are provided.

## Out Of Scope (Explicit)

* Changing the application Dockerfile unless the workflow update requires it.
* Setting up external registries on behalf of the user.

## Technical Notes

* Files inspected: `.github/workflows/releases.yml`, `.github/workflows/docker-nightly-release.yml`, `Dockerfile`.
* Current workflows already use `docker/login-action`, `docker/setup-qemu-action`, `docker/setup-buildx-action`, and `docker/build-push-action`.
* Git remote points to `git@github.com:RSJWY/it-tools.git`.
