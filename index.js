const core = require('@actions/core');
const child_process = require('child_process');

try {
    const project = core.getInput('project', { required: true });
    const task = core.getInput('task', { required: true });
    const ref = process.env['GITHUB_REF'];
    const sha = process.env['GITHUB_SHA'];
    
    const docker_branch = ref.substring(ref.lastIndexOf('/') + 1);
    const docker_hash = sha.substring(0, 7);
    const docker_version = `${docker_branch}.${docker_hash}`;
    const docker_tag = `${project}:${docker_version}`;
    
    core.setOutput('docker_branch', docker_branch);
    core.setOutput('docker_hash', docker_hash);
    core.setOutput('docker_version', docker_version);
    core.setOutput('docker_tag', docker_tag);
    
    console.log(`Docker: ${task} ${docker_tag}`);
    
    const execSync = (command, options = {}) => {
        console.log(`> ${command}`);
        child_process.execSync(command, options);
    };
    
    if (task === 'push') {
        const registry = core.getInput('registry', { required: true });
        const username = core.getInput('username', { required: true });
        const password = core.getInput('password', { required: true });
    
        execSync(
            `docker login -u ${username} --password-stdin ${registry}`,
            {input: password}
        );
    
        execSync(`docker tag ${docker_tag} ${registry}/${project}:${docker_branch}.latest`);
        execSync(`docker tag ${docker_tag} ${registry}/${docker_tag}`);
        execSync(`docker push ${registry}/${docker_tag}`);
        execSync(`docker push ${registry}/${project}:${docker_branch}.latest`);
    }    
} catch (error) {
    core.setFailed(error.message);
}
