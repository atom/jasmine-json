(function() {
  var Failure, getKeys, objectSize, unorderedEqual,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  unorderedEqual = function(one, two) {
    var val, _i, _len;
    if (one.length !== two.length) {
      return false;
    }
    for (_i = 0, _len = one.length; _i < _len; _i++) {
      val = one[_i];
      if (__indexOf.call(two, val) < 0) {
        return false;
      }
    }
    return true;
  };

  getKeys = function(object) {
    var k, keys, v;
    keys = [];
    for (k in object) {
      v = object[k];
      if (object.hasOwnProperty(k)) {
        keys.push(k);
      }
    }
    return keys;
  };

  objectSize = function(object) {
    return getKeys(object).length;
  };

  Failure = (function() {
    function Failure(path, actual, expected) {
      this.path = path;
      this.actual = actual;
      this.expected = expected;
    }

    Failure.prototype.getMessage = function() {
      return "" + this.path + ":\n  actual:   " + this.actual + "\n  expected: " + this.expected;
    };

    return Failure;

  })();

  beforeEach(function() {
    return this.addMatchers({
      toEqualJson: function(expected) {
        var addFailure, appendToPath, compare, failures,
          _this = this;
        failures = {};
        addFailure = function(path, actual, expected) {
          path = path.join('.') || '<root>';
          return failures[path] = new Failure(path, actual, expected);
        };
        appendToPath = function(path, value) {
          return path.concat([value]);
        };
        compare = function(path, actual, expected) {
          var actualKeys, expectedKeys, i, key, value, _i, _len;
          if ((actual == null) && (expected == null)) {
            return;
          }
          if ((actual == null) || (expected == null)) {
            addFailure(path, JSON.stringify(actual), JSON.stringify(expected));
          } else if (actual.constructor.name !== expected.constructor.name) {
            addFailure(path, JSON.stringify(actual), JSON.stringify(expected));
          } else {
            switch (actual.constructor.name) {
              case "String":
              case "Boolean":
              case "Number":
                if (actual !== expected) {
                  addFailure(path, JSON.stringify(actual), JSON.stringify(expected));
                }
                break;
              case "Array":
                if (actual.length !== expected.length) {
                  addFailure(path, "has length " + actual.length + " " + (JSON.stringify(actual)), "has length " + expected.length + " " + (JSON.stringify(expected)));
                } else {
                  for (i = _i = 0, _len = actual.length; _i < _len; i = ++_i) {
                    value = actual[i];
                    compare(appendToPath(path, i), actual[i], expected[i]);
                  }
                }
                break;
              case "Object":
                actualKeys = getKeys(actual);
                expectedKeys = getKeys(expected);
                if (!unorderedEqual(actualKeys, expectedKeys)) {
                  addFailure(path, "has keys " + (JSON.stringify(actualKeys.sort())), "has keys " + (JSON.stringify(expectedKeys.sort())));
                } else {
                  for (key in actual) {
                    value = actual[key];
                    if (!actual.hasOwnProperty(key)) {
                      continue;
                    }
                    compare(appendToPath(path, key), actual[key], expected[key]);
                  }
                }
            }
          }
        };
        compare([], this.actual, expected);
        if (objectSize(failures)) {
          this.message = function() {
            var failure, key, messages;
            messages = [];
            for (key in failures) {
              failure = failures[key];
              messages.push(failure.getMessage());
            }
            return 'JSON is not equal:\n' + messages.join('\n');
          };
          return false;
        } else {
          this.message = function() {
            return _this.actual + ' is equal to ' + expected;
          };
          return true;
        }
      }
    });
  });

}).call(this);
