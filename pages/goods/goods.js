import {Goods} from 'goods-model.js';
import {Mobile} from '../../utils/mobile.js';
import {Collection} from '../../utils/collection.js';

var goods = new Goods();
var mobile = new Mobile();
var collect = new Collection();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo:[],
    page : 1,
    size : 15,
    isLoading:false,
    hasMore:true, //还有更多数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
    this.getGoods();
  },
  onShow:function(options){
    var refresh = wx.getStorageSync('goodsRefresh');//是否刷新页面
    if(refresh)
    {
      console.log('goods show');
      this.init();
      this.getGoods();
      wx.setStorageSync('goodsRefresh', false);
    }

  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    this.init();  //初始化变量
    this.getGoods();//加载商品
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getGoods();
  },

  onAddTap: function(event) {
    wx.navigateTo({
      url: '../add-good/add-good'
    })
  },

  testTap: function(event){
    wx.navigateTo({
      url: '../test/test',
    })
  },
  form: function(){
    wx.navigateTo({
      url: '../form/form',
    })
  },
  /**
   * 获得商品
   */
  getGoods: function(){
    var page = this.data.page;
    var size = this.data.size;
    if(this.data.isLoading){
      return;
    }
    else{
      this.setData({
        isLoading:true
      })
    }
    if(!this.data.hasMore){
      return;
    }
    else{
      wx.showNavigationBarLoading();
      goods.getGoods(page,size,(res) => {
        console.log('res')
        console.log(res)
        var data = res.data.data;
        data = goods.substrContacts(data);
        data = this.data.goodsInfo.concat(data); // 合并旧数据
        this.setData({
          goodsInfo:data,
          isLoading:false,
          page:this.data.page+1,  //页面加 1
          hasMore:res.data.has_more
        })
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      });
    }
  },
  /**
   * 商品被点击
   */
  onGoodTap:function(event){
    var id = goods.getEventData(event,'id');
    wx.navigateTo({
      url: '../good-detail/good-detail?id='+id,
    })
  },
  /**
   * 联系方式
   */
  onContactTap:function(event) {
    var data = goods.getEventData(event);
    var contactWay = data['contactWay'];
    var contactNumber = data['contactNumber'];
    if(contactWay == "QQ" || contactWay == "微信"){
      goods.setClipboardData(contactNumber);
    }
    else if(contactWay == "手机") {
      mobile.call(contactNumber)
    }
    else{
      return;
    }
  },  
  /**
   * 初始化
   */
  init:function(){
    this.setData({
      page:1,
      size:15,
      isLoading:false,
      hasMore:true,
      goodsInfo:[],
    })
  },
  /**
   * 喜欢
   */
  onLikeTap:function(event){
    console.log('event')
    console.log(event);
    var data = goods.getEventData(event);
    var id = data['id']
    var index = data['index'];
    var collected = !data['collected'];
    collect.changeCollected(id,collected,(res)=>{
      this.data.goodsInfo[index]['user_collect'][0] = {collected:collected};
      if(collected){
        this.data.goodsInfo[index]['collect_count']++;
      }
      else{
        this.data.goodsInfo[index]['collect_count']--;
      }
      this.setData({
        goodsInfo:this.data.goodsInfo
      })
    })
  },
  /**
   * 转发
   */
 onShareAppMessage: function (res) {
    
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      var id = res.target.dataset.id;
      return {
        title: '河工大淘二手',
        url:'/pages/good-detail/good-detail?id='+id,
        success: function(res) {
          // 转发成功
          console.log('商品转发成功')
          console.log(res)
        },
        fail: function(res) {
          // 转发失败
          console.log('转发失败');
          console.log(res)
        }
      }
    }
    else{
      return {
        title: '河工大淘二手',
        url:'/pages/goods/goods',
        success: function(res) {
          // 转发成功
          console.log('列表转发成功')
          console.log(res)
        },
        fail: function(res) {
          // 转发失败
          console.log('转发失败');
          console.log(res)
        }
      }
    }

  }
})