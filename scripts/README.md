# Build `MZD AIO Tweaks` for GNU/Linux
The following instructions utilise a [`podman`](https://podman.io/) container to build `MZD-AIO-TI`.

Compiling applications within containers is beneficial because it:
- Prevents conflicts with newer versions of dependencies.
- Lowers the risk of compilation errors caused by idiosyncrasies between systems.
- Avoids cluttering the system with packages installed solely for the purpose of compiling the software.

Note: The `build_linux.sh` script is written to be run in the `podman` container, so please do not invoke it directly.

## Instructions
1. Ensure the dockerfile at `/MZD-AIO/scripts/Dockerfile.linux` contains the following:
    ```dockerfile
    # Image Maintainers
    LABEL maintainer="Misha Nasledov <misha@nasledov.com>, Rohan Barar <rohan.barar@gmail.com>"

    # Node.js Version 13 Base Image
    FROM node:13

    # Update sources list for apt package manager (base image contains outdated URLs)
    RUN sed -i s/deb.debian.org/archive.debian.org/g /etc/apt/sources.list
    RUN sed -i s/security.debian.org/archive.debian.org/g /etc/apt/sources.list
    RUN sed -i s/stretch-updates/stretch/g /etc/apt/sources.list

    # Update and install required packages
    RUN apt-get update
    RUN apt-get -y upgrade
    RUN apt-get -y install graphicsmagick icnsutils rpm
    RUN apt-get clean

    # Copy the contents of the current directory into the '/work' directory inside the container
    ADD . /work

    # Set the working directory to '/work'
    WORKDIR /work

    # Install node.js packages and dependencies listed within 'package.json'
    RUN npm install
    ```

2. Ensure the bash script at `/MZD-AIO/scripts/build_linux.sh` contains the following:
    ```bash
    #!/usr/bin/env bash
    set -xue

    # Save the current working directory to the stack and change the working directory to '/work'
    pushd /work

    # Build '.deb', '.rpm' and '.AppImage' files
    npm run-script build:linux:x64

    # Move compiled packages to the output folder
    mv releases/*.{deb,rpm,AppImage} /output
    ```

3. Mark the bash script at `/MZD-AIO/scripts/build_linux.sh` as executable.
    ```bash
    chmod +x /path/to/MZD-AIO/scripts/build_linux.sh
    ```

4. Ensure you are within the root directory of the cloned repository.
    ```bash
    cd /path/to/MZD-AIO
    ```

5. Build the image. Ignore the deprecation warnings.
    ```bash
    podman build -t build-mzd-aio-lnx -f ./scripts/Dockerfile.linux .
    ```

6. Check your new image 'localhost/build-mzd-aio-lnx' is listed.
    ```bash
    podman images
    ```

7. Create and run a container based on the 'build-mzd-aio-lnx' image.
    ```bash
    podman run -v ${PWD}:/output -t build-mzd-aio-lnx /work/scripts/build_linux.sh
    ```

    _Note: If you are on a system with SELinux enabled (e.g. Fedora), you might need to add the ':z' option to the volume mount to allow `podman` to relabel the content for access by the container._
    ```bash
    podman run -v ${PWD}:/output:z -t build-mzd-aio-lnx /work/scripts/build_linux.sh
    ```

8. Install the resulting `.deb` or `.rpm` file.
    - Debian-based GNU/Linux distributions:
        ```bash
        sudo apt install libappindicator1 libindicator7
        sudo dpkg -i MZD-AIO-TI-linux_2.8.6.deb
        ```
    - Red Hat-based GNU/Linux distributions:
        ```bash
        sudo dnf -i MZD-AIO-TI-linux_2.8.6.rpm
        ```

9. (Optional) Remove `podman` images and containers.
    ```bash
    podman rmi --force <IMAGE_ID> <IMAGE_ID>
    ```
