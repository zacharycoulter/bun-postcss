import { type Config, type ConfigPlugin } from "./types"
import { createRequire } from 'module'

const load = (plugin: string, options: {}, file: string): ConfigPlugin => {
    try {
        if (!options) {
            return createRequire(file)(plugin)
        } else {
            return createRequire(file)(plugin)(options)
        }
    } catch (err: any) {
        throw new Error(`Loading PostCSS Plugin failed: ${err.message}\n\n(@${file})`)
    }
}

export default (config: Config, file: string): (false | ConfigPlugin)[] => {
    let plugins: (false | ConfigPlugin)[] = [];

    if (Array.isArray(config.plugins)) {
        plugins = config.plugins.filter(Boolean);
    } else {
        const keys = Object.keys(config.plugins ?? {});
        for (const key of keys) {
            if (!config.plugins) continue;
            plugins.push(load(key, config.plugins[key], file));
        }
    }

    for (let plugin of plugins as any[]) {
        if (plugin.default) plugin = plugin.default;

        if (plugin.postcss === true) plugin = plugin();
        else if (plugin.postcss) plugin = plugin.postcss;

        if (
            !(
                (typeof plugin === 'object' && Array.isArray(plugin.plugins)) ||
                (typeof plugin === 'object' && plugin.postcssPlugin) ||
                (typeof plugin === 'function')
            )
        ) {
            throw new TypeError(`Invalid PostCSS Plugin found at: plugins[${plugin}]\n\n(@${file})`)
        }
    }

    return plugins;
}
