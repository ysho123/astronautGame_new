let common = require('common');

const URL = {
    login : "https://www.xc82.cn/explorer/User/login",
    saveUser : 'https://www.xc82.cn/explorer/User/saveUser',
    getUserInfo : 'https://www.xc82.cn/explorer/User/getUserInfo',
    addUserInviteLog : 'https://www.xc82.cn/explorer/User/addUserInviteLog',//添加用户邀请记录
    getUserInviteLog : 'https://www.xc82.cn/explorer/User/getUserInviteLog',//用户获取邀请记录
    setHonor : 'https://www.xc82.cn/explorer/Index/setHonor',//设置
    getHonorInfo : 'https://www.xc82.cn/explorer/Index/getHonorInfo',//获取星际荣誉信息
    decScore : 'https://www.xc82.cn/explorer/User/decScore',//减少火箭
    IncScore : 'https://www.xc82.cn/explorer/User/IncScore', //增加火箭
    getBigGrade : 'https://www.xc82.cn/explorer/User/maxM',
    getTzxcxInfo : 'https://www.xc82.cn/explorer/Index/getTzxcxInfo',//获取外部跳转记录
    review : 'https://www.xc82.cn//explorer/Index/review',//是否上线接口
};
const XID = 19 ;
const noop = function() {};
const KEY = 'astronaut';
const USERINFO = 'userinfo';

// 请求
function pullRequest(urlName,data,successCallBack,failCallBack = noop,completeCallBack = noop){
    wx.request({
        url: URL[urlName],
        method: 'POST',
        data: data,
        success: (res)=>{
            successCallBack(res.data);
        },
        fail: (err)=>{
            failCallBack(err);
        },
        complete: ()=>{
            completeCallBack();
        }
    })
}

// 拿openid
function getOpenId(callback){
    let openId = wx.getStorageSync(KEY);
    if(openId){
        // console.log('已经有openid了')
        callback(openId);
    }else{
        // console.log('还没有openid')
        wx.login({
            success:(data)=>{
                wx.request({
                    url: URL['login'],
                    method: 'POST',
                    data: { code : data.code, xid : XID },
                    success: (res)=>{
                        console.log('login接收数据：',res.data);
                        if(res.data.code == 1){
                            wx.setStorageSync(KEY,res.data.data.openid);
                            this.getAuthorize(res.data.data.uid);
                            callback(res.data.data.openid);
                        }
                    }
                })
            }
        })
    }
}

// 弹框用户授权
function getAuthorize(uid){
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo'] === true) { // 成功授权
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log('已经授权过了',res);
            },
            fail: res => {
              console.log(res)
            }
          })
        } else if (res.authSetting['scope.userInfo'] === false) { // 授权弹窗被拒绝
            console.log('授权弹窗被拒绝：',res)
            wx.openSetting({
                success: res => {
                  console.log(res)
                },
                fail: res => {
                  console.log(res)
                }
            })
        } else { // 没有弹出过授权弹窗
          wx.getUserInfo({
            success: res => {
              console.log('没有弹出过授权：',res.userInfo)
              let data = {
                id : uid,
                headimgurl : res.userInfo.avatarUrl,
                nickname : res.userInfo.nickName,
                sex : res.userInfo.gender,
                country : res.userInfo.country,
                province : res.userInfo.province,
                city : res.userInfo.city
              };
              wx.setStorageSync(USERINFO,res.userInfo);
              this.pullRequest('saveUser',data,(res)=>{
                // console.log('保存用户信息接收数据：',res)
                if(res.code == 1){
                    console.log('保存用户成功');
                }
               });
            },
            fail: res => {
              console.log(res)
              wx.openSetting({
                success: res => {
                  console.log(res)
                },
                fail: res => {
                  console.log(res)
                }
              })
            }
          })
        }
      }
    })
}

/**
 * 出现动作
 * @param {func} finished 回调函数
 */
const zoomInAction = function (finished = noop) {
    let callFunc = cc.callFunc(function(){
        finished && finished()
    })

    return cc.sequence(
        cc.fadeTo(-0.01, 1),
        cc.scaleTo(-0.01, 0.3),
        cc.fadeIn(0.3),
        cc.scaleTo(0.3, 1, 1),
        callFunc  
    )
}

/**
 * 消失动作
 * @param {func} finished 回调函数
 */
