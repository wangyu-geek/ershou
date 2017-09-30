class Number {

    constructor() {
        this.reg = new RegExp(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/);
    }

    isMoney(number) {
        if (this.reg.test(number)) {
            return true;
        } else {
            return false;
        }
    }

    // 如果第一次输入为小数点，则加0.
    // 如超过 100万 或小于0，给提示
    // 只能输入一次小数点
    Money(number,max) {
        if(!max)
        {
          max = 1000000.0;
        }
        if (number == "") {
            return "";
        }

        if (number == ".") { //第一个输入小数点
            return "0.";
        }
        number = number.toString();
        //校验小数点
        var nums = number.split("."); //校验 5. 5.8.4  5.8 这样的情况
        console.log('nums');
        console.log(nums);
        console.log('number');
        console.log(number);
        if (nums.length == 2 && nums[1] == "") {
            return number;
        }

        if (nums.length > 2) {
            return false;
        }
        number = parseFloat(number);
        if (this.isMoney(number)) {
          if (number >= 0.0 && number < max) {
                return number;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    setInput(number, before_input_num, callback,max_num) {
        var result = null;
        if(!max_num){
            result = this.Money(number);
        }
        else{
            result = this.Money(number,max_num);
        }
        if (number == null) {
            callback && callback(0);
            return;
        }

        if (typeof (result) != "boolean" || result != false) {
            callback && callback(result)
            return;
        } else { // 条件不成立，返回原数
            callback && callback(before_input_num);
            return;
        }
    }
    /**
     * 截取字符串
     */
    subStr(str, start, end) {
        var sub_str = str.substring(start, end)
        return sub_str;
    }
}
export {
    Number
};