
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
    	buttonControl : {
    		default : null,
            type : cc.Node
    	},
    	reviveBtn : {
            default : null,
            type : cc.Node
        },
        inviteBtn : {
            default : null,
            type : cc.Node
        },
        friendNode : {
            default : null,
            type : cc.Node
        },
        inviteNode : {
            default : null,
            type : cc.Node
        },
        coinNum : {
            default : null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    	util.fiexScreenSize(this.canvas,this.bgNodeArr);
    	
        common.sysInfo.ScreenHeight = this.bgNodeArr[0].height;
        common.sysInfo.ScreenWidth = this.bgNodeArr[0].width;
        this.bgNodeArr[0].height += 100;

    	util.getOpenId(
    		(openid)=>{
    			this.openid = openid;
    			// openid存全局
    			common.userInfo.openid = openid;
    			console.log('common里面的openid',common.userInfo.openid);
    			// 获取用户金币/头像/昵称
		    	util.getUserInfo(openid,
		    		(coin)=>{
						this.coin = coin;
						common.userInfo.coin = coin;
				    	// 改变金币数
				    	 this.coinNum.string = common.userInfo.coin || 0;
		    		}
		    	)
    			// 添加用户邀请记录
    			util.addUserInviteLog(openid);
    			// 获取荣誉信息
    			this.getHonorInfo(this.openid);
    		}
    	)		

    	// 宇航员动画
    	this.loadAstroAnimation();

    	this.inviteNode.getComponent('invite').indexScript = this;
    	this.friendNode.getComponent('rankDisplay').indexScript = this;
	
        wx.showShareMenu();//打开右上角转发 

        let shareData = util.getShareContent();
        wx.onShareAppMessage((res)=>{
            return {
                title : shareData.word,
                imageUrl : shareData.pic
            }
        });

        //预加载首页场景
        cc.director.preloadScene("Game", function () {
            console.log("Game scene preloaded");
        });
        //预加载荣誉场景
        cc.director.preloadScene("Honor", function () {
            console.log("Honor scene preloaded");
        });
    	//决定是否展示分享按钮
        util.pullRequest('review',{},(res)=>{
            console.log(res) ;
            if(res.is_review == 1){
                common.ifHidden = true ;
            }
        });
    },

	//首页加载宇航员变化动画
	loadAstroAnimation(){
		let anim = this.node.getChildByName('character_1').getComponent(cc.Animation);
		anim.play('astronaut');
	}, 

	// 开始游戏
	startGame(){
		cc.director.loadScene('Game');
	},

    start () {

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
                    if(self.coinNum){
                        self.coinNum.string = parseInt(self.coinNum.string) + 5 ; 
                        common.userInfo.coin += 5 ;
                    }
                }
            })
        });
    },

    // 邀请
    showInvite(){
    	this.inviteNode.active = true;
    	this.inviteNode.getChildByName('invite_bk').runAction(util.zoomInAction());
    },

    // 星际荣誉
    showHonor(){
    	cc.director.loadScene('Honor');
    },

    stopButtons(){
    	this.buttonControl.children.forEach((item)=>{
    		item.getComponent(cc.Button).interactable = false;
    	});
    },
    activeButtons(){
		this.buttonControl.children.forEach((item)=>{
            item.getComponent(cc.Button).interactable = true;
        });
    },

    /*荣誉信息*/
    getHonorInfo(openid){
 		util.getHonorInfo(openid,
    		(res)=>{
				console.log('荣誉信息res',res)
				if(res.code == 1){
					if(res.data){
						common.honorInfo = res.data;
					}
				}
    		}
    	)
    },

    //显示排行榜 
    showFriendRank(){
        this.friendNode.active = true;
    },
    // 关闭排行榜
    closeFriendRank(){
        this.friendNode.active = false;
    },
    // 查看群排行-分享
    shareFriendRank(){
    	let shareData = util.getShareContent();
    	wx.shareAppMessage({
            title : shareData.word,
            imageUrl : shareData.pic
        })
    }
    // update (dt) {},
});
