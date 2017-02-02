# remark-embed
Change images to embeds

[![stability-unstable](https://img.shields.io/badge/stability-unstable-yellow.svg)][stability]
[![Build Status](https://circleci.com/gh/orangemug/remark-embed.png?style=shield)][circleci]

[stability]:   https://github.com/orangemug/stability-badges#unstable
[circleci]:    https://circleci.com/gh/orangemug/remark-embed

This assumes that a url can be represented as both an images and an embeddable object. For example the following markdown

```markdown
![example_feature](cartoverse.com/feature/example1)
```

Can be represented as both an image and an interactive element (a map) therefore depending on the context we want to embed it as such


## Install
To install

```
npm install orangemug/remark-embed
```


## Usage
Example usage

```js
var remark = require("remark");

var html = remark()
  .use(embed, {
    replacements: [
      {
        regexp: /^http:\/\/example.com\/map\/([0-9]+)$/,
        handle: function(url, matches, alt) {
          return '<iframe src="'+url+'"></iframe>';
        }
      }
    ]
  })
  .use(html)
  .process("![Simple Map](http://example.com/map/1)");

assert.equal(html, '<p><iframe src="http://example.com/map/1"></iframe></p>');
```


## License
[MIT](LICENSE)