const zoomOutAction = function (finished = noop) {
    var callFunc = cc.callFunc(function(){
        finished && finished()
    });

    var seq = cc.spawn(
        cc.scaleTo(0.3, 0.4, 0.4),
        cc.fadeOut(0.5)
    )
    return cc.sequence(seq, callFunc);
}

const addUserInviteLog = function(come_openid){
    let enterData = wx.getLaunchOptionsSync();//返回小程序启动参数
    let invite_openid = enterData.query.invite_openid || '';
    console.log('被邀请进来的come_openid:',come_openid);
    console.log('发出邀请者的invite_openid:',invite_openid);
    if(invite_openid){
        pullRequest('addUserInviteLog',{come_openid,invite_openid},(res)=>{
            console.log('邀请成功');
        },(err)=>{
            console.log(err); 
        });
    }else{
        console.log('现在还没邀请')
    }
}

// 获取用户信息
const getUserInfo = function(openid,callback){
    pullRequest('getUserInfo',{openid: openid},(res)=>{
       // console.log('getUserInfo:',res)
       if(res.code == 1){
        callback(res.data.score);
       }
    });
}

const fiexScreenSize = function(canvasNode,bgNodeArr){
    if(canvasNode){
        canvasNode.getComponent(cc.Canvas).designResolution = cc.winSize;
    }

    if(bgNodeArr){
        bgNodeArr.forEach((item,key)=>{
            item.width = cc.winSize.width;
            item.height = cc.winSize.height;
        });
    }
}

// 获取荣誉信息
const getHonorInfo = function(openid,callback){
    pullRequest('getHonorInfo',{openid: openid},(res)=>{
       // console.log('getHonorInfo:',res)
       if(res.code == 1){
        callback(res);
       }
    });
}

const gameBigImage = [
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/earth_bg.png',//地球
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/mercury_bg.png',//水星
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/venus_bg.png',//金星
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/spark_bg.png',//火星
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/jupiter_bg.png',//木星
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/saturn_bg.png',//土星
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/uranus_bg.png',//天王星
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/neptune_bg.png',//海王星
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/pluto_bg.png'//冥王星
]
const barriesBigImage = [
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/barries_BigImg/game_obstacle_1.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/barries_BigImg/game_obstacle_2.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/barries_BigImg/game_obstacle_3.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/barries_BigImg/game_obstacle_4.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/barries_BigImg/game_obstacle_5.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/barries_BigImg/game_obstacle_6.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/barries_BigImg/game_obstacle_7.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/barries_BigImg/game_obstacle_8.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/barries_BigImg/game_obstacle_9.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/barries_BigImg/game_obstacle_10.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/barries_BigImg/game_obstacle_11.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/barries_BigImg/game_obstacle_12.png',
]
const endGameBigImage = [
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/again_pc_1.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/again_pc_2.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/again_pc_3.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/again_pc_4.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/again_pc_5.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/again_pc_6.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/again_pc_7.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/again_pc_8.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/again_pc_9.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/game_BigImg/again_pc_10.png',
]
const cardBigImage = [
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/card_BigImg/1.0.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/card_BigImg/2.0.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/card_BigImg/3.0.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/card_BigImg/4.0.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/card_BigImg/5.0.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/card_BigImg/6.0.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/card_BigImg/7.0.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/card_BigImg/8.0.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/card_BigImg/9.0.png',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/card_BigImg/10.0.png',
] 
const BigImage = {
    gameBigImage,
    barriesBigImage,
    endGameBigImage,
    cardBigImage
}
const SharePic = [
    'https://img.xc65.cn/uploads/read/20180831172242_2626.jpg',
    "https://img.xc65.cn/uploads/read/20180831172300_1311.jpg",
    "https://img.xc65.cn/uploads/read/20180831172332_6095.jpg",
    "https://img.xc65.cn/uploads/read/20180831172346_3419.png",
    "https://img.xc65.cn/uploads/read/20180831172406_1445.png",
    "https://img.xc65.cn/uploads/read/20180831172419_1070.png",
    ]

const ShareWord = [
        "过马路捡到一只来自太空的你~",
        "我差一点就要过关了，帮下忙",
        "再过5年，人类就可以移民火星了",
        "免费太空旅行，你也要试一下吗",
        "左右手协调的人最有成功潜质",
        "我还是个孩子啊！！死活过不了关啊！",
        "嘤嘤嘤，帮人家点一下嘛",
        "帮我点一下，大不了，你想怎么样都行嘛@",
        "你在左右闪避，我在追逐梦想"
    ]

