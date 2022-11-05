module.exports = {
  apps: [
    {
      name: 'Backend Microservice',
      script: 'src/index.js',
      // script: 'npm', // Do not use this, express port binding will be problematic with npm start
      // args: 'run start', // Look above

      exec_mode: 'cluster',

      instances: 1, // Important!!! (Hlambda is stateless but shell, logs and other routes are not shared)
      autorestart: true, // Set autorestart if there is unexpected error.
      max_memory_restart: '2G',

      // Watch is problematic, it will issue pm2 restart instead of pm2 reload
      // watch: false,
      // watch: 'watcher_trigger/', // This only works if dot files / folders are not used, due to chokidar and pm2 :(

      // Delay between restart
      // watch_delay: 1000,
      listen_timeout: 15000,
      wait_ready: true,
      kill_timeout: 60000, // Amount of time waiting after SIGINT to execute SIGKILL

      out_file: '/dev/null',
      error_file: '/dev/null',

      vizion: false,
      pmx: false,

      // output: '/dev/null', // This will disable stdout logs even for windows :)
      // error: '/dev/null', // This will disable stderr logs even for windows :)
      // log: true, // This will enable combined stdout and stderr logs, without giving a path
      // log_type: 'json', // This will transform output to JSON
      // merge_logs: true, // This will combine stdout and stderr logs, without giving a path
    },
  ],
};
