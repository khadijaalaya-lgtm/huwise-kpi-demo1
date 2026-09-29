module.exports = {
    ODS_PORTAL_DOMAIN_ID: 'parisdata', // Domaine Huwise cible (parisdata.huwise.com)
    DEFAULT_DOMAIN_URL: 'https://parisdata.huwise.com/',

    // List of pages, used by the gulp server and gulp update/compile commands.
    // the name/id/slug of the page MUST CORRESPOND to the page id on your Huwise portal.
    // it must also correspond to the ejs file name and scss file name.
    PAGES: ['kpi-education'],
};
