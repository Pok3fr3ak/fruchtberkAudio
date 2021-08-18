module.exports={
    plugins: [
        ['@electron-forge/plugin-webpack', {
            mainConfig: './webpack.electron.js',
            renderer: {
                config: "./webpack.react.js",
                entryPoints:[
                    {
                        html:"./index.html",
                        js: "./renderer.js",
                        name:"FruchtberkAudio"
                    }
                ]
            }
        }]
    ]
}