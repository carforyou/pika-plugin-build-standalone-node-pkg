// Modified version of https://www.npmjs.com/package/@pika/plugin-build-node
import rollupBabel from "rollup-plugin-babel"
import { rollup } from "rollup"
import path from "path"
import fs from "fs"
import builtinModules from "builtin-modules"
import babelPluginDynamicImport from "babel-plugin-dynamic-import-node-babel-7"
import { BuilderOptions, MessageError } from "@pika/types"
import babelPresetEnv from "@babel/preset-env"
import babelPluginImportMetaSyntax from "@babel/plugin-syntax-import-meta"
import babelPluginDynamicImportSyntax from "@babel/plugin-syntax-dynamic-import"

const defaultEntrypoint = "main"
const defaultMinNodeVersion = "8"

export function manifest(manif, { options }: BuilderOptions) {
  if (options.entrypoint !== null) {
    let keys = options.entrypoint || [defaultEntrypoint]
    if (typeof keys === "string") {
      keys = [keys]
    }
    for (const key of keys) {
      manif[key] = manif[key] || path.join("dist-node", "index.js")
    }
  }
}

export async function beforeJob({ out }: BuilderOptions) {
  const srcDir = path.join(out, "dist-src")
  const srcFile = path.join(srcDir, "node.js")

  if (!fs.existsSync(srcDir)) {
    throw new MessageError(
      `${srcDir} does not exist, or was not yet created in the pipeline.`
    )
  }
  if (!fs.existsSync(srcFile)) {
    throw new MessageError(
      `"${srcFile}" is the expected entrypoint, but it does not exist.`
    )
  }
}

export async function build({
  out,
  reporter,
  options,
}: BuilderOptions): Promise<void> {
  const outFile = path.join(out, "dist-node", "index.js")
  const srcFile = path.join(out, "dist-src", "node.js")

  const result = await rollup({
    input: srcFile,
    external: builtinModules as string[],
    plugins: [
      rollupBabel({
        babelrc: false,
        compact: false,
        presets: [
          [
            babelPresetEnv,
            {
              modules: false,
              targets: {
                node: options.minNodeVersion || defaultMinNodeVersion,
              },
              spec: true,
            },
          ],
        ],
        plugins: [
          babelPluginDynamicImport,
          babelPluginDynamicImportSyntax,
          babelPluginImportMetaSyntax,
        ],
      }),
    ],
    onwarn: (warning, defaultOnWarnHandler) => {
      // Unresolved external imports are expected
      if (
        warning.code === "UNRESOLVED_IMPORT" &&
        !(warning.source.startsWith("./") || warning.source.startsWith("../"))
      ) {
        return
      }
      defaultOnWarnHandler(warning)
    },
  })

  await result.write({
    file: outFile,
    format: "cjs",
    exports: "named",
    sourcemap: options.sourcemap === undefined ? true : options.sourcemap,
  })
  reporter.created(outFile, "main")
}
