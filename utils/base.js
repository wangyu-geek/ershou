import {Config} from 'config.js';
import {Token} from 'token.js';

class Base {
  /**
   * 获得事件输入的值
   */
  getEventValue(event) {
    return event.detail.value;
  }

  request(params,noRefetch) {
    var that = this;
    var token = wx.getStorageSync('token');
    var method = params.method ? params.method : 'GET';
    wx.request({
      url: Config.baseUrl + params.url,
      data: params.data,
      method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'token': token
      }, // 设置请求的 header
      success: function (res) {
        var code = res.statusCode.toString();
        var startCode = code.charAt(0);
        if(startCode == "2"){
          if(params.sCallback){
            params.sCallback && params.sCallback(res);
          }
        }
        else{
          console.log('令牌无效')
          if(code == "401"){  //令牌无效
            if(!noRefetch){
              that._refetch(params);
            }
          }
          else{
            params.eCallback && params.eCallback(res.data);
          }
        }
        
      },
      fail:function(error){
        console.log(error)
      },
      complete:function(){
        // that.hideLoading();
      }
    })
  }
  /**
   * 重新请求
   */
  _refetch(params){
    var token = new Token();
    token.getTokenFromServer((res)=>{
      this.request(params,true)
    })
  }

  showLoading(title, mask) {
    wx.showLoading({
      title: title,
      mask: mask ? mask : false
    });
  }

  hideLoading() {
    wx.hideLoading();
  }

  getEventData(event, key) {
    var data = event.currentTarget.dataset;
    
    if (key != null) {
      return data[key];
    }
    else{
      return data;
    }
    
  }
  /**
   * 设置剪贴板
   * @param {*} data 
   */
  setClipboardData(data) {
    var that = this;
    wx.setClipboardData({
      data: data,
      success: function (res) {
        that.showToast('已复制到剪贴板');
      }
    })
  }
  showToast(title,icon) {
    wx.showToast({
      title: title,
      duration: 1300,
      icon:icon == null?"success":icon,
    })
  }
  /**
   * 
   * @param {*} title 标题
   * @param {*} content 内容
   * @param {*} data sCallback 的参数
   * @param {*} sCallback 成功的回调函数
   * @param {*} eCallback 失败
   */
  showModal(title, content, data, sCallback, eCallback) {
    wx.showModal({
      title: title,
      content: content,
      success: function (res) {
        if (res.confirm) { //用户点击了确定
          sCallback && sCallback(data)
        } else if (res.cancel) { //点击取消
          eCallback && eCallback()
        }
      },

    })
  }
  /**
   * 将数组中的字符串进行截取，并加 *号
   */
  substrContacts(data) {
    var str = '';
    for (let i = 0; i < data.length; i++) {
      str = data[i].contact_number ? data[i].contact_number.substring(0, 3) : '';
      data[i]["substr_contact"] = str + "********";
    }
    return data;
  }

  subString(contact_number) {
    if (contact_number != "") {
      var str = contact_number ? contact_number.substring(0, 3) : '';
      contact_number = str + "********";
      return contact_number;
    } else {
      return "";
    }
  }
}



export {
  Base
};