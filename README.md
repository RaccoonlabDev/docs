# UAVCAN nodes

This repository has a documentation for existed [DroneCAN](https://dronecan.github.io/) (and [Cyphal](https://opencyphal.org/) soon) nodes and their binaries files.

Please visit [the site](https://innopolisaero.github.io/inno_uavcan_node_binaries/guide/) to get the documentation.

## For developers

The documentation is based on [VuePress](https://vuepress.vuejs.org) Static Site Generator.

Before pushing to the main branch of the repository, it is preffered to start the local server by running the command below and then check [http://localhost:8080](http://localhost:8080):

```bash
docker build -t wiki . && docker run --net=host wiki
```
