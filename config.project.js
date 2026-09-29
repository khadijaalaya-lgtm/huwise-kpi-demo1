var project_config = require('./config.project');

module.exports = {
    ODS_PORTAL_DOMAIN_ID: 'userclub', // Replace by your DOMAIN ID
    DEFAULT_DOMAIN_URL: 'https://userclub.opendatasoft.com/', // REPLACE BY YOUR DOMAIN URL

    // List of pages, used by the gulp server and gulp update/compile commands.
    // the name/id/slug of the page MUST CORRESPOND to the page id on your Opendatasoft portal.
    // it must also correspond to the ejs file name and scss file name.
    PAGES: ['dataviz','map','empty','cours-oasis-kpi'],
};