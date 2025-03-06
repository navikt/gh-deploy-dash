FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb bunfig.toml /temp/dev/

RUN --mount=type=secret,id=bun_auth_token cd /temp/dev && \
  BUN_AUTH_TOKEN=$(cat /run/secrets/bun_auth_token) \
  bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lockb bunfig.toml /temp/prod/
RUN --mount=type=secret,id=bun_auth_token cd /temp/prod && \
  BUN_AUTH_TOKEN=$(cat /run/secrets/bun_auth_token) \
  bun install --frozen-lockfile --production
# Some dev-deps are sneaking in for some reason.
# Remove the ones that pollute the SBOM with vulnerabilities
RUN rm -r /temp/prod/node_modules/esbuild /temp/prod/node_modules/@esbuild

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ARG PUBLIC_GITHUB_ORG
ENV PUBLIC_GITHUB_ORG=${PUBLIC_GITHUB_ORG}
ENV NODE_ENV=production
RUN bun run codegen
RUN bun run build

# copy production dependencies and source code into final image
FROM oven/bun:1-distroless AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/build ./build
COPY --from=prerelease /usr/src/app/package.json .

# run the app
EXPOSE 3000/tcp
CMD ["run", "build/index.js"]
