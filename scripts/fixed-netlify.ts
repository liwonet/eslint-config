import fs from 'node:fs/promises'
import path from 'node:path'

async function findHTMLFile(dirPath: string): Promise<string[]> {
  const files = await fs.readdir(dirPath)

  const htmlFiles: string[] = []

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stats = await fs.stat(filePath)

    if (stats.isFile() && path.extname(filePath).toLowerCase() === '.html') {
      htmlFiles.push(filePath)
    }
  }
  return htmlFiles
}

async function fixedNetlify(filePath: string): Promise<void> {
  const FOOTER_HTML = `
<footer style="position:fixed; bottom:0; width:100%; text-align:center; padding:6px 0; font-size:0.8em; box-shadow:0 -2px 5px rgba(0,0,0,0.1);">
  <p>ESLint Config Inspector Preview. Powered by <a href="https://www.netlify.com/?source=liwo" rel="nofollow">Netlify</a>.</p>
</footer>
`
  const BODY_CLOSE_TAG_REGEX = /<\s*\/\s*body\s*>/i

  try {
    const htmlContent = await fs.readFile(filePath, 'utf8')
    const match = htmlContent.match(BODY_CLOSE_TAG_REGEX)

    if (match) {
      const closingBodyTag = match[0]
      const indexOfBodyEnd = htmlContent.lastIndexOf(closingBodyTag)

      if (indexOfBodyEnd !== -1) {
        const updatedHtml
          = htmlContent.substring(0, indexOfBodyEnd)
            + FOOTER_HTML
            + htmlContent.substring(indexOfBodyEnd)

        await fs.writeFile(filePath, updatedHtml, 'utf8')
        console.log(`Successfully processed file: ${filePath}`)
      }
      else {
        console.warn(`File ${filePath}: Found </body> using regex, but could not determine its exact last position. Skipping.`)
      }
    }
    else {
      console.warn(`File ${filePath} does not contain a <body> tag, skipping.`)
    }
  }
  catch (error) {
    console.error(`Error processing file ${filePath}:`, error)
  }
}

const files = await findHTMLFile('.eslint-config-inspector')

for (const file of files) {
  await fixedNetlify(file)
}

console.log('All files processed successfully.')
