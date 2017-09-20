build_linux_deb.sh
==================
This script will create a `docker` (http://www.docker.com/) container with all the dependencies to build `MZD-AIO-TI` and build it inside the container. On success, it will spit out the DEB in your current working directory.

Usage:
$ `./scripts/build_linux_deb.sh`

The `build_linux_deb_helper.sh` script is written to be run in the Docker container, so please don't invoke it directly.

This way of building stuff inside ephemeral containers is useful as it avoids people needing the correct dependencies on their own systems if they simply want to build it. It's particularly useful to get builds going on some sort of Continuous Integration solution such as Jenkins or Travis (TBD).

## Build DEB file

```bash
npm run-script build:linux:deb
```

## Install

```bash
sudo apt install libappindicator1 libindicator7
sudo dpkg -i MZD-AIO-TI-linux_2.7.0.deb
```
