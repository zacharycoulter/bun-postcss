import { isAbsolute, join } from "path";
import postcss, { AcceptedPlugin } from "postcss";
import postcssrc, { type Config } from "postcss-load-config"
import { type BunPlugin } from "bun";

const processCss = async (from: string, to: string, plugins: any) => {
    const inputFile = Bun.file(isAbsolute(from) ? from : join(process.cwd(), from));
    const outputFile = Bun.file(isAbsolute(to) ? to : join(process.cwd(), to));
    const result = await postcss(plugins as AcceptedPlugin[] ?? []).process(await inputFile.text(), { from: inputFile.name, to: outputFile.name })
    await Bun.write(outputFile, result.css);
    console.log('[bun-postcss]', `Compiled ${from} to ${to}`);
    return
}

export const bunPostcss = (config: Config | null = null): BunPlugin => ({
    name: "bun-postcss",
    async setup() {
        try {
            let from, to, plugins;
            if (config) {
                from = config.from;
                to = config.to;
                plugins = config.plugins;
            } else {
                const loaded = await postcssrc();
                if (!loaded) throw new Error('no postcss config found')
                from = loaded.options.from;
                to = loaded.options.to;
                plugins = loaded.plugins;
            }
            if (from && !to) await processCss(from, from.replace(/\.css$/, '_out.css'), plugins)
            else if (from && to) await processCss(from, to, plugins)
        } catch (e) {
            console.error('[bun-postcss]', `Failed to compile:`, e);
        }
    }
})
