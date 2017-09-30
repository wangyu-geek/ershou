import {Config} from 'config.js';
import {Base} from 'base.js';
import {Token} from 'token.js';

var base = new Base();
var token = new Token();


class Image {

  constructor() {
    this.chooseImgCount = 4; // 总数量
    this.selectedImgCount = 0; // 已选数量
    this.selectingImgCount = 4; //可选数量
    this.selectedImgs = [];
    this.uploadUrl = 'upload?XDEBUG_SESSION_START=15301';
    this.uploadFinish = false; //上传完成
  }

  chooseImg(callback) {
    this.selectingImgCount = this.chooseImgCount - this.selectedImgCount;

    var that = this;
    if (this.selectingImgCount <= 0) { // 判断是否还能选择图片
      callback && callback(false);
      return;
    }
    wx.chooseImage({
      count: that.selectingImgCount, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var chooseNum = res.tempFilePaths.length; //一次选择的照片数量
        that.selectedImgCount += chooseNum; // 已选照片数量
        that.selectingImgCount = that.chooseImgCount - that.selectedImgCount; // 可选数量
        that.selectedImgs = that.selectedImgs.concat(res.tempFilePaths); // 追加已选图片的数组
        callback && callback(that.selectingImgCount, that.selectedImgs);
      },
      fail: function () {
        console.log('fail')
      }
    })
  }
  /**
   * 保存图片到服务器
   */
  saveImageOnServer(images, callback) {
    var that = this;
    var uploadImage = [];

    base.showLoading('发布中',true);
    for (let i = 0; i < images.length; i++) {

      wx.uploadFile({
        url: Config.baseUrl + this.uploadUrl,
        filePath: images[i],
        name: 'file',
        header: {
          token: token.getTokenFromLocal()
        },
        success: function (res) {
          if(res.statusCode == 201)
          {
            var data = JSON.parse(res.data);
            uploadImage.push(data.img_url);
            if (images.length - i == 1) {
              that.uploadFinish = true;
              callback && callback(uploadImage)
            } else {
              that.uploadFinish = false;
            }
          }
         
          if(res.statusCode == '201'){
            wx.showToast({
            title:'上传成功',
            icon:'success',
            duration:1000
            })
          }
          else if (res.statusCode == '401'){
            wx.showToast({
            title:'令牌异常',
            icon:'loading',
            duration:1500
            })
            return;
          }
          else{
            wx.showToast({
              title: '图片上传失败',
              icon: 'loading',
              duration: 1500
            })
            return;
          }
          
          
        },
      })
    }

  }
  /**
   * 数据初始化
   */
  init() {
    this.chooseImgCount = 4; // 总数量
    this.selectedImgCount = 0; // 已选数量
    this.selectingImgCount = 4; //可选数量
    this.selectedImgs = [];
  }
}

export {
  Image
};