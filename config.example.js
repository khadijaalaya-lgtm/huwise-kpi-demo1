var project_config = require('./config.project');

module.exports = {
    // gulp update parameters
    ODS_PORTAL_DOMAIN_ID: project_config.ODS_PORTAL_DOMAIN_ID,
    DEFAULT_DOMAIN_URL: project_config.DEFAULT_DOMAIN_URL,

    // Used to push pages content to the domain, must have "Edit all pages" and "Manage own pages' security" permissions
    ODS_ADMIN_APIKEY: '<APIKEY>',

    // HTTP Intercept queries to add domain or apikey params to dataset-context
    API_KEYS: [
        {
            'domain':'mydomainID',
            'apikey':'APIKEY HERE',
        },
    ],

    // List of pages, used by the gulp server and gulp update/compile commands
    PAGES: project_config.PAGES,

    // Adv. settings
    WATCH_DIRS: [
        "./pages/views/**/*.html",
        "./pages/views/**/*.ejs"
    ],
    BROWSER: "google chrome",

    // PROXY: For specific network settings, format "http://login:pass@host:port", leave empty if any
    PROXY_URL: "",

    // BASE PATH: For specific kit deployment, when a base path is mandatory.
    // ex: https://deploymentzone.com/proxy/9090/pages/home, the BASEPATH should be "/proxy/9090"
    BASEPATH: "",

    // You usually shouldn't have to edit these
    ODS_PORTAL_SUFFIX: '.huwise.com',
    SERVER_PORT: 9090,
    OUTPUT_DIR: 'output'
};