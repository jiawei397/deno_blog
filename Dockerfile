FROM denoland/deno:alpine-1.30.1

EXPOSE 8000

WORKDIR /app

# Prefer not to run as root.
RUN chown -R deno /app
RUN chmod 755 /app
USER deno

ADD . .

RUN deno cache --import-map import_map.json --unstable mod.ts

CMD deno run --allow-net --allow-env --allow-write --allow-read --importmap import_map.json --unstable mod.ts