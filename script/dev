#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

BUILD_DIR="build"
CONTENT_BUILD_DIR="$BUILD_DIR/content"
PORT="${1:-1111}"

cleanup() {
    rm -f content
    mv content.src content 2>/dev/null || true
}
trap cleanup EXIT

echo "==> Cleaning build directory..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

echo "==> Copying content to build directory..."
cp -r content "$CONTENT_BUILD_DIR"

echo "==> Building highlight tool..."
cargo build --manifest-path tools/highlight/Cargo.toml --release --quiet

echo "==> Running syntax highlighter..."
./tools/highlight/target/release/highlight --input "$CONTENT_BUILD_DIR"

echo "==> Setting up content symlink..."
mv content content.src
ln -s "$BUILD_DIR/content" content

echo "==> Starting Zola dev server on port $PORT..."
echo "    Note: Changes to content/ won't auto-highlight."
echo "    Re-run this script to pick up content changes."
echo ""

zola serve --port "$PORT" --output-dir "$BUILD_DIR/public"
