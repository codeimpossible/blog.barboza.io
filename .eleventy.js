const fs = require('fs');
const path = require('path');
const siteSettings = require('./src/globals/site.json');
const { getExecOutput } = require('@actions/exec');
const { inspect } = require('util');

module.exports = (config) => {
  config.addPlugin(require('@11ty/eleventy-plugin-syntaxhighlight'), {
    templateFormats: ['md'],
  });

  const filters = fs
    .readdirSync(path.resolve(__dirname, './filters'))
    .filter((f) => f.endsWith('.js'))
    .forEach((f) => {
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

  config.addCollection('posts', async (collection) => {
    let posts = [...collection.getFilteredByGlob('src/posts/*.md')].filter(
      (post) => !post.data.draft
    );
    let postsWithDate = [];
    for (let p of posts) {
      let file = p.inputPath;
      if (p.data && !p.data.date) {
        let { stdout } = await getExecOutput('git', [
          '--no-pager',
          'log',
          '--follow',
          '--format=%ad',
          '--date',
          'default',
          '--',
          file,
        ]);
        if (stdout) {
          let dates = (stdout || '').split('\n');
          let e = Date.parse(dates[dates.length - 2].trim());
          let date = new Date(e);
          p.data.date = date;
        }
      }
      console.log(`${p.data.date} - ${p.data.title} - ${p.inputPath}`);
      postsWithDate.push(p);
    }
    posts = postsWithDate;
    posts = posts.sort((a, b) => {
      return b.date - a.date;
    });
    return posts;
  });

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
