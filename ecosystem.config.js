module.exports = {
  apps: [{
    name: "grass-tben21182@gmail.com",
    script: "./start.js",
    watch: true,
    args: "--user 500b73b4-2988-4e48-9830-567a689a4566",
    restart_delay: 30 * 60 * 1000
  },
  {
    name: "grass-johnsmith478892@gmail.com",
    script: "./start.js",
    watch: true,
    args: "--user 40991dda-b89d-44a6-87d7-9e3aa0aaaea5",
    restart_delay: 10 * 60 * 1000
  }]
}
