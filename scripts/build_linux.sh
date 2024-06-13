#!/usr/bin/env bash
set -xue

# Save the current working directory to the stack and change the working directory to '/work'
pushd /work

# Build '.deb', '.rpm' and '.AppImage' files
npm run-script build:linux:x64

# Move compiled packages to the output folder
mv releases/*.{deb,rpm,AppImage} /output