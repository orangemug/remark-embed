var assert       = require("assert");
var fs           = require("fs");
var remark       = require("remark");
var embed        = require("../");
var readmeTester = require("readme-tester");

var remarkPlugins = {
  html: require("remark-html")
}


var TEST_FILES = [
  {
    title: "noembed",
    input:    fs.readFileSync(__dirname+"/data/noembed.input.md"),
    plugin:   require("./data/noembed.plugin.json"),
    noplugin: require("./data/noembed.noplugin.json"),
  },
  {
    title: "embed",
    opts: {
      replacements: [
        {
          url: /^http:\/\/example.com\/map\/([0-9]+)$/,
          template: function(url, matches, alt) {
            return '<iframe src="map-placeholder.html?id='+matches[1]+'&alt='+alt+'"></iframe>'
          }
        }
      ]
    },
    input:    fs.readFileSync(__dirname+"/data/embed.input.md"),
    plugin:   require("./data/embed.plugin.json"),
    noplugin: require("./data/embed.noplugin.json"),
  }
];

describe("remark-embed", function() {

  TEST_FILES.forEach(function(test) {
    it(test.title, function() {
      var ast = remark()
        .parse(test.input)

      var noPluginAst = remark()
        .run(ast)

      assert.deepEqual(noPluginAst, test.noplugin);

      var pluginAst = remark()
        .use(embed, test.opts)
        .run(ast)

      assert.deepEqual(pluginAst, test.plugin);
    });
  });

  it("README", function(done) {
    readmeTester(__dirname+"/../README.md", function(err, assertions) {
      assert.ifError(err);
      done();
    });
  });
});
