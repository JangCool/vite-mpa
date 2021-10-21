import path from 'path';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
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
    //빌드 속도 향상.. 빌드 파일 압축 비활성화
    brotliSize: false,
    rollupOptions: {
            //public에서 호출하는 static과 이름이 겹칠수 있기때문에
            //static 하위에 apps라는 폴더를 만들어 어플리케이션과 직접 연관된 파일들을 따로 저장한다.
            output: {
                assetFileNames: 'static/apps/css/[name].css',
                chunkFileNames: 'static/apps/js/[name].js',
                entryFileNames: 'static/apps/js/[name].js'
            }
        }
    },
    plugins: [
        vue(), 
        pages({
            pagesDir: [
                { dir: "src/pages/**/pages", baseRoute: "" }
            ],
            exclude: ["**/components/*.vue"],
        }),
        mpa(),
        vueI18n({
            // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
            compositionOnly: true,
        
            // you need to set i18n resource including paths !
            include: path.resolve(__dirname, './src/i18n/**')
        })
    ]
})
