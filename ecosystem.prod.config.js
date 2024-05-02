module.exports = {
  apps: [
    {
      name: "hs-backend",
      exec_mode: "cluster",
      instances: 1,
      script: "dist/index.js",
      args: "start",
      env_prod: {
        NODE_ENV: "production",
        PORT: 4020,
      },
    },
  ],
};
