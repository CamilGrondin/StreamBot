import { password } from "bun";
import dotenv from "dotenv"

module.exports = {
  apps : [{
    script: 'bun run start',
    watch: '.',
    name: 'StreamBot',
  }],

  deploy : {
    production : {
      user : 'camil',
      host : '10.188.72.97',
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