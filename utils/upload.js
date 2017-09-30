import {Config} from 'config.js';
var config = new Config();

class Upload {
    
    constructor() {
        this.url = config.baseUrl + 'upload?XDEBUG_SESSION_START=10708';
    }

    up(params) {
        wx.uploadFile({
            url: this.url,
            filePath: filePaths[0],
            name: 'file',
            success: function (res) {
                consile.log(res);
                var data = JSON.parse(res.data)
                console.log(data);
            }
        })
    }

}

export {Upload};