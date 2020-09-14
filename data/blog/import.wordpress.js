const xml = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

const {
    chain,
    decodeHtml,
    fixHeaderSpacing,
    filterOnlyPosts,
    filterOnlyPublished,
    cleanupWordpressTags,
    updateMediaLinks,
    convertHtmlToMarkdown,
} = require('./utils');

const postTemplate = path.resolve(__dirname, './post.njk');
const backupFile = path.resolve(__dirname, './wordpressbackup.xml');
const backupContents = fs.readFileSync(backupFile);
const postTemplateTxt = fs.readFileSync(postTemplate).toString();
const outputPath = path.resolve(__dirname, '../../src/posts/');

const importOptions = {
    ignoreAttributes: false,
};

const json = xml.parse(backupContents.toString(), importOptions);
const importBatch = json.rss.channel.item
    .filter(item => filterOnlyPosts(item) && filterOnlyPublished(item));

importBatch
    .forEach(item => {
        let content = chain(item['content:encoded'], cleanupWordpressTags, fixHeaderSpacing, decodeHtml, updateMediaLinks, convertHtmlToMarkdown);
        let excerpt = chain(item['excerpt:encoded'], cleanupWordpressTags, decodeHtml);
        let safeTitle = item['wp:post_name'].replace(/[^\w\s-_]/gi, '').substr(0, 32);
        let mdFileName = `${safeTitle}.md`;
        let tags = ['post'].concat(item.category.filter(c => c['@_domain'] === 'post_tag').map(c => c['#text']));
        let postMarkdown = nunjucks.renderString(postTemplateTxt, {
            content,
            excerpt: excerpt.replace(new RegExp('\"', 'ig'), '\''),
            publishDate: item['wp:post_date_gmt'],
            title: decodeHtml(item.title),
            path: safeTitle,
            path_prefix: '/post/',
            tags,
        });
        const filePath = path.resolve(outputPath, mdFileName);
        fs.writeFileSync(filePath, postMarkdown);
    });