var assert       = require("assert");
var fs           = require("fs");
var remark       = require("remark");
var embed        = require("../");
var readmeTester = require("readme-tester");

var remarkPlugins = {
  html: require("remark-html")
}


var TEST_FILES = {
  noembed: {
    input:    fs.readFileSync(__dirname+"/data/noembed.input.md"),
    plugin:   require("./data/noembed.plugin.json"),
    noplugin: require("./data/noembed.noplugin.json"),
  },
  embed: {
    input:    fs.readFileSync(__dirname+"/data/embed.input.md"),
    plugin:   require("./data/embed.plugin.json"),
    noplugin: require("./data/embed.noplugin.json"),
  }
};

describe("remark-embed", function() {

  var embedOpts = {
    replacements: [
      {
        regexp: /^http:\/\/example.com\/map\/([0-9]+)$/,
        handle: function(url, matches, alt) {
          return '<iframe src="map-placeholder.html?id='+matches[1]+'&alt='+alt+'"></iframe>'
        }
      }
    ]
  };

  it("noembed", function() {
    var ast = remark()
      .parse(TEST_FILES.noembed.input)

    var noPluginAst = remark()
      .run(ast)

    assert.deepEqual(noPluginAst, TEST_FILES.noembed.noplugin);

    var pluginAst = remark()
      .use(embed, embedOpts)
      .run(ast)

    assert.deepEqual(pluginAst, TEST_FILES.noembed.plugin);
  });

  it("embed", function() {
    var ast = remark()
      .parse(TEST_FILES.embed.input)

    var noPluginAst = remark()
      .run(ast)

    assert.deepEqual(noPluginAst, TEST_FILES.embed.noplugin);

    var pluginAst = remark()
      .use(embed, embedOpts)
      .run(ast)

    assert.deepEqual(pluginAst, TEST_FILES.embed.plugin);
  });

  it("README", function(done) {
    readmeTester(__dirname+"/../README.md", function(err, assertions) {
      assert.ifError(err);
      done();
    });
  });

});
