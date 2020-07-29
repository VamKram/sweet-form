var pkg = require('./package')

var env = pkg.config.env.toLowerCase()

var alias = {
	fat: 'fws'
}

  module.exports={
     'AppID':'',
     'Env': alias[env] || env,
  }
