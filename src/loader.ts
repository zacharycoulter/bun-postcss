import { lilconfig, type LilconfigResult } from 'lilconfig';
import yaml from 'yaml';
import { type Config } from './types';
import loadPlugins from './plugins';
import loadOptions from './options';

const extensions = ['rc', 'rc.json', 'rc.yaml', 'rc.yml', 'rc.ts', 'rc.js', 'rc.cjs', 'rc.mjs', '.config.ts', '.config.js', '.config.cjs', '.config.mjs'];

const yamlLoader = (_: string, content: string) => yaml.parse(content);
const importLoader = async (path: string, _: string) => await import(path);

const processResult = async (result: LilconfigResult): Promise<Config> => {
    if (!result || result?.isEmpty) throw new Error(`No PostCSS config found in: ${process.cwd()}`)

    const ctx = {
        cwd: process.cwd(),
        env: process.env.NODE_ENV
    }

    let { default: config } = await result.config;
    if (typeof config === 'function') config = config(ctx)
    else config = Object.assign({}, config, ctx)

    if (!config.plugins) config.plugins = []

    return {
        plugins: loadPlugins(config, config.file),
        ...loadOptions(config, config.file)
    }
}


export default async (): Promise<Config> => {
    const result = await lilconfig('postcss', {
        searchPlaces: [
            'package.json',
            ...extensions.map((ext) => `postcss${ext}`)
        ],
        loaders: {
            '.yaml': yamlLoader,
            '.yml': yamlLoader,
            '.js': importLoader,
            '.cjs': importLoader,
            '.mjs': importLoader,
            '.ts': importLoader,
        },
    }).search(process.cwd())
    return processResult(result)
}

