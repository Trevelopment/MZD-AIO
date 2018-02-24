#!/usr/bin/env bash
set -xue

pushd /work
npm run-script build:linux:x64

mv releases/*.deb /output
