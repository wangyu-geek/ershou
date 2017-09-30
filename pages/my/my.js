// my.js
import {User} from '../../utils/user.js';
var user = new User();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = user.getUserInfoWithStorage();
    this.setData({
      userInfo:userInfo
    })
  },
  // onPersonInfoTap:function(event){
  //   wx.navigateTo({
  //     url: '../person-info/person-info',
  //   })
  // },
  onCollectionTap:function(event){  
    wx.navigateTo({
      url: '../collection/collection',
    })
  },
  onContactTap:function(event){
    wx.navigateTo({
      url: '../contact-us/contact-us',
    })
  }
 
})