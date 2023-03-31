module.exports = {
    lintOnSave: false,
    css: {
        loaderOptions: {
            sass: {
                data: `
                @import "/public/assets/scss/_variable";
                @import "~bootstrap/scss/bootstrap";
                `
            }
        }
    },
    publicPath: '/'
};
