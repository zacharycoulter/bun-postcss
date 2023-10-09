import Processor from 'postcss/lib/processor';
import { Plugin, ProcessOptions, Transformer } from 'postcss';
import { Options as ConfigOptions } from "lilconfig";

declare function postcssrc(
    ctx?: BunPostCSS.ConfigContext,
    path?: string,
    options?: ConfigOptions
): Promise<BunPostCSS.Result>;

declare namespace BunPostCSS {
    export interface ProcessOptionsPreload {
        parser?: string | ProcessOptions['parser'];
        stringifier?: string | ProcessOptions['stringifier'];
        syntax?: string | ProcessOptions['syntax'];
    }

    export type RemainingProcessOptions = Pick<
        ProcessOptions,
        Exclude<keyof ProcessOptions, keyof ProcessOptionsPreload>
    >;

    export interface Context {
        cwd?: string;
        env?: string;
    }

    export type ConfigContext = Context &
        ProcessOptionsPreload &
        RemainingProcessOptions;

    export type ResultPlugin = Plugin | Transformer | Processor;

    export interface Result {
        file: string;
        options: ProcessOptions;
        plugins: ResultPlugin[];
    }

    export type ConfigPlugin = Transformer | Plugin | Processor;

    export interface Config {
        parser?: string | ProcessOptions['parser'] | false;
        stringifier?: string | ProcessOptions['stringifier'] | false;
        syntax?: string | ProcessOptions['syntax'] | false;
        map?: string | false;
        from?: string;
        to?: string;
        plugins?: Array<ConfigPlugin | false> | Record<string, object | false>;
    }

    export type ConfigFn = (ctx: ConfigContext) => Config | Promise<Config>;
}

export = BunPostCSS;
