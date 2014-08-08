# Jasmine JSON matcher

Comparing large objects with jasmine works great until you get an error, when it
dumps the entire object to the console in a completely human unreadable format.

This package adds a `toEqualJson` matcher to jasmine that will generate nice
diffs on error. It will tell you which keys differ, and why.

```coffee
# In your spec helper
require 'jasmine-json'

# In your specs

describe "something", ->
  it "tests json", ->
    someObject =
      one: 1
      two: 2
        three: 3
        four: 4

    expect(someObject).toEqualJson
      one: 1
      two: 2
        three: 5
        four: 4
```
