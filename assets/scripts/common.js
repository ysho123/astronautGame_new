/**
    存放信息数据 
*/

let userInfo = {
    openid : '',
    coin : 0 ,
}

let honorInfo = [];

let sysInfo = {}

let score = 0 ; //分数，仅用于结束界面

let ifHidden = true ;

module.exports = {
    userInfo : userInfo,
    honorInfo : honorInfo,
    sysInfo,
    score ,
    ifHidden ,
}