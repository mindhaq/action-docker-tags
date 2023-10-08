# action-docker-tags

This github action computes version strings and tags according to the current
branch and commit hash. It can also push the current docker build to your docker
registry using that versioning scheme.

This is useful if you need to have a tagged version e.g. of your main branch before
rolling out that image, and want to have a version history of those images, e.g.
for rollback purposes.

## naming convention

The tags will be created in the format

    docker_branch.docker_hash

e.g.

    main.3f7ebda

With the git hash being reduced to 7 characters.

Also, when pushing, a tag in the form of `docker_branch.latest` will be pushed.

## example usage

Use the prepare task before building the docker image without pushing it yet.

```yaml
steps:
      - name: Get docker tag info
        id: dockertags
        uses: mindhaq/action-docker-tags@v1
        with:
          project: restrealitaet/rr-forum-backend
          task: prepare

```

Use the push task to publish the docker image to your registry, in this case to gitlab container registry.

```yaml
      - name: Push docker image to gitlab.com
        if: "(github.ref == 'refs/heads/develop') || (github.ref == 'refs/heads/master')"
        uses: mindhaq/action-docker-tags@v1
        with:
          project: example/project
          task: push
          registry: registry.gitlab.com
          username: ${{ secrets.GITLAB_USERNAME }}
          password: ${{ secrets.GITLAB_TOKEN }}
```
