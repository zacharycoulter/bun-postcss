import { createRequire } from 'module'
import { type Config } from './types'

export default (config: Config, file: string): Config => {
    if (config.parser && typeof config.parser === 'string') {
        try {
            config.parser = createRequire(file)(config.parser)
        } catch (err: any) {
            throw new Error(`Loading PostCSS Parser failed: ${err.message}\n\n(@${file})`)
        }
    }

    if (config.syntax && typeof config.syntax === 'string') {
        try {
            config.syntax = createRequire(file)(config.syntax)
        } catch (err: any) {
            throw new Error(`Loading PostCSS Syntax failed: ${err.message}\n\n(@${file})`)
        }
    }

    if (config.stringifier && typeof config.stringifier === 'string') {
        try {
            config.stringifier = createRequire(file)(config.stringifier)
        } catch (err: any) {
            throw new Error(`Loading PostCSS Stringifier failed: ${err.message}\n\n(@${file})`)
        }
    }

    if (config.plugins) {
        delete config.plugins
    }

    return config
}

