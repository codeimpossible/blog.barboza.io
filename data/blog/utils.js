module.exports.filterOnlyPosts = (item) => item['wp:post_type'] === 'post';
module.exports.filterOnlyPublished = (item) => item['wp:status'] === 'publish';

module.exports.cleanupWordpressTags = function (content) {
    return content
        .split('\n')
        .filter(line => !line.startsWith('<!--'))
        .map(line => {
            let start = line.indexOf('[caption');
            while (start > 0) {
                let end = line.indexOf(']', start);
                let re = line.substring(start, end);
                line = line.replace(re, '');
                start = line.indexOf('[caption');
            }
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
    var entities = [
        ['amp', '&'],
        ['apos', '\''],
        ['#x27', '\''],
        ['#x2F', '/'],
        ['#39', '\''],
        ['#47', '/'],
        ['lt', '<'],
        ['gt', '>'],
        ['nbsp', ' '],
        ['quot', '"']
    ];

    for (var i = 0, max = entities.length; i < max; ++i)
        content = content.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);
    return content;
}

module.exports.chain = function (context, ...fns) {
    for (var i = 0; i < fns.length; i++) {
        context = fns[i](context);
    }
    return context;
}