import {Config} from 'config.js';
import {User} from 'user.js';


class Token {

    constructor() {
      this.verifyUrl = Config.baseUrl + 'token/verify';
        this.tokenUrl = Config.baseUrl + 'token/user';
    }
    // 获取 token 判断 token 是否存在，
    // 存在向服务器校验 token
    // 不存在向服务器获取 token
    verify() {
        var token = wx.getStorageSync('token');
        if(!token) {
            this.getTokenFromServer();
        }
        else{
          this._veirfyTokenFromServer(token);
        }
    }

    _veirfyTokenFromServer(token) {
        var that = this;
        wx.request({
            url: that.verifyUrl,
            data: {},
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/json',
                'token': token,
            }, // 设置请求的 header
            success: function(res){ //判断结果
                if(!res.data.is_valid) {
                  that.getTokenFromServer();
                }
            }
        })
    }

    getTokenFromServer(callback,login) {
        var  that = this;
        wx.login({  //调用 login 后，获得 code 码， 
            success: function(res){
                console.log('getTokenFromServer login')
                console.log(res)
                wx.request({
                    url: that.tokenUrl,
                    data: {
                        code:res.code
                    },
                    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    // header: {}, // 设置请求的 header
                    success: function(res){
                      console.log('getTokenFromServer login request')
                      console.log(res);
                        var user = new User();
                        var token = res.data.token;
                        wx.setStorageSync('token', token);
                        callback && callback(res);
                        // if(login){
                            user.submitUserInfo();
                        // }
                    }
                })
            },
            fail:function(error){
                console.log('error');
                console.log(error);
            },
            complete:function(){
                console.log('complete');
            }
        })
    }

    getTokenFromLocal(){
       var token = wx.getStorageSync('token');
       return token;
    }
}

export{Token};