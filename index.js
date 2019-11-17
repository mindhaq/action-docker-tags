const core = require('@actions/core');

const ref = process.env['GITHUB_REF'];
const sha = process.env['GITHUB_SHA'];

const docker_branch = ref.substring(ref.lastIndexOf('/') + 1);
const docker_hash = sha.substring(0, 6);
const docker_version = `${docker_branch}.${docker_hash}`;

core.setOutput('docker_branch', docker_branch);
core.setOutput('docker_version', docker_version);
