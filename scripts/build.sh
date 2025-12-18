#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

BUILD_DIR="build"
CONTENT_BUILD_DIR="$BUILD_DIR/content"

echo "==> Cleaning build directory..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

echo "==> Copying content to build directory..."
cp -r content "$CONTENT_BUILD_DIR"

echo "==> Building highlight tool..."
cargo build --manifest-path tools/highlight/Cargo.toml --release --quiet

echo "==> Running syntax highlighter..."
./tools/highlight/target/release/highlight --input "$CONTENT_BUILD_DIR"

echo "==> Building site with Zola..."
# Zola doesn't support custom content dirs, so we temporarily swap
# We use a symlink trick: rename content, link build content, build, restore
mv content content.src
ln -s "$BUILD_DIR/content" content
trap "rm -f content; mv content.src content" EXIT

zola build --output-dir "$BUILD_DIR/public"

echo "==> Done! Output in $BUILD_DIR/public"
