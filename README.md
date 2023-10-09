# bun-postcss

### Getting started

To install:
```bash
bun add bun-postcss -d
```

Create a plugins.ts and add the following:

```typescript
import { plugin } from 'bun';
import { bunPostcss } from "bun-postcss";

plugin(bunPostcss({
    plugins: [],
    inputFile: "src/app.css",
    outputFile: "src/static/styles.css",
}));

```

Then in your project add the following to your `bunfig.toml`:

```toml
preload = ["./plugins.ts"]
```

Then you are all set up and ready to configure PostCSS!

### Options

Most PostCSS runners accept two parameters:

* An array of plugins.
* An object of options.

Common options:

* `syntax`: an object providing a syntax parser and a stringifier.
* `parser`: a special syntax parser (for example, [SCSS]).
* `stringifier`: a special syntax output generator (for example, [Midas]).
* `map`: [source map options].
* `from`: the input file name (most runners set it automatically).
* `to`: the output file name (most runners set it automatically).