const musicSrc = [
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/bgMusic/1.mp3',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/bgMusic/2.mp3',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/bgMusic/3.mp3',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/bgMusic/4.mp3',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/bgMusic/5.mp3',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/bgMusic/6.mp3',
    'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/bgMusic/9.mp3'
]

    const getShareContent = function(){
        let pic = SharePic[parseInt(Math.random()*6)];
        let word = ShareWord[parseInt(Math.random()*9)];
        return {
            pic,
            word
        }
    }

    const judgetWhereFrom = function(openid){
        let hasCounted = wx.getStorageSync('ENTER');

        if(hasCounted){
            return;
        }
        else{
            let enterData = wx.getLaunchOptionsSync();

            let scene = enterData.scene;
            let query = enterData.query;
            var queryArr = Object.getOwnPropertyNames(query);

            if(queryArr.length == 0){
                console.log('no参数,啥都不干')
            }else{
                let data = {
                    cxid : XID,
                    tzid : query.tzid,
                    scene : scene,  //场景来源
                    openid : openid 
                }
                pullRequest('getTzxcxInfo',data,(res)=>{
                    if(res.errcode == 1){
                        wx.setStorageSync('ENTER',true);
                    }
                });
            }
        }
    }

const getMusicSrc = function(){
    return musicSrc[parseInt(Math.random()*7)]
}

/**
 * 从远程加载图片
 * @param {图片路径} imgPath
 * @param {当前节点} targetNode
 */
const loadRemoteImage = function (imgPath, targetNode, cb) {
    if (!imgPath) return
    let type = imgPath.slice(imgPath.lastIndexOf('.') + 1) || 'png'
    cc.loader.load({url: imgPath, type: type}, function (error, texture) {
        targetNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture)
        cb && cb()
    })
}

/**
 * 从远程加载一组图片
 * @param {图片路径} imgPath
 * @param {当前节点} targetNode
 */
 const loadRemoteImageArr = function (nameStr,index, cb) {
    if (!BigImage[nameStr][index]) return
    let type = BigImage[nameStr][index].slice(BigImage[nameStr][index].lastIndexOf('.') + 1) || 'png'
    cc.loader.load({url: BigImage[nameStr][index], type: type}, function (error, texture) {
        let res = new cc.SpriteFrame(texture);
        cb && cb(res);
    })
}

let videoAdInstance1 = null;

const showVedioAd1 =function(openid,addNum,callback1,callback){
        if(!videoAdInstance1){
            videoAdInstance1 = wx.createRewardedVideoAd({
                adUnitId: 'adunit-97bc2fa902ba71e2'
            });

            videoAdInstance1.onClose((res)=>{
                if(res.isEnded){ 
                    pullRequest('IncScore',{openid : openid , score : addNum},(res)=>{
                        if(res.code == 1){
                            callback(res);

                            wx.showToast({
                                title : '领取成功',
                                icon : 'success',
                                duration : 1000,
                            })
                        }
                    },(err)=>{
                        wx.showToast({
                            title : '网络失败',
                            icon : 'loading',
                            duration : 1000,
                        })
                    },);
                }else{
                    wx.showToast({
                        title : '观看不完整',
                        icon : 'loading',
                        duration : 1000,
                    })
                }
            });
        }

        videoAdInstance1.load() 
        .then(() => {
            videoAdInstance1.show();
            callback1 && callback1();                
        })
        .catch((err) => {
             wx.showToast({
                title : '今日已上限',
                icon : 'loading',
                duration : 1000,
                success : () => callback1 && callback1()
            })
        });
    }

module.exports = {
    getOpenId : getOpenId,
    getAuthorize: getAuthorize,
    getUserInfo : getUserInfo,
    getHonorInfo : getHonorInfo,
    zoomInAction : zoomInAction,
    zoomOutAction : zoomOutAction,
    pullRequest : pullRequest,
    addUserInviteLog: addUserInviteLog,
    fiexScreenSize,
    loadRemoteImageArr,
    getShareContent,
    judgetWhereFrom,
    getMusicSrc,
    showVedioAd1
}

