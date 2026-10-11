import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function jsonDbPlugin() {
  const handleJsonRoute = (route, filename) => {
    return (req, res, next) => {
      const filePath = path.resolve(__dirname, `src/data/${filename}`)
      const publicPath = path.resolve(__dirname, `public/data/${filename}`)

      if (req.method === 'GET') {
        try {
          if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end(data)
            return
          }
        } catch (e) {
          console.error(`Error reading ${filename}`, e)
        }
        res.statusCode = 404
        res.end(JSON.stringify({ error: 'File not found' }))
        return
      }

      if (req.method === 'POST') {
        let body = ''
        req.on('data', chunk => {
          body += chunk
        })
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body)
            const formatted = JSON.stringify(parsed, null, 2)
            fs.writeFileSync(filePath, formatted, 'utf-8')
            if (fs.existsSync(path.dirname(publicPath))) {
              fs.writeFileSync(publicPath, formatted, 'utf-8')
            }
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, count: parsed.length }))
          } catch (err) {
            console.error(`Error saving ${filename}`, err)
            res.statusCode = 500
            res.end(JSON.stringify({ error: err.message }))
          }
        })
        return
      }

      next()
    }
  }

  return {
    name: 'json-db-plugin',
    configureServer(server) {
      server.middlewares.use('/api/customers', handleJsonRoute('/api/customers', 'customers.json'))
      server.middlewares.use('/api/staff', handleJsonRoute('/api/staff', 'staff.json'))
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), jsonDbPlugin()],
})
