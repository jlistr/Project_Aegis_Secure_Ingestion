#!/usr/bin/env bash
set -euo pipefail
PKG_NAME="${1:-express}"
WORKDIR="${PWD}/isolated"
SNYK_TOKEN="${SNYK_TOKEN:-}"

echo "=== Project Aegis isolate & scan script ==="
mkdir -p "${WORKDIR}"
cd "${WORKDIR}"
npm pack "${PKG_NAME}"
TARBALL="$(ls ${PKG_NAME}-*.tgz | head -n1)"
echo "Tarball created: ${TARBALL}"
tar -tzf "${TARBALL}" | head -n 50
tar -xzf "${TARBALL}"
cd package
grep -R -E "postinstall|install|child_process|eval|curl |wget " . || true
npm install --ignore-scripts --no-audit || true
npm audit --audit-level=moderate || true
if [ -n "${SNYK_TOKEN}" ]; then
  npm i -g snyk && snyk auth "${SNYK_TOKEN}" && snyk test || true
fi
echo "Static scan complete. Proceed to run GitHub Actions workflow for behavioral scan and publish."
