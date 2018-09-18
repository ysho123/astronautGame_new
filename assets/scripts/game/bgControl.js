// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let common = require('common');
let util = require('util');

cc.Class({
    extends: cc.Component,

    properties: {
    	defaultSprite : {
			default : null,
    		type : cc.SpriteFrame
    	},
    	bgArr : {
    		default : [],
    		type : [cc.Node]
    	},
    	compassNode : {
			default : null,
    		type : cc.Node
    	},
    	speed : 10,
    	breakLevel : false , //是否通过当前等级
    	level : 0, //当前等级
    	gameStartFlag : false,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
    	this.bgSpriteMap = new Map();

    	this.loadRemoteBigImage();//从远程加载大图资源

    	this.changeTimes = 0 ; //换图次数 因为有两张背景图，每一次更换要换两次
    	this.ScreenHeight = this.bgArr[0].height; //屏幕的高度(适配后的值)
    	this.ScreenWidth = this.bgArr[0].width;

    	this.compassScript = this.compassNode.getComponent('compassControl');
    },

    startGame(){
    	this.gameStartFlag = true;
    },

    endGame(){
    	this.gameStartFlag = false;
    },

    start () {
    	this.bgArr[0].y = 0;
    	this.bgArr[1].y = this.ScreenHeight - 2;
    },

    update (dt) {
    	if(this.gameStartFlag){
	    	this.move();
    		this.overCheck();
    	}
    },

    move(){
    	this.bgArr.forEach((item,key)=>{
    		item.y -= this.speed;
    	});
    },

    overCheck(){
    	for(let i=0;i<this.bgArr.length;i++){
    		if( this.bgArr[i].y <= -this.ScreenHeight ){
    			this.checkBreakLevel(this.bgArr[i]);
    			this.bgArr[i].y = this.bgArr[1-i].y + this.ScreenHeight - 2;
    		}
    	}
    },

    checkBreakLevel(bgNode){
    	if(this.breakLevel){
    		let nextSpriteFrame = this.bgSpriteMap.get(this.level-1) || this.defaultSprite ;
			bgNode.getComponent(cc.Sprite).spriteFrame = nextSpriteFrame
			this.changeTimes ++ ;
			if( this.changeTimes>= 2 ){
				//换了两次以后
				this.breakLevel = false;
				this.changeTimes = 0 ;

				this.compassScript.level = this.level ; 
			}
    	}
    },

    loadRemoteBigImage(){
    	for( let i=0; i<9 ; i++ ){
    		util.loadRemoteImageArr('gameBigImage',i,(spriteFrame)=>{
    			this.bgSpriteMap.set(i,spriteFrame);
    		})
    	}
    },

    reset(){
    	this.bgArr.forEach((item)=>{
    		item.getComponent(cc.Sprite).spriteFrame = this.defaultSprite ; 
    	})
    	this.compassScript.level = 0 ;
    	this.speed = 7;
    	this.level = 0 ;
    	this.breakLevel = false;
    	this.changeNum = 0 ;
    }
});
