
let util = require('util');
let common = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
        honorNum:{
        	default : null,
            type: cc.Label
        },
        lockName:{
        	default : null,
            type: cc.Label
        },
        leftBtn:{
        	default : null,
            type: cc.Node
        },
        rightBtn:{
        	default : null,
            type: cc.Node
        },
        noHonorImg:{
        	default : null,
            type: cc.SpriteFrame
        },
        cardSprite :{
        	default : null,
            type: cc.Node
        },
    },


    onLoad () {

        util.getOpenId(
    		(openid)=>{
    			this.openid = openid;
    			// 获取荣誉信息
		    	if(common.honorInfo){
		    		this.honorData = common.honorInfo;
		    		this.honorLength = this.honorData.length;

					this.honorNum.string = this.honorData.length;
					this.countNum = this.honorData.length;
					if(this.honorLength == 1){
						this.leftBtn.active = false;
					}else if(this.honorLength == 10){
						this.rightBtn.active = false;
					}

					// 荣誉标题
					this.lockName.string = '解锁到'+ this.honorData[this.honorData.length-1].title;
					// 荣誉图片
					let honor_img  = new cc.SpriteFrame(this.honorData[this.honorData.length-1].img); 

					this.node.getChildByName('credit_pc_1').getComponent('cc.Sprite').spriteFrame = honor_img;
					
					//卡片界面
					this.cardSprite.getComponent('cardControl').frontSpriteFrame = honor_img ;
					this.cardSprite.getComponent('cardControl').defaultCardSpriteFrame = honor_img ;
    				this.cardSprite.getComponent('cardControl').level = this.honorData.length-1 ;
		    	}else{
		    		this.getHonorInfo(this.openid);
		    	}
    		}
    	);

    	this.cardSprite.getComponent('cardControl').loadSource();
   		
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

    start () {

    },

    getHonorInfo(openid){
 		util.getHonorInfo(openid,
    		(res)=>{
				console.log('荣誉信息res',res)
				if(res.code == 1){
					if(res.data){
						this.honorData = res.data;
						this.honorLength = this.honorData.length;
						this.honorNum.string = this.honorData.length;
						this.countNum = this.honorData.length;
						
						if(this.honorLength == 1){
							this.leftBtn.active = false;
						}else if(this.honorLength == 10){
							this.rightBtn.active = false;
						}

						// 荣誉标题
						this.lockName.string = '解锁到'+ this.honorData[this.honorData.length-1].title;
						// 荣誉图片
						let honor_img  = new cc.SpriteFrame(this.honorData[this.honorData.length-1].img); 

						this.node.getChildByName('credit_pc_1').getComponent('cc.Sprite').spriteFrame = honor_img;
						
						//卡片界面
						this.cardSprite.getComponent('cardControl').frontSpriteFrame = honor_img ;
						this.cardSprite.getComponent('cardControl').defaultCardSpriteFrame = honor_img ;
	    				this.cardSprite.getComponent('cardControl').level = this.honorData.length-1 ;
					}
				}
    		}
    	)
    },
   
    toRightSwitch(){
        // 回调函数--------------------------------
        var finished = cc.callFunc(function () {
        	this.leftBtn.active = true;
        	let CardImg ;
    		// 荣誉数量控制
	    	if(this.countNum < this.honorLength){
	    		this.honorNum.string++;
	            this.rightBtn.interactable = true;
	            this.countNum++;
	            let honor_img0  = new cc.SpriteFrame(this.honorData[this.countNum-1].img); 
	            CardImg = honor_img0;
				this.node.getChildByName('credit_pc_1').getComponent('cc.Sprite').spriteFrame = honor_img0;
				this.lockName.string = '解锁到'+ this.honorData[this.countNum-1].title;
				if(this.countNum == 10){
		        	this.rightBtn.interactable = false;
		        	this.rightBtn.active = false;
		    	}
	        }else{
	        	this.countNum++;
	        	this.honorNum.string = this.countNum;
	        	this.rightBtn.interactable = false;
	        	this.rightBtn.active = false;
	            this.node.getChildByName('credit_pc_1').getComponent('cc.Sprite').spriteFrame = this.noHonorImg;
	            CardImg = this.noHonorImg;
	        }
	    	this.node.getChildByName('credit_pc_1').x = 608;
	    	var actionLeft1 = cc.moveTo(0.3, cc.v2(0, 0));
	    	this.node.getChildByName('credit_pc_1').runAction(actionLeft1);

	    	//卡片界面
			this.cardSprite.getComponent('cardControl').frontSpriteFrame = CardImg ;
			this.cardSprite.getComponent('cardControl').defaultCardSpriteFrame = CardImg ;
			this.cardSprite.getComponent('cardControl').level = this.countNum-1 ;
			this.cardSprite.getComponent('cardControl').clickNum = 0 ;
			this.cardSprite.scaleX = 1 ;

		}, this);
		
    	let actionLeft = cc.sequence(cc.moveTo(0.3, cc.v2(-608, 0)), finished);
    	this.node.getChildByName('credit_pc_1').runAction(actionLeft);
    },

   
    toLeftSwitch(){
        // 回调函数--------------------------------
        var finished = cc.callFunc(function () {
        	this.rightBtn.active = true;
        	let CardImg ;
    		// 荣誉数量控制
	        if(this.countNum > 1){
	        	this.countNum--;
	        	this.honorNum.string--;
	          
	            let honor_img0  = new cc.SpriteFrame(this.honorData[this.countNum-1].img); 
	            CardImg = honor_img0;
				this.node.getChildByName('credit_pc_1').getComponent('cc.Sprite').spriteFrame = honor_img0;
				this.lockName.string = '解锁到'+ this.honorData[this.countNum-1].title;
				 if(this.countNum == 1){
	            	this.leftBtn.active = false;
				 }else{
					this.rightBtn.active = true;
				 }
	        }else{
	        	this.honorNum.string = this.countNum;
	            let honor_img1  = new cc.SpriteFrame(this.honorData[0].img); 
				this.node.getChildByName('credit_pc_1').getComponent('cc.Sprite').spriteFrame = honor_img1;
				CardImg = honor_img1;
	        }
	    	
	    	this.node.getChildByName('credit_pc_1').x = -608;
	    	var actionRight1 = cc.moveTo(0.3, cc.v2(0, 0));
	    	this.node.getChildByName('credit_pc_1').runAction(actionRight1);

	    	//卡片界面
			this.cardSprite.getComponent('cardControl').frontSpriteFrame = CardImg ;
			this.cardSprite.getComponent('cardControl').defaultCardSpriteFrame = CardImg ;
			this.cardSprite.getComponent('cardControl').level = this.countNum-1 ;
			this.cardSprite.getComponent('cardControl').clickNum = 0 ;
			this.cardSprite.scaleX = 1 ;
		}, this);
    	
    	let actionRight = cc.sequence(cc.moveTo(0.3, cc.v2(608, 0)), finished);
    	this.node.getChildByName('credit_pc_1').runAction(actionRight);
    },

    // 返回游戏主页
	returnInex(){
		cc.director.loadScene('Index');
		this.bannerAd.hide();
	}
    // update (dt) {},
});
