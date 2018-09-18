// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let util = require('util');
let common = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
        canvas : {
            default : null,
            type : cc.Node
        },
        bgNodeArr : {
            default : [],
            type : [cc.Node]
        },

        leadingNode : {
            default : null,
            type : cc.Node
        },
        bgControlNode : {
            default : null,
            type : cc.Node
        },
        playerControlNode : {
            default : null,
            type : cc.Node
        },
        barriesControlNode : {
            default : null,
            type : cc.Node
        },
        scoreLabel :{
            default : null,
            type : cc.Label
        },
        resultLabel : {
            default : null,
            type : cc.Label
        },
        revivalNode : {
            default : null,
            type : cc.Node
        },
        endGameNode : {
            default : null,
            type : cc.Node
        },
        text2 : {
            default : null,
            type : cc.Label
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        util.fiexScreenSize(this.canvas,this.bgNodeArr);

        common.sysInfo.ScreenHeight = this.bgNodeArr[0].height;
        common.sysInfo.ScreenWidth = this.bgNodeArr[0].width;

        this.openid = common.userInfo.openid ;

        this.registerListener();

        this.rocketRevival = false ; 
        this.vedioRevival = false ;

        this.bgScript = this.bgControlNode.getComponent('bgControl');
        this.playerScrpit = this.playerControlNode.getComponent('playerControl');  
        this.barriesScript = this.barriesControlNode.getComponent('barriesControl');
        this.barriesScript.loadSource();
        this.revivalScript = this.revivalNode.getComponent('revivalControl');
        this.endGameScript = this.endGameNode.getComponent('endGameControl');
        this.endGameScript.loadSource();//提前加载资源

        //预加载首页场景
        cc.director.preloadScene("Index", function () {
            console.log("Index scene preloaded");
        });

        if(this.openid){
             util.judgetWhereFrom(this.openid);
        }

        this.MusicPlayer1 = wx.createInnerAudioContext(); //背景音乐
        this.MusicPlayer1.volume = 1 ;
        this.MusicPlayer1.loop = true ;
        this.MusicPlayer1.src = util.getMusicSrc();

        this.MusicPlayer2 = wx.createInnerAudioContext(); //碰撞音效
        this.MusicPlayer2.volume = 1 ;
        this.MusicPlayer2.src = 'https://xcx-base.oss-cn-hangzhou.aliyuncs.com/astronaut_Game/bgMusic/gameOver.mp3';
        // 加广告
        let systemInfo = wx.getSystemInfoSync();
        let bannerWidth = systemInfo.windowWidth;
        let bannerHeight = 80;
        this.bannerAd = wx.createBannerAd({
          adUnitId: 'adunit-4cb609e0c0250a4a',
          style: {
            left: 0,
            top: systemInfo.windowHeight - bannerHeight,
            width: bannerWidth
          }
        })
        this.bannerAd.show();
        this.bannerAd.onResize(res => {
            this.bannerAd.style.top = systemInfo.windowHeight - this.bannerAd.style.realHeight;
        })

    },

    registerListener(){
        //监听撞死了事件
        this.node.on('game-over', this.gameOver,this);
        //监听过关了事件
        this.node.on('speed-up', this.speedUp,this);
        //监听速度加快事件
        this.node.on('break-level', this.breakLevel,this);
    },

    startGame(){
        this.leadingNode.active = false;

        this.bgScript.startGame();
        this.barriesScript.startGame();

        this.MusicPlayer1.play();
        this.bannerAd.hide();
    },

    gameOver(e){
        e.stopPropagation();

        this.bannerAd.show();

        this.MusicPlayer1.stop();
        this.MusicPlayer2.play();

        this.bgScript.endGame();
        this.barriesScript.endGame();

        let score = e.detail.score;
        //设置开放数据域信息
        this.setWxFriendInfo(score);

        setTimeout(()=>{
            this.playerControlNode.active = false;

            let curProgress = this.scoreLabel.string;
            curProgress = curProgress.substring(0,curProgress.length - 2);

            this.resultLabel.string = this.countPercent(curProgress) ;

            if ( this.rocketRevival && this.vedioRevival ) {
                //如果已经复活过两次了 跳过复活环节
                this.endGameNode.active = true;
            }else{
                //其他的再去判断
                this.revivalScript.showMyself(this.rocketRevival,this.vedioRevival);
            }

            this.endGameScript.level = this.bgScript.level ;
        },1000); 
    },

    speedUp(e){
        e.stopPropagation();

        // this.bgScript.speed += 0.5 ; 
        this.barriesScript.speed += 0.5 ;
    },

    //复活
    revival(){
        this.playerControlNode.active = true;
        this.MusicPlayer1.play();

        setTimeout(()=>{
            this.bgScript.startGame();
            this.barriesScript.revival();
        },1000)
    },

    //重新开始
    restart(){
        this.bannerAd.show();
        this.bgScript.reset();
        this.barriesScript.reset();
        this.revivalScript.reset();

        this.rocketRevival = false ;
        this.vedioRevival = false ;

        this.scoreLabel.string = '0%' ;
        this.playerControlNode.active = true ;
        this.endGameNode.active = false ; 

        this.leadingNode.active = true ;
    },

    //过关了
    breakLevel(e){
        if( e.detail ){
            let level = e.detail.level ;
            this.bgScript.breakLevel = true;
            this.bgScript.level = level;
        }
    },

    useRocket(){
        if(common.userInfo.coin >= 1){
            this.bannerAd.hide();
            util.pullRequest('decScore',{ openid : this.openid ,score : 1},(res)=>{
                console.log(res)
                if(res.code == 1){
                    //调使用火箭接口   返回成功回调  复活
                    this.rocketRevival = true ;

                    this.revivalNode.active = false ;

                    this.revival();

                    common.userInfo.coin -- ;
                }
            })
        }else{
            wx.showToast({
                title : '火箭不足',
                icon : 'loading',
                duration : 800,
            })
        }
    },

    watchVedio(){
        let self = this;

        util.showVedioAd1(this.openid,5,()=>{

        },(res)=>{
            wx.showToast({
                title : '观看成功',
                icon : 'success',
                duration : 500,
                success : ()=>{
                    self.vedioRevival = true ;

                    self.revivalNode.active = false ;

                    self.revival();
                    common.userInfo.coin += 5 ;
                }
            })
        });
    },

    shareAddRocket(){
        let shareData = util.getShareContent();

        wx.shareAppMessage({
            title : shareData.word,
            imageUrl : shareData.pic
        })

        util.pullRequest('IncScore',{openid : this.openid , score : 1},(res)=>{
            if(res.code == 1){
                common.userInfo.coin += 1 ;

                wx.showToast({
                    title : '火箭+1',
                    icon : 'success',
                    duration : 1500,
                });
            }
        });
    },

    jumpNext(){
        this.revivalNode.active = false ;
        this.endGameNode.active = true ; 
        this.bannerAd.hide();
    },

    backIndex(){
        cc.director.loadScene('Index');
    },

    start () {

    },

    setWxFriendInfo(score){
        util.pullRequest('getBigGrade',{openid : this.openid , grade : score},(res)=>{
            if(res.code == 1){
                wx.setUserCloudStorage({
                    KVDataList : [ {key: 'score', value: score.toString()} ]
                });
            }
        });
    },

    // update (dt) {},
    countPercent(num){
        let level = this.bgScript.level ; 
        let baseNum = 0 ;
        let totalnum = 20 ;

        switch( level ){
            case 0 : 
                baseNum = 0 ;
                totalnum = 20;
                break;
            case 1 : 
                baseNum = 20 ;
                totalnum = 25 ;
                break;
            case 2 : 
                baseNum = 45 ;
                totalnum = 30 ;
                break;
            case 3 : 
                baseNum = 75 ;
                totalnum = 35 ;
                break;
            case 4 : 
                baseNum = 110 ;
                totalnum = 40 ;
                break;
            case 5 : 
                baseNum = 150 ;
                totalnum = 45 ;
                break;
            case 6 : 
                baseNum = 195 ;
                totalnum = 50 ;
                break;
            case 7 : 
                baseNum = 245 ;
                totalnum = 55 ;
                break;
            case 8 : 
                baseNum = 300 ;
                totalnum = 60 ;
                break;
            case 9 : 
                baseNum = 360 ;
                totalnum = 65 ;
                break;
        }

        if( num >= 425){
            return '无穷无尽的英雄'
        }

        let percent = 100 - parseInt((num-baseNum)/totalnum*100) ;

        return (percent + '%');
    }
});
