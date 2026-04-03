FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y curl git \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*