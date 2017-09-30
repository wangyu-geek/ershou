import {Image} from '../../utils/image.js';
import {Base} from '../../utils/base.js';


class Good extends Base{

  constructor(){
    super();

    this.submit_info = {
      'imgs_url':[],
      'contact_way':'mobile',
      'contact_number':-1,
      'description':'',
      'can_be_knife':false,
      'original_price':0,
      'sale_price':0,
      'postage_free':false,
    }
  }

  /**
   * 格式化表单数据
   * @param {*} info 
   */
  formatGoodInfo(info){
    var submit_info = {
      'imgs_url':[],
      'contact_way':'mobile',
      'contact_number':-1,
      'description':'',
      'can_be_knife':false,
      'original_price':0,
      'sale_price':0,
      'postage_free':false,
    };
    for(var i = 0;i < 4;i++){ // 图片
      if( typeof(info[i]) != "undefined") {
        submit_info.imgs_url.push(info[i]);
      }
    }

    submit_info['contact_way'] = info.contact_way;  //联系方式
    submit_info['contact_number'] = info.contact_number;//号码
    submit_info['description'] = info.description;  //商品描述
    submit_info['can_be_knife'] = info.can_be_knife.length != 0 ? true:false; //可刀
    submit_info['original_price'] = info.original_price;  // 原价
    submit_info['sale_price'] = info.sale_price;
    submit_info['postage_free'] = info.postage_free;  //包邮
    
    return submit_info;
  }
  /**
   * 校验表单数据
   * @param {*} data 
   * @param {*} callback 
   */
  checkFormData(data,callback){
      if( typeof(data[0]) == 'undefined'){
        callback && callback('请为物品添加个配图吧~');
        return false;
      }
      if(data.sale_price == "") {
        callback && callback('还没输入要卖多少钱呢~');
        return false;
      }
      return true;
  } 



  saveGoodOnServer(sendData,callback) { // 先保存图片
    var image = new Image();
    // console.log('sendData')
    // console.log(sendData)
    image.saveImageOnServer(sendData['imgs_url'],(res) => {

      // this.submit_info.imgs_url.push(res.img_url)
      sendData['imgs_url'] = res

      this._saveGoodInfoOnServer(sendData, callback);
    });

  }

  _saveGoodInfoOnServer(sendData,callback)
  {
    var param = {
      data:sendData,
      url:'goods?XDEBUG_SESSION_START=18128',
      method:'POST',
      sCallback:callback
    };

    this.request(param);
  }
}

export {Good};