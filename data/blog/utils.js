module.exports.filterOnlyPosts = (item) => item['wp:post_type'] === 'post';
module.exports.filterOnlyPublished = (item) => item['wp:status'] === 'publish';

module.exports.cleanupWordpressTags = function (content) {
    const tags = ['caption', '/caption'];
    return content
        .split('\n')
        .filter(line => !line.startsWith('<!--'))
        .map(line => {
            tags.forEach(tag => {
                let tagStart = `[${tag}`;
                let start = line.indexOf(tagStart);
                while (start > -1) {
                    let end = line.indexOf(']', start) + 1;
                    let re = line.substring(start, end);
                    line = line.replace(re, '');
                    start = line.indexOf(tagStart);
                }
            });
            return line;
        })
        .join('\n');
};

module.exports.fixHeaderSpacing = function (content) {
    let flag = false;
    return content.split('\n')
        .map(line => {
            if (flag && !line.startsWith('\n')) line = '\n' + line;
            flag = line.indexOf('<h') > -1;
            return line;
        })
        .join('\n');
}

module.exports.convertHtmlToMarkdown = function (content) {
    const tags = [
        ['h1', '# ', ''],
        ['h2', '## ', ''],
        ['h3', '### ', ''],
        ['h4', '#### ', ''],
        ['h5', '##### ', ''],
        ['h6', '###### ', ''],
        ['div', '', ''],
        ['p', '', ''],
        ['pre', '```text\r\n', '\r\n```'],
        ['code', '`', '`'],
        ['em', '_', '_'],
        ['strong', '*', '*'],
        ['ul', '', ''],
        ['li', '- ', ''],
    ]

    return content.split('\n')
        .map(line => {
            tags.forEach(([tag, md_open, md_close]) => {
                let html_open = new RegExp(`<${tag}>`, 'ig');
                let html_close = new RegExp(`</${tag}>`, 'ig');
                let newLine = line.replace(html_open, md_open).replace(html_close, md_close);
                if (newLine !== line) {
                    line = newLine.trim();
                }
            });
            return line;
        })
        .join('\n');
};

module.exports.updateMediaLinks = function (content) {
    return content
        .split('\n')
        .map(line => {
            return line.replace('https://jaredbarbozablog.files.wordpress.com/', '/wordpress/');
        })
        .join('\n');
}

module.exports.decodeHtml = function (content) {
    const entities = [
        ['amp', '&'],
        ['apos', '\''],
        ['#x27', '\''],
        ['#x2F', '/'],
        ['#39', '\''],
        ['#038', '&'],
        ['#47', '/'],
        ['lt', '<'],
        ['gt', '>'],
        ['nbsp', ' '],
        ['quot', '"']
    ];

    entities.forEach(([key, value]) => {
        const restr = `&${key};`;
        const re = new RegExp(restr, 'g');
        content = content.replace(re, value);
    });

    return content;
}

module.exports.chain = function (content, ...fns) {
    for (var i = 0; i < fns.length; i++) {
        content = fns[i](content);
    }
    return content;
}