#!/usr/bin/env bash
set -xue

# prepare a container with this repository (parent directory)
docker build -t build-mzd-aio-lnx -f scripts/Dockerfile.linux .
# run the container with a volume to get the deb out. run our helper
# script which builds and puts the DEB into the container's /output volume
docker run \
       -v ${PWD}:/work \
       -v ${PWD}:/output \
       -t build-mzd-aio-lnx \
       /work/scripts/build_linux_deb_helper.sh
