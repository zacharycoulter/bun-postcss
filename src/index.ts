import { isAbsolute, join } from "path";
import postcss, { AcceptedPlugin } from "postcss";
import postcssrc, { type Config } from "postcss-load-config";
import { type BunPlugin } from "bun";

export const bunPostcss = (config: Config | null = null): BunPlugin => ({
    name: "bun-postcss",
    async setup() {
        try {
            if (!config) {
                config = await postcssrc({}, '', { searchPlaces: [process.cwd()] });
            }
            if (!config) throw new Error('no postcss config found')
            if (!config.to || !config.from) throw new Error('"to" and "from" must be specified')

            let inputFile = Bun.file(isAbsolute(config.to) ? config.to : join(process.cwd(), config.to));
            let outputFile = Bun.file(isAbsolute(config.from) ? config.from : join(process.cwd(), config.from));
            const result = await postcss(config.plugins as AcceptedPlugin[] ?? []).process(await inputFile.text(), { from: inputFile.name, to: outputFile.name })
            await Bun.write(outputFile, result.css);
            console.log('[bun-postcss]', `Compiled ${config.to} to ${config.from}`);
        } catch (e) {
            console.error('[bun-postcss]', `Failed to compile:`, e);
        }
    }
});
