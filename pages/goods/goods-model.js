import {Base} from '../../utils/base.js';

class Goods extends Base{ 

  getGoods(page,size,callback){
    if(!page){
      page = 1;
    }
    if(!size) {
      size = 15;
    }
    var param = {
      data:{
        page:page,
        size:size
      },
      url:'goods/paginate',
      method:'GET',
      sCallback:function(res){
        callback(res)
      }
    };
    this.request(param)
  }


}

export {Goods}