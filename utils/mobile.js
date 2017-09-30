import {Base} from "base.js";

class Mobile extends Base{
    constructor(){
        super();
    }
    /**
     * 打电话
     * @param {*} mobileNumber 电话号码
     */
    call(mobileNumber){
        this.showModal('电话','是否拨打'+mobileNumber,mobileNumber,(res)=>{
            wx.makePhoneCall({
                phoneNumber:res
            })
        })
    }
}

export {Mobile};