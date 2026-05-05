FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y curl git \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Pre-create directories for named volumes to ensure they have the correct permissions
RUN mkdir -p /workspace/.nx/cache /workspace/apps/web-ui/.next \
    && chown -R vscode:vscode /workspace

USER vscode