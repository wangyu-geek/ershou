import { Config } from 'config.js';

// import {Base} from 'base.js';

class User {

  submitUserInfo() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意小程序使用用户信息
              wx.getUserInfo({
                success: function (res) {
                  var rawData = JSON.parse(res.rawData);
                  // rawData = that.formatUserInfo(rawData);
                  that.setUserInfo(rawData);
                }
              })
            }
          })
        }
        else{
          wx.getUserInfo({
            success: function (res) {
              var rawData = JSON.parse(res.rawData);
              // rawData = that.formatUserInfo(rawData);
              that.setUserInfo(rawData);
            }
          })
        }
      }
    })
  }

  setUserInfo(rawData) {
    var that = this;
    wx.setStorageSync('userInfo', rawData);
    wx.request({
      url: Config.baseUrl + 'user?XDEBUG_SESSION_START=13365',
      data: {
        nick_name: rawData.nickName,
        gender: rawData.gender,
        city: rawData.city,
        province: rawData.province,
        country: rawData.country,
        avatar_url: rawData.avatarUrl
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'token': wx.getStorageSync('token'),
        'content-type': 'application/json'
      }, // 设置请求的 header
      success: function (res) {
        var code = res.statusCode.toString();
        var startCode = code.charAt(0);
        if (startCode == "2") {
          console.log('用户信息设置成功')
        }
      }
    })
  }
  /**
   * wx.getUserInfo 返回结果
   * avatarUrl => avatar_url
   * city
   * country
   * gender
   * language
   * nickName => nick_name
   * province
   */
  formatUserInfo(data)
  {
    var formatData = {
      avatar_url:data['avatarUrl'],
      city: data['city'],
      country:data['country'],
      gender:data['gender'],
      language:data['language'],
      nick_name:data['nickName'],
      province:data['province']
    }
    return formatData;
  }
  /**
   * 从缓存获取用户信息
   */
  getUserInfoWithStorage()
  {
    var userInfo = wx.getStorageSync('userInfo');
    return userInfo;

  }
}

export { User }