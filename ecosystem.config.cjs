module.exports = {
  apps : [{
    script: 'src/index.ts',
    watch: '.'
  }],

  deploy : {
    production : {
      user : 'root',
      host : '72.61.96.228',
      ref  : 'origin/main',
      repo : 'https://github.com/CamilGrondin/StreamBot.git',
      path : '/root/StreamBot',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.cjs --env production',
      'pre-setup': ''
    }
  }
};
