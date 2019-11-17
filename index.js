const core = require('@actions/core');
const child_process = require('child_process');

const project = core.getInput('project', { required: true });
const task = core.getInput('task', { required: true });
const ref = process.env['GITHUB_REF'];
const sha = process.env['GITHUB_SHA'];

const docker_branch = ref.substring(ref.lastIndexOf('/') + 1);
const docker_hash = sha.substring(0, 6);
const docker_version = `${docker_branch}.${docker_hash}`;
const docker_tag = `${project}:${docker_version}`;

core.setOutput('docker_branch', docker_branch);
core.setOutput('docker_version', docker_version);
core.setOutput('docker_tag', docker_tag);

console.log(`Docker: ${task} ${docker_tag}`);

if (task === 'push') {
    const registry = core.getInput('registry', { required: true });
    const username = core.getInput('username', { required: true });
    const password = core.getInput('password', { required: true });

    console.log(`pushing ${docker_tag} to ${registry}.`);

    child_process.execSync(
        `docker login -u ${username} --password-stdin ${registry}`,
        {input: password}
    );

    child_process.execSync(`docker tag ${docker_tag} ${project}:${docker_branch}.latest`);
    child_process.execSync(`docker push ${docker_tag} ${project}:${docker_branch}.latest`);
}