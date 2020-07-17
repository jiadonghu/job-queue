const pm2Config = {
  "apps": [
    {
      "name": "app",
      "script": "app.js",
      "exec_mode": "cluster_mode",
      "instances": 1
    },
    {
      "name": "worker",
      "script": "worker.js",
      "instances": "max"
    }
  ]
};

module.exports = pm2Config;