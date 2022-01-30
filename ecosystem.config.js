module.exports = {
  apps: [
    {
      name: 'Backend GraphQL Microservice',
      script: 'src/index.js',

      // instances: 'max',
      exec_mode: 'cluster',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: '',
      instances: 4,
      autorestart: true,
      // watch: false,
      max_memory_restart: '2G',

      watch: 'watcher_trigger/', // This only works if dot files / folders are not used, due to chokidar and pm2 :(

      // Delay between restart
      watch_delay: 1000,

      // output: '/dev/null', // This will disable stdout logs even for windows :)
      // error: '/dev/null', // This will disable stderr logs even for windows :)
      // log: true, // This will enable combined stdout and stderr logs, without giving a path
      // log_type: 'json', // This will transform output to JSON
      // merge_logs: true, // This will combine stdout and stderr logs, without giving a path
    },
  ],
};
