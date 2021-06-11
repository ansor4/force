/* eslint-disable jest/no-jasmine-globals */
import { danger } from "danger"
import * as fs from "fs"

/**
 * Helpers
 */
const filesOnly = (file: string) =>
  fs.existsSync(file) && fs.lstatSync(file).isFile()

// Modified or Created can be treated the same a lot of the time
const getCreatedFiles = (createdFiles: string[]) =>
  createdFiles.filter(filesOnly)

/**
 * Rules
 */

function preventDefaultQueryRenderImport() {
  const newQueryRendererImports = getCreatedFiles(
    danger.git.created_files
  ).filter(filename => {
    const content = fs.readFileSync(filename).toString()
    return content.includes("<QueryRenderer")
  })
  if (newQueryRendererImports.length > 0) {
    fail(`Please use \`<SystemQueryRenderer />\` instead of \`<QueryRender />\`. This prevents double fetching during the server-side render pass. See:
> ${newQueryRendererImports.map(filename => `\`${filename}\``).join("\n")}`)
  }
}

;(async function () {
  preventDefaultQueryRenderImport()
})()
