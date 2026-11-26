// PM2 process file, used by deploy/deploy.sh (see DEPLOYMENT_AWS.md step 5).
// Next.js listens on localhost only; Nginx is the public entry point.
module.exports = {
  apps: [
    {
      name: "techno27",
      // The `current` link, not a real path: each reload starts in whichever release it points to.
      cwd: "/var/www/techno27/current",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000 -H 127.0.0.1",
      // t3.large: one process per vCPU (2), load-balanced by PM2; "max" follows the instance size if it changes.
      instances: "max",
      exec_mode: "cluster",
      max_memory_restart: "1500M",
      env: { NODE_ENV: "production" },
      // Secrets are NOT here: Next.js reads .env.production.local (linked into each release from shared/).
      out_file: "/var/log/techno27/out.log",
      error_file: "/var/log/techno27/error.log",
      time: true,
    },
  ],
};
