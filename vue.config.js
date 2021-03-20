let proxyObj = {};
proxyObj['/ws'] = {
    ws: true,
    target: 'ws://localhost:8081',
}
proxyObj['/'] = {
    ws: false,
    target: 'http://localhost:8081',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}
module.exports = {
	publicPath:'/sams',
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj
    }
}