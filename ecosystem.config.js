module.exports = {
  apps: [
    {
      name: "web",
      script: "web/app.js",
      watch: ["web/app.js", "web/public"],
    }
  ]
}
