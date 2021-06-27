import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel"
import replace from "@rollup/plugin-replace"

export default {
    input: "src/main.ts",

    external: [
        'create-response',
        'http-request',
        'cookies',
        'text-encode-transform',
        'url-search-params',
        'streams',
        'log',
        'resolvable'
    ],

    preserveModules: false,

    output: {
        dir: "dist",
        format: "es"
    },

    plugins: [
        typescript(),
        commonjs(),
        babel({ babelHelpers: 'bundled' }),
        resolve(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
            preventAssignment: true
        })
    ]
};