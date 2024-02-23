#!/usr/bin/env bash

function publish_npm() {
  local lib=$1

  npm publish --workspace=plugins/"$lib" --provenance --access public --tag next
}

# Tips: libs use by other libs first
LIBS=vite-plugin

for lib in $(echo $LIBS | sed "s/,/ /g"); do
  publish_npm "$lib"
done
