import path from 'path';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import htmlTemplate from 'vite-plugin-html-template'
import pages from "vite-plugin-pages";
import mpa from "vite-plugin-mpa";
import vueI18n from '@intlify/vite-plugin-vue-i18n'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 8200,
        /* proxy: {
            '/api': {
            target: 'http://192.168.2.16:8304',
            changeOrigin: true,
            rewrite: path => path.replace(/^\/api/, '')
            }
        }, */
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    build: {
        assetsDir: 'assets',
        manifest: false,
        outDir: 'dist',
        terserOptions: {
        compress: {
            keep_infinity: true,
            drop_debugger: true,
            drop_console: true,
        },
    },
    brotliSize: false,
    rollupOptions: {
            output: {
                assetFileNames: 'static/apps/css/[name].css',
                chunkFileNames: 'static/apps/js/[name].js',
                entryFileNames: 'static/apps/js/[name].js'
            }
        }
    },
    plugins: [
        vue(), 
        mpa({
        //     scanDir: 'src/pages',
        //     scanFile: 'main.js',
        }),
        htmlTemplate({
            pages: {
                main: {
                    template: 'public/index.html',
                    title: 'Hamonica Main',
                    entry: 'src/pages/main/main.js',
                },
                login: {
                    template: 'public/index.html',

                    title: 'Hamonica Login',
                },
                cache: {
                    template: 'public/index.html',

                    entry: 'src/pages/cache/main.js',
                    title: 'Hamonica Cache',
                }
            }
        }),
        pages({
            pagesDir: [
                { dir: "src/pages/**/pages", baseRoute: "" }
            ],
            exclude: ["**/components/*.vue"],
        }),

        vueI18n({
            // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
            compositionOnly: true,
        
            // you need to set i18n resource including paths !
            include: path.resolve(__dirname, './src/i18n/**')
        })
    ]
})
