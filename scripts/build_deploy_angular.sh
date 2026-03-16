#!/usr/bin/env bash
set -euo pipefail

APP_DIR="botjagwar-ng"
DEPLOY_DIR="/opt/botjagwar-front/ng-app"
BASE_HREF="/ng/"
BUILD_CONFIGURATION="production"
RELOAD_NGINX=1

usage() {
  cat <<USAGE
Build and deploy the Angular app for botjagwar.

Usage:
  $(basename "$0") [options]

Options:
  --app-dir <path>            Angular project directory (default: ${APP_DIR})
  --deploy-dir <path>         Deployment directory served by Nginx (default: ${DEPLOY_DIR})
  --base-href <value>         Angular base href (default: ${BASE_HREF})
  --configuration <name>      Angular build configuration (default: ${BUILD_CONFIGURATION})
  --skip-nginx-reload         Skip reloading Nginx after deployment
  -h, --help                  Show this help
USAGE
}

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --app-dir)
      APP_DIR="$2"
      shift 2
      ;;
    --deploy-dir)
      DEPLOY_DIR="$2"
      shift 2
      ;;
    --base-href)
      BASE_HREF="$2"
      shift 2
      ;;
    --configuration)
      BUILD_CONFIGURATION="$2"
      shift 2
      ;;
    --skip-nginx-reload)
      RELOAD_NGINX=0
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ ! -d "$APP_DIR" ]]; then
  echo "Angular app directory not found: $APP_DIR" >&2
  exit 1
fi

if [[ "${BASE_HREF}" != */ ]]; then
  BASE_HREF="${BASE_HREF}/"
fi

log "Building Angular app in ${APP_DIR} (configuration=${BUILD_CONFIGURATION}, base-href=${BASE_HREF})"
pushd "$APP_DIR" >/dev/null

if [[ ! -d node_modules ]]; then
  log "node_modules not found, running npm ci"
  npm ci
fi

npm run build -- --configuration "${BUILD_CONFIGURATION}" --base-href "${BASE_HREF}"

DIST_ROOT="dist"
if [[ ! -d "${DIST_ROOT}" ]]; then
  echo "Build output not found under ${APP_DIR}/${DIST_ROOT}" >&2
  exit 1
fi

if [[ -f "${DIST_ROOT}/botjagwar-ng/browser/index.html" ]]; then
  BUILD_OUTPUT="${DIST_ROOT}/botjagwar-ng/browser"
elif [[ -f "${DIST_ROOT}/botjagwar-ng/index.html" ]]; then
  BUILD_OUTPUT="${DIST_ROOT}/botjagwar-ng"
else
  BUILD_OUTPUT="$(find "${DIST_ROOT}" -type f -name index.html -printf '%h\n' | head -n 1)"
fi

if [[ -z "${BUILD_OUTPUT}" || ! -f "${BUILD_OUTPUT}/index.html" ]]; then
  echo "Unable to detect build output directory under ${APP_DIR}/${DIST_ROOT}" >&2
  exit 1
fi

log "Deploying ${APP_DIR}/${BUILD_OUTPUT} -> ${DEPLOY_DIR}"
mkdir -p "${DEPLOY_DIR}"
rm -rf "${DEPLOY_DIR:?}"/*
cp -a "${BUILD_OUTPUT}/." "${DEPLOY_DIR}/"

popd >/dev/null

if [[ ${RELOAD_NGINX} -eq 1 ]]; then
  if command -v systemctl >/dev/null 2>&1; then
    log "Reloading Nginx with systemctl"
    systemctl reload nginx
  elif command -v service >/dev/null 2>&1; then
    log "Reloading Nginx with service"
    service nginx reload
  else
    log "Nginx reload skipped (no systemctl/service command found)"
  fi
else
  log "Skipped Nginx reload (--skip-nginx-reload)"
fi

log "Deployment complete"
