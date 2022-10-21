module.exports = {
  apps: [
    {
      name: "JCWD-VL02-01", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3021,
      },
      time: true,
    },
  ],
};
