require("dotenv").config();

module.exports = {
  apps : [{
    script: 'bun run start',
    watch: '.',
    name: 'StreamBot',
  }],

  deploy : {
    production : {
      user : 'root',
      host : '187.124.116.141',
      password : process.env.PASSWORD,
      ref  : 'origin/main',
      repo : 'https://github.com/CamilGrondin/StreamBot.git',
      path : '/home/camil/Desktop/StreamBot',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.cjs --env production',
      'pre-setup': ''
    }
  }
};