var visit = require('unist-util-visit');


module.exports = function(remark, opts) {
  opts = Object.assign({
    replacements: []
  }, opts);

  var replacements = opts.replacements.map(function(replacement) {
    if(typeof(replacement) === "object") {
      return function(alt, url) {
        var rUrl = replacement.url;
        if(!(rUrl instanceof RegExp)) {
          rUrl = new RegExp("^"+rUrl+"$");
        }

        var matches = rUrl.exec(url);
        if(matches) {
          return replacement.template(alt, url, matches);
        }
      }
    }
    else if(typeof(replacement) === "function") {
      return replacement;
    }
    else {
      throw new Error("Invalid type");
    }
  });

  function findReplacement(replacements, url, alt) {
    for(var i=0; i<replacements.length; i++) {
      var replacement = replacements[i];
      var out = replacement(alt, url);
      if(out !== undefined) {
        return out;
      }
    }
  }

  return function(ast) {
    var defs = {};

    function replace(parent, node, index, replacement) {
      // replacement = Object.assign({}, node, replacement);
      parent.children.splice(index, 1, replacement);
    }

    visit(ast, 'image', function(node, index, parent) {
      var replacement = findReplacement(replacements, node.url, node.alt);

      if(replacement) {
        replace(parent, node, index, {
          type: "html",
          value: replacement,
          position: node.position,
          data: {
            width: 200,
            height: 200
          }
        })
      }
    });

    visit(ast, 'definition', function(node, index, parent) {
      defs[node.identifier] = {
        parent: parent,
        index: index,
        node: node
      };
    });

    visit(ast, 'imageReference', function(node, index, parent) {
      var id = node.identifier;

      if(defs.hasOwnProperty(id)) {
        var def = defs[id];

        replace(def.parent, def.node, def.index, {
          url: "http://example.com?url="+node.url
        });

        replace(parent, node, index, {
          alt: "PARSED",
          data: {
            width: 200,
            height: 200,
            hProperties: {
              width: 200,
              height: 200
            }
          }
        })
      }
    });
  }
};
