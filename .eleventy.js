const fs = require('fs');
const path = require('path');
const siteSettings = require('./src/globals/site.json');
const { getExecOutput } = require('@actions/exec');

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

  config.addCollection('postsByCreatedDate', async (collection) => {
    let posts = [...collection.getFilteredByGlob('src/posts/*.md')].filter(
      (post) => !post.data.draft
    );
    if (true || process.env.NODE_ENV === 'production') {
      let postsWithDate = [];
      for (let p of posts) {
        let file = p.inputPath;
        let cmd = `git log --follow --format=%ad --date default -- ${file}`;
        console.log(cmd);
        let { stdout } = await getExecOutput('git', [
          'log',
          '--follow',
          '--format=%ad',
          '--date',
          'default',
          '--',
          file,
        ]);
        let e = Date.parse(stdout.trim());
        let date = new Date(e);
        console.log(p.date, date);
        postsWithDate.push(p);
      }
      posts = postsWithDate;
    }
    return posts.sort((a, b) => {
      return b.date - a.date;
    });
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
