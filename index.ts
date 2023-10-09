import { plugin, type BunPlugin } from "bun";
import { isAbsolute, join } from "path";
import postcss, { type AcceptedPlugin } from "postcss";
import tailwindcss from "tailwindcss";

export type Options = {
    plugins?: AcceptedPlugin[];
    inputFile: string;
    outputFile: string;
}

export const bunPostcss = (options: Options): BunPlugin => {
    return {
        name: "TailwindCSS",
        async setup() {
            try {
                let inputFile = Bun.file(isAbsolute(options.inputFile) ? options.inputFile : join(process.cwd(), options.inputFile));
                let outputFile = Bun.file(isAbsolute(options.outputFile) ? options.outputFile : join(process.cwd(), options.outputFile));
                const result = await postcss(options.plugins ?? []).process(await inputFile.text(), { from: inputFile.name, to: outputFile.name })
                await Bun.write(outputFile, result.css);
                console.log('[bun-postcss]', `Compiled ${options.inputFile} to ${options.outputFile}`);
            } catch (e) {
                console.error('[bun-postcss]', `Failed to compile ${options.inputFile} to ${options.outputFile}:`, e);
            }
        },
    }
};

