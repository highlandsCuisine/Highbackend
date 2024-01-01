module.exports = {
  apps: [
    {
      name: "backend",
      script: "index.js",
      instances: 4,
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "500M",
      args: ["--port", 5000],
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
