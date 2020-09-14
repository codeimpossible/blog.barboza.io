const xml = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

const { chain, decodeHtml, filterOnlyPosts, filterOnlyPublished, cleanupWordpressTags, updateMediaLinks } = require('./utils');

const postTemplate = path.resolve(__dirname, './post.njk');
const backupFile = path.resolve(__dirname, './wordpressbackup.xml');
const backupContents = fs.readFileSync(backupFile);
const postTemplateTxt = fs.readFileSync(postTemplate).toString();

const importOptions = {
    ignoreAttributes: false,
};

const json = xml.parse(backupContents.toString(), importOptions);
const importBatch = json.rss.channel.item
    .filter(item => filterOnlyPosts(item) && filterOnlyPublished(item))
    .slice(0, 1);
console.log(importBatch);

importBatch
    .forEach(item => {
        let content = chain(item['content:encoded'], cleanupWordpressTags, decodeHtml, updateMediaLinks);
        let excerpt = chain(item['excerpt:encoded'], cleanupWordpressTags, decodeHtml);
        let postMarkdown = nunjucks.renderString(postTemplateTxt, {
            content,
            excerpt,
            slug: item['wp:post_name'],
            publishDate: item['wp:post_date_gmt'],
            title: item.title,
            tags: item.category.filter(c => c['@_domain'] === 'tag').map(c => c['#text'])
        });
        console.log(postMarkdown);
    });