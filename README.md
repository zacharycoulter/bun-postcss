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

plugin(bunPostcss());

```

Then in your project add the following to your `bunfig.toml`:

```toml
preload = ["./plugins.ts"]
```

Then you are all set up and ready to configure PostCSS!

### Options

To configure PostCSS, you can either add the options directly into the `bunPostcss({ ... })` call or create a `postcss.config.ts` file

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

Read more here: https://github.com/postcss/postcss?tab=readme-ov-file#usage

### Tailwind example

Adding tailwind is easy.

Run the following to install Tailwind:
```
bun add -D tailwindcss
bunx tailwindcss init
```

In your PostCSS config add the Tailwind plugin:
```
module.exports = {
  plugins: {
    tailwindcss: {},
  }
}
```

Then just set up Tailwind however you like! Read more here: https://tailwindcss.com/docs/installation/using-postcss
