FROM ubuntu:latest
LABEL description="Wiki"
SHELL ["/bin/bash", "-c"]
WORKDIR /wiki

# 1. Install basic requirements
RUN apt-get update && apt-get upgrade -y

# 2. Install requirement
COPY install.sh             install.sh
RUN ./install.sh
COPY create.sh create.sh
COPY docs/ docs/
COPY package.json package.json
RUN ./create.sh

# Quick Start
CMD echo "main process has been started"    &&  \
    cd vuepress-starter                     &&  \
    yarn init -y                            &&  \
    yarn add -D vuepress                    &&  \
    cd ..                                   &&  \
    yarn docs:dev                           &&  \
    echo "container has been finished"