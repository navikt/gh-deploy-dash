# Github deploy dashboard

A simple dashboard to show current and pending deployments in github actions for your teams in a
GitHub organization.

## Development

Getting started:

```
bun install
bun codegen
bun run dev
```

To test the app locally, you can create a personal github token with organization read scope, repository contents,
deployments and workflow read/write access. Add the token to env in `GITHUB_PAT` and
`PUBLIC_GITHUB_PAT`.

## Building for production

```
docker build --build-arg PUBLIC_GITHUB_ORG=<your github organization login>
```

To use the app, create a GitHub OAuth app and set the environment variables:

- `GH_CLIENT_ID`: Your apps client id
- `GH_CLIENT_SECRET`: Your apps client secret
