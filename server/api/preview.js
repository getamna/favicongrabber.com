const request = require("./request.conf");
const cheerio = require("cheerio");
const querystring = require("querystring");

module.exports = (previewUrl) => {
    let url = querystring.unescape(previewUrl);
    if (!url.startsWith("http")) {
        url = "http://" + url;
    }
    console.log(url);
    return new Promise((resolve, reject) => {
        request(url, (err, res, page) => {
            if (err) reject(err);

            // if (res.statusCode !== 200) return done(null, []);
            if (page && typeof page !== "string" && !(page instanceof String))
                return reject({});

            const $ = cheerio.load(page, {
                // ignore case for tags and attribute names
                lowerCaseTags: true,
                lowerCaseAttributeNames: true,
            });

            const getMetaTag = (name) => {
                return (
                    $(`meta[name=${name}]`).attr("content") ||
                    $(`meta[name="og:${name}"]`).attr("content") ||
                    $(`meta[name="twitter:${name}"]`).attr("content") ||
                    $(`meta[property=${name}]`).attr("content") ||
                    $(`meta[property="og:${name}"]`).attr("content") ||
                    $(`meta[property="twitter:${name}"]`).attr("content")
                );
            };

            const metaTagData = {
                url: url,
                domain: new URL(url).hostname,
                title: getMetaTag("title") || $(`h1`).text(),
                img: getMetaTag("image"),
                description: getMetaTag("description") || $(`p`).text(),
            };

            let {
                description
            } = metaTagData;
            if (description.length > 200) {
                metaTagData.description = description.substring(0, 200) + "...";
            }

            resolve(metaTagData);
        });
    });
};