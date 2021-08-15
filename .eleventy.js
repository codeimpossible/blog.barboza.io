const fs = require('fs');
const path = require('path');
const siteSettings = require('./src/globals/site.json');

module.exports = (config) => {
  config.addPlugin(require('@11ty/eleventy-plugin-syntaxhighlight'), {
    templateFormats: ['md']
  });

  const filters = fs.readdirSync(path.resolve(__dirname, './filters'))
    .filter(f => f.endsWith('.js'))
    .forEach(f => {
      let name = f.replace('.js', '');
      let filePath = path.resolve(__dirname, './filters', f);
      console.log(`:: loading filter: ${name}, ${filePath}`);
      config.addFilter(name, require(filePath));
    });

  config.addPassthroughCopy({ public: './' });

  config.setBrowserSyncConfig({
    files: ['dist/**/*'],
    open: true,
  });

  config.setDataDeepMerge(true);

  config.addCollection('postsWithoutDrafts', (collection) =>
    [...collection.getFilteredByGlob('src/posts/*.md')].filter(
      (post) => !post.data.draft
    )
  );

  return {
    pathPrefix: siteSettings.baseUrl,
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'includes',
      layouts: 'includes/layouts',
      data: 'globals',
    },
  };
};
