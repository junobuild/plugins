#!/usr/bin/env bash

# Reference: NPM RRFC --if-needed https://github.com/npm/rfcs/issues/466

function publish_npm() {
  local lib=$1

  LOCAL_SHASUM=$(npm pack -w plugins/"$lib" --json | jq '.[] | .shasum' | sed -r 's/^"|"$//g')

  NPM_TARBALL=$(npm show @junobuild/"$lib" dist.tarball)
  NPM_SHASUM=$(curl -s "$NPM_TARBALL" 2>&1 | shasum | cut -f1 -d' ')

  if [ "$LOCAL_SHASUM" == "$NPM_SHASUM" ]; then
    echo "No changes in @junobuild/$lib need to be published to NPM."
  else
    npm publish --workspace=plugins/"$lib" --provenance --access public
  fi
}

# Tips: libs use by other libs first
LIBS=plugin-tools,nextjs-plugin,vite-plugin

for lib in $(echo $LIBS | sed "s/,/ /g"); do
  publish_npm "$lib"
done
