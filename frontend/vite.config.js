// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   assetsInclude: ['**/*.glb'],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/', // change to '/' if username.github.io repo
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.glb'],
})
