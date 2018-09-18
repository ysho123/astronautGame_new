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

const barriesSize = {
    width : 142 ,
    height : 142
}

const playerSize = {
    width : 120 ,
    height : 263
}

cc.Class({
    extends: cc.Component,

    properties: {
        barriesPrefab:{
            default : null,
            type : cc.Prefab
        },
        defaultSpirteFrame : {
            default : null,
            type : cc.SpriteFrame
        },
        player1 : {
            default : null,
            type : cc.Node
        },
        player2 : {
            default : null,
            type : cc.Node
        },
        scoreNode :{
            default : null,
            type : cc.Node
        },
        initiateSpeed : 8,
        speed : 1,
        gameStartFlag : false, //是否开始游戏的标志位
        curScore : 0, //当前分数
    },

    onLoad () {
        util.fiexScreenSize(null,[this.node]);//调整当前节点的尺寸，防止坐标不准确

        this.ScreenWidth = common.sysInfo.ScreenWidth ||  750 ;
        this.ScreenHeight = common.sysInfo.ScreenHeight ||  1334 ;

        this.barriesPool = new cc.NodePool();

        this.activeBarries = []; //当前活跃的障碍物队列，一个二维数组[[b1,b2],[b1,b2]]

        this.player1Anim = this.player1.getComponent(cc.Animation);
        this.player2Anim = this.player2.getComponent(cc.Animation);
    },

    loadSource(){
        this.barriesSpriteMap = new Map();//远程获取的图片资源
        this.loadBarriesBigImg();
    },

    startGame(){
        //1、产生第一对障碍物 加入在场的队列
        //2、障碍物开始下移 开始障碍物检测，当障碍物通过y=200时，生产另一个
        this.getBarries();

        this.gameStartFlag = true;  

        this.player1.scale = 1;
        this.player1.color = cc.color('#FFFFFF');
        this.player2.scale = 1;
        this.player2.color = cc.color('#FFFFFF');

        this.player1Anim.play('player1');
        this.player2Anim.play('player2');
    },

    //撞死了
    endGame(){
        this.gameStartFlag = false;

        this.player1Anim.stop('player1');
        this.player2Anim.stop('player2');
    },

    reset(){
        this.curScore = 0 ;
        this.speed = this.initiateSpeed;

        this.node.removeAllChildren();
        this.activeBarries = [] ; //可能有内存泄露，管他娘的
    },

    //复活
    revival(){
        this.node.removeAllChildren();
        this.activeBarries = [] ;

        this.startGame();
    },

    loadBarriesBigImg(){
        for( let i=0; i<12 ; i++ ){
            util.loadRemoteImageArr('barriesBigImage',i,(spriteFrame)=>{
                this.barriesSpriteMap.set(i,spriteFrame);
            });
        }
    },

    getBarries(){
        let barriesArr = [];
        for(let i=0;i<2;i++){
            let barries = null ;
            if(this.barriesPool.size() > 0){
                barries = this.barriesPool.get();
            }else{
                barries = cc.instantiate(this.barriesPrefab);
            }
            barries.getComponent('barries').init();
            barries.parent = this.node;
            barriesArr.push(barries);
        }

        this.activeBarries.push(this.setBarriesInfo(barriesArr));
    },

    setBarriesInfo(barriesArr){
        //初始化后的一组障碍物，分配位置和图片资源
        if(barriesArr[0]){
            let spriteIndex = Math.floor(Math.random()*12);
            barriesArr[0].getComponent(cc.Sprite).spriteFrame = this.barriesSpriteMap.get(spriteIndex) || this.defaultSpirteFrame;
            barriesArr[0].x = Math.floor(Math.random()*2) ? -parseInt(this.ScreenWidth / 8 ) : -parseInt(this.ScreenWidth *3 / 8 );//随机0和1
        }

        if(barriesArr[1]){
            let spriteIndex = Math.floor(Math.random()*12);
            barriesArr[1].getComponent(cc.Sprite).spriteFrame = this.barriesSpriteMap.get(spriteIndex) || this.defaultSpirteFrame;
            barriesArr[1].x = Math.floor(Math.random()*2) ? parseInt(this.ScreenWidth / 8 ) : parseInt(this.ScreenWidth *3 / 8 );//随机0和1
        }

        return barriesArr;
    },

    start () {

    },

    update (dt) {
        if(this.gameStartFlag){
            //下移
            this.move();

            this.activeBarries.forEach((item,key)=>{
                //超过200M线检测
                this.generateCheck(item,key);

                //碰撞检测
                this.coliisionCheck(item,key);

                //超出屏幕检测
                this.overCheck(item,key);
            })
        }
    },

    move(){
        this.activeBarries.forEach((item,key)=>{
            if(item[0]){
                item[0].y -= this.speed ;
            }
            if(item[1]){
                item[1].y -= this.speed ;
            }
        });
    },

    generateCheck(item,key){
        let targetBarries = item[0] || item[1];
        let targetScript = targetBarries.getComponent('barries');

        //是否越过了生产线
        if( targetBarries.y < 385 ){
            //是否被检测过
            if( !targetScript.generateFlag ){
                targetScript.generateFlag = true ;
                this.getBarries();
            }
        }
    },

    coliisionCheck(barriesArr,key){
        barriesArr.forEach( (item,key) =>
        {
            if(item){
                if(item.x < 0){
                    //检测player1 碰撞
                    if(this.collisionJudge(this.player1,item)){
                        this.player1Anim.play('player1Over');
                        this.gameOver();
                        return;
                    }
                }
                if(item.x > 0){
                    //检测player2 碰撞
                    if(this.collisionJudge(this.player2,item)){
                        this.player2Anim.play('player2Over');
                        this.gameOver();
                        return;
                    }
                }
            }
        });
    },

    collisionJudge(item1,item2){
        //用小的东西去撞大的
        let result = !!(item1.y >= item2.y - barriesSize.height/2 && 
            item1.y <= item2.y + barriesSize.height/2  && 
                item1.x >= item2.x - barriesSize.width/2 && 
                    item1.x <= item2.x + barriesSize.width/2);

        return result;
    },

    overCheck(barriesArr,key){
        let targetBarries = barriesArr[0] || barriesArr[1];

        if( targetBarries.y < parseInt( -this.ScreenHeight/2 - barriesSize.height/2) )
        {   
            let tmpArr = this.activeBarries.shift();
            tmpArr.forEach((item,index)=>{
                if(item){
                    this.barriesPool.put(item);
                } 
            })

            this.curScore += 1 ; 
            this.scoreNode.getComponent('scoreControl').addScore(this.curScore);
        }   
    },
 
    gameOver(){
        let event = new cc.Event.EventCustom('game-over', true);
        event.detail = { score : this.curScore }

        this.node.dispatchEvent(event);
    }
});
