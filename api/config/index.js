var config = module.exports = {};

config.SERVERIP = "localhost";
config.hostname = 'http://localhost';

config.mongo = {};
config.mongo.uri = config.SERVERIP;
config.mongo.port = '27017';
config.mongo.db = 'userRegistrationDB';

config.accesscontrol = {}
config.accesscontrol.url = config.hostname + ":4000/api/auth/isauthorized";

const defaultConfig = {
    db: 'mongodb://localhost:27017/userRegistrationDB',
    apiPort: 3000,
    secret: 'hBqOVoGz3x01630Ac1DM29HURkKylfFMZU4Ue1L3Cc9dnh5NPie0qMKJpgu3mnPD8242FC9E6504204D1CF5E0DFD3C7B779AD7EBD82885A52F0ADCB0522A9E1B95',
    jwt: {
        session: false,
        secret: 'hBqOVoGz3x01630Ac1DM29HURkKylfFMZU4Ue1L3Cc9dnh5NPie0qMKJpgu3mnPD8242FC9E6504204D1CF5E0DFD3C7B779AD7EBD82885A52F0ADCB0522A9E1B95'
    }
};
/**
 * Enviroment specific configuration
 * @type {{prod: {}, dev: {}, test: {apiPort: number}}}
 */
const envConfig = {
    prod: {},
    dev: {},
    test: {
        apiPort: 3100
    }
};
/**
 * * Loads config based on the current environment
 * @returns {*}
 */

function loadConfig() {
    const env = process.env.NODE_ENV || 'dev';

    if (!envConfig[env]) {
        throw new Error(`Environment config for environment '${env}' not found. process.env.NODE_ENV must be one of '${Object.keys(envConfig)}'`);
    }

    console.log('[INFO] config loaded for environment: ', env);

    // merge default config with environment specific config
    return Object.assign({}, defaultConfig, envConfig[env], config);
}
module.exports = loadConfig();