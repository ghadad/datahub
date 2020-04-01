const glob = require('glob')
const titles = require("./titles");
let pages = {}
pages = {
    index: {
        // entry for the page
        entry: 'src/index.js',
        // the source template
        template: 'public/index.html',
        // output as dist/index.html
        filename: 'index.html',
        // when using title option,
        // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
        title: 'Index Page',
        // chunks to include on this page, by default includes
        // extracted common chunks and vendor chunks.
        chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    // when using the entry-only string format,
    // template is inferred to be `public/subpage.html`
    // and falls back to `public/index.html` if not found.
    // Output filename is inferred to be `subpage.html`.
    admin: 'pages/admin/main.js',
    hub: 'pages/hub/main.js',
    interface: 'pages/interface/main.js',
}
console.log("pages", pages)

module.exports = {
    lintOnSave: false,
    pages: pages,
    chainWebpack: config => {
        config.plugins.delete('named-chunks');
        config.module.rules.delete('eslint');
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                //pathRewrite: {
                //   '^/api': ''
                // }
            }
        }
    }
}