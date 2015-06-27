/**
 * @author purelite.zhu <purelite.zhu@gmail.com>
 * @createTime 2014年12月4日上午9:25:46
 * @filename GameView.js
 * modified by shuyi
 */
var bgSize;
var sbSize;
var npcNormal=null;
var gameViewXOffset = 0;
var preBlackXOffset = 0;
var currBlackXOffset = 0;
var betweenXOffset = 0;

var guideTextPic = null;

var upBlackObject;
var pressTime;
var Score  = 0;
var ScoreText;
var currBlock;
var mainBody, leftFootBody, rightFootBody, leftArmBody, rightArmBody, headBody;
var leftPivotJoint, rightPivotJoint, leftRotaryLimitJoint, rightRotaryLimitJoint;
var leftArmPivotJoint, rightArmPivotJoint, leftArmJoint, rightArmJoint;
var leftArmMotor, rightArmMotor;
var headPivotJoint, headRotaryLimitJoint;
var leftLeg, rightLeg, leftArm, rightArm, head;
var isFail;
var state = 0; //0：准备 1：空中 2：着陆
var isGaveOverShown;
var isDoforce;

var npcController = 
{
	initNPC:function(layer,space)
	{

        var boxOffset = cp.v(320, 240);

        leftFootBody  = addLeftLeg(cp.v(-20, 60), space, boxOffset);
        rightFootBody = addRightLeg(cp.v(20, 60), space, boxOffset);
        mainBody = addMainBody(cp.v(0, 90), space, boxOffset);

        leftPivotJoint = new cp.PivotJoint(mainBody, leftFootBody, cp.v( -10, -20), cp.v(0,15));
        rightPivotJoint = new cp.PivotJoint(mainBody, rightFootBody, cp.v( 10, -20), cp.v(0,15));

        space.addConstraint(leftPivotJoint);
        space.addConstraint(rightPivotJoint);

        leftRotaryLimitJoint = new cp.RotaryLimitJoint(mainBody, leftFootBody, -Math.PI/4, -Math.PI/8);
        rightRotaryLimitJoint = new cp.RotaryLimitJoint(mainBody, rightFootBody, Math.PI/8, Math.PI/4);

        space.addConstraint(leftRotaryLimitJoint);
        space.addConstraint(rightRotaryLimitJoint);

        //arms

        leftArmBody  = addLeftArm(cp.v(-20, 60), space, boxOffset);
        rightArmBody = addRightArm(cp.v(20, 60), space, boxOffset);

        leftArmPivotJoint = new cp.PivotJoint(mainBody, leftArmBody, cp.v( -18, 15), cp.v(0,-15));
        rightArmPivotJoint = new cp.PivotJoint(mainBody, rightArmBody, cp.v( 18, 15), cp.v(0,-15));

        space.addConstraint(leftArmPivotJoint);
        space.addConstraint(rightArmPivotJoint);

        leftArmJoint = new cp.RotaryLimitJoint(mainBody, leftArmBody, Math.PI/8, Math.PI);
        rightArmJoint = new cp.RotaryLimitJoint(mainBody, rightArmBody, -Math.PI, -Math.PI/8);

        space.addConstraint(leftArmJoint);
        space.addConstraint(rightArmJoint);

        //head

        headBody = addHead(cp.v(-20, 60), space, boxOffset);
        headPivotJoint = new cp.PivotJoint(mainBody, headBody, cp.v( 0, 20), cp.v(0,-12));
        headRotaryLimitJoint = new cp.RotaryLimitJoint(mainBody, headBody, 0, 0);

        space.addConstraint(headPivotJoint);
        space.addConstraint(headRotaryLimitJoint);


        npcNormal = cc.PhysicsSprite.create("res/body.png");
        npcNormal.setBody(mainBody);
        npcNormal.setScale(40/310, 40/263);
        npcNormal.setTag(101);

		var npcSize = npcNormal.getContentSize();
		//npcNormal.setScale(1, 1);
		npcNormal.x = bgSize.width/2 - 30;
		npcNormal.y = sbSize.height+npcSize.height/2 + 30;

		layer.addChild(npcNormal,1);

        leftLeg = cc.PhysicsSprite.create("res/foot.png");
        leftLeg.setScale(16/71, 32/215);
        leftLeg.setBody(leftFootBody);
        leftLeg.setPosition(cc.p( bgSize.width/2 - 30,sbSize.height+npcSize.height/2 + 30));

        rightLeg = cc.PhysicsSprite.create("res/foot.png");
        rightLeg.setScale(16/71, 32/215);
        rightLeg.setBody(rightFootBody);
        rightLeg.setPosition(cc.p( bgSize.width/2 - 30,sbSize.height+npcSize.height/2 + 30));

        leftArm = cc.PhysicsSprite.create("res/arm.png");
        leftArm.setScale(10/71, 25/215);
        leftArm.setBody(leftArmBody);
        //leftArm.setAnchorPoint(cc.p(0.5,-0.2));
        leftArm.setPosition(cc.p( bgSize.width/2 - 30,sbSize.height+npcSize.height/2 + 30));

        rightArm = cc.PhysicsSprite.create("res/arm.png");
        //rightArm.setAnchorPoint(cc.p(0,-15));
        rightArm.setScale(10/71, 25/215);
        rightArm.setBody(rightArmBody);
        rightArm.setPosition(cc.p( bgSize.width/2 - 30,sbSize.height+npcSize.height/2 + 30));

        head = cc.PhysicsSprite.create("res/head.png");
        head.setScale(1/7.75, 1/7.75);
        head.setBody(headBody);
        head.setPosition(cc.p( bgSize.width/2 - 30,sbSize.height+npcSize.height/2 + 30));

        layer.addChild(leftLeg,1);
        layer.addChild(rightLeg,1);
        layer.addChild(leftArm,1);
        layer.addChild(rightArm,1);
        layer.addChild(head,1);


    }
}

var GameViewBackground = cc.Layer.extend
(
	{
		ctor: function()
		{
			this._super();

			bgSize = cc.director.getWinSize();
			var flag = cc.random0To1() * 4;
			var flagInt = parseInt(flag);
            console.log("bg:" + flag);
            console.log("bg:" + flagInt);
            var backgroundIndex = null;
			switch (flagInt)
			{
			case 0:
			{
				backgroundIndex = res.StartBackground_png0;
			}
			break;
			case 1:
			{
				backgroundIndex = res.StartBackground_png1;
			}
			break;
                case 2:
                {
                    backgroundIndex = res.StartBackground_png2;
                }
                    break;

                case 3:
                {
                    backgroundIndex = res.StartBackground_png3;
                }
                    break;

                default:
			{
				backgroundIndex = res.StartBackground_png0;
			}
			break;
			}
			var background = new cc.Sprite(backgroundIndex);
			background.attr({
				x: bgSize.width / 2,
				y: bgSize.height / 2,
				scale: 1.0,
				rotation: 0
			});
			this.addChild(background);

			guideTextPic = null;
			
			ScoreText = new cc.LabelTTF("","宋体",46);
			ScoreText.setPosition(cc.p(bgSize.width/2,bgSize.height/2+300));
			ScoreText.setColor(cc.color(255,255,255));
			this.addChild(ScoreText,2);

            return true;
		},
		scoreBg:function(){
			var scoreBg = new cc.Sprite(res.ScoreBg);
			scoreBg.x = bgSize.width/2;
			scoreBg.y = bgSize.height/2+300;
			this.addChild(scoreBg,1);
		},
		drawGuidtext:function(){
				guideTextPic = new cc.Sprite(res.guideText);
				guideTextPic.setPosition(bgSize.width/2, bgSize.height/2+220);
				this.addChild(guideTextPic,2);
				guideTextPic.setVisible(false);
		}
	}
);

var GameView = cc.Layer.extend
(
	{
        _this:null,
        _start:false,
		ctor: function()
		{
			this._super();
            this.space = new cp.Space();

            this.space.gravity = cp.v(0, -490);      //重力
            this.space.sleepTimeThreshold = 0.5;     //休眠临界时间
            this.space.collisionSlop = 0.5;          //

            _this = this;
			var stickBlack = new cc.Sprite(res.StickBlack_png);
			sbSize = stickBlack.getContentSize();
			stickBlack.setScale(180/sbSize.width, 387/sbSize.height);
			stickBlack.x = bgSize.width/2 - 40;
			stickBlack.y = sbSize.height/2-50;
			this.addChild(stickBlack);

            var staticBody = new cp.Body(Infinity, Infinity);
            staticBody.setPos(stickBlack.getPosition());
            var shape = new cp.BoxShape(staticBody, stickBlack.getContentSize().width * stickBlack.getScaleX(), stickBlack.getContentSize().height * stickBlack.getScaleY());
            shape.setElasticity(0);
            shape.setFriction(1);
            shape.setCollisionType(3);
            this.space.addShape(shape);
			
			npcController.initNPC(this, this.space);
			//npcController.yao();

			cc.eventManager.addListener({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: true,
				onTouchBegan: this.onTouchBegan,
				onTouchEnded: this.onTouchEnded
			}, this);

            currBlock = staticBody;
            state = 0;

            //this.initDebugMode();

			return true;
		},
		startGame:function(){
			Score = 0;
			ScoreText.setString(Score);
            isFail = false;
            isGaveOverShown = false;
	
			var _width = 180;
			gameViewXOffset = -_width/2+bgSize.width/2;
			preBlackXOffset = _width;
			this.runAction(cc.sequence(cc.moveBy(0.2, cc.p(-gameViewXOffset, 100))));
			npcNormal.runAction
			(
				cc.sequence
				(
					cc.moveBy(0.2, cc.p(_width/2-28, 0)),
					cc.callFunc(this.addBlock, this)
				)
			);

			if (guideTextPic != null) {
				guideTextPic.setVisible(true);
			}

            this.scheduleUpdate();

            this.space.addCollisionHandler( 0, 3,
                this.collisionBegin.bind(this),
                this.collisionPre.bind(this),
                this.collisionPost.bind(this),
                this.collisionSeparate.bind(this)
            );

            this.space.addCollisionHandler( 1, 3,
                this.collisionBegin.bind(this),
                this.collisionPre.bind(this),
                this.collisionPost.bind(this),
                this.collisionSeparate.bind(this)
            );

            this.space.addCollisionHandler( 0, 2,
                this.collisionBegin.bind(this),
                this.collisionPre.bind(this),
                this.collisionPost.bind(this),
                this.collisionSeparate.bind(this)
            );

            this.space.addCollisionHandler( 1, 2,
                this.collisionBegin.bind(this),
                this.collisionPre.bind(this),
                this.collisionPost.bind(this),
                this.collisionSeparate.bind(this)
            );

        },
		addBlock:function(){

            _this._start = true;
			upBlackObject =  new cc.Sprite(res.StickBlack_png);
			//upBlackObject.setAnchorPoint(cc.p(0.5, 0));
			var upSize = upBlackObject.getContentSize();
			upBlackObject.x = gameViewXOffset+preBlackXOffset-2.5;
			upBlackObject.y = sbSize.height;
			upBlackObject.setScaleY(0);
			this.addChild(upBlackObject);
			//增加黑条方法
			//生成随机的宽度10～50
			//位置，屏幕右侧
			//动作结束可以可以触发手指按下动作
			//var flag = (cc.random0To1()*2.5+0.4)*20;
			var heightScale = cc.random0To1()*180-90;
            var flag = 200;
			var stickBlack = new cc.Sprite(res.StickBlack_png);
			var tSize = stickBlack.getContentSize();
			stickBlack.setScale(flag/sbSize.width, (387 + heightScale)/sbSize.height);
			stickBlack.x = gameViewXOffset + bgSize.width + flag/2;
			stickBlack.y = tSize.height/2-50;

            this.addChild(stickBlack);

			var _offset = bgSize.width - preBlackXOffset - 30;
            var flag1 = 0.95 - cc.random0To1() * 0.1;

            state = 0;

            currBlackXOffset = flag;
			betweenXOffset = flag1 * _offset;

            stickBlack.runAction
			(
				cc.sequence(
                    cc.moveBy(0.05, cc.p(-betweenXOffset, 0)),
                    cc.callFunc(this.addBlockBody, this, stickBlack)
                )
			);
		},
        addBlockBody:function(obj, stickBlack){

            console.log("added");

            var staticBody = new cp.Body(Infinity, Infinity);
            staticBody.setPos(stickBlack.getPosition());
            var shape = new cp.BoxShape(staticBody, stickBlack.getContentSize().width * stickBlack.getScaleX(), stickBlack.getContentSize().height * stickBlack.getScaleY());
            shape.setElasticity(0);
            shape.setFriction(1);
            shape.setCollisionType(3);
            this.space.addShape(shape);
            currBlock = staticBody;
        },
		onTouchBegan:function (touch, event) {
			//
			if (guideTextPic != null) {
				guideTextPic.setVisible(false);
			}
			if (_this._start) {
				_this.startSchedule();
				return true;
			}
			return false;
		},
	    onTouchEnded:function (touch, event) {
			//
			_this.stopSchedule();
	    },
	    startSchedule:function(){
            pressTime = 0;
            currBlock.shapeList[0].setSensor(true);
            isDoforce = true;
            leftArmMotor = new cp.SimpleMotor(mainBody, leftArmBody, 0.7);
            rightArmMotor = new cp.SimpleMotor(mainBody, rightArmBody, -0.7);
            this.space.addConstraint(leftArmMotor);
            this.space.addConstraint(rightArmMotor);
	    },
	    stopSchedule:function(){
            this.space.removeConstraint(leftArmMotor);
            this.space.removeConstraint(rightArmMotor);
            isDoforce = false;
            currBlock.shapeList[0].setSensor(false);
	    	_this._start = false;
            this.doForce(pressTime);
            console.log("schedule!!");
            state = 1;
            cc.audioEngine.playEffect(res.JumpSound);
	    },
	    next:function(offset){
            console.log("next");
	    	npcNormal.runAction
	    	(
    			cc.sequence
    			(
					cc.callFunc(this.nextBlack, this)
    			)
	    	);
	    	
	    },
	    gameOver:function(offset){
            npcNormal.runAction
	    	(
    			cc.sequence
    			(
					cc.callFunc(this.gameFaile, this)
    			)
	    	);
	    },
	    nextBlack:function(){
	    	Score++;
	    	ScoreText.setString(Score);
	    	
	    	if (Score>cc.sys.localStorage.getItem("best_score")) {
	    		cc.sys.localStorage.setItem("best_score", Score);  
			}

    		preBlackXOffset = currBlackXOffset+40;
	    	var result = bgSize.width - (betweenXOffset)-40;
	    	gameViewXOffset += result;
	    	this.runAction
	    	(
	    		cc.sequence
	    		(
	    			cc.moveBy(0.3, cc.p(-result, 0)),
					cc.callFunc(this.addBlock, this)
	    		)
	    	);
	    },
	    gameFaile:function(){
	    	//
            console.log("should add 1");
	    	npcNormal.runAction
	    	(
    			cc.sequence
    			(
					cc.callFunc(this.addGameFailView, this)
    			)
	    	);
	    	upBlackObject.runAction
	    	(
	    		cc.sequence(cc.rotateBy(0.1, 90))
	    	);
	    },
	    addGameFailView:function(){
	    	//添加重新开始界面
            console.log("should add 2");
	    	var gameOverLayer = new GameOver();
	    	gameOverLayer.x = gameViewXOffset;
	    	gameOverLayer.y = -100;
	    	gameOverLayer.showScore(Score);
	    	this.addChild(gameOverLayer);
	    },
        initDebugMode: function () {
            this._debugNode = cc.PhysicsDebugNode.create(this.space);
            this.addChild(this._debugNode);
        },
        update: function (dt) {

            this.space.step(1/60.0);

            if (isDoforce) {
                pressTime += 0.05;
            }

            if (state == 2) {
                if (Math.abs(npcNormal.getBody().getVel().x) <= 0.05 && Math.abs(npcNormal.getBody().getVel().y) <= 0.05) {
                    if (!isFail) {
                        this.next(500);
                        state = 0;
                    }
                }
            }

            if (npcNormal.getPositionY() <= -300){
                isFail = true;
            }

            if (isFail){
                if (isGaveOverShown) return;
                isGaveOverShown = true;
                this.gameOver(currBlackXOffset+300);
                leftArmBody.shapeList[0].setSensor(false);
                rightArmBody.shapeList[0].setSensor(false);
                headBody.shapeList[0].setSensor(false);
                this.space.removeConstraint(leftPivotJoint);
                this.space.removeConstraint(rightPivotJoint);
                this.space.removeConstraint(leftRotaryLimitJoint);
                this.space.removeConstraint(rightRotaryLimitJoint);
                this.space.removeConstraint(leftArmPivotJoint);
                this.space.removeConstraint(rightArmPivotJoint);
                this.space.removeConstraint(leftArmJoint);
                this.space.removeConstraint(rightArmJoint);
                this.space.removeConstraint(headPivotJoint);
                this.space.removeConstraint(headRotaryLimitJoint);
                cc.audioEngine.playEffect(res.BreakSound);
            }
        },
        doForce: function (interval) {

            var x = 350;
            var y = 900 * interval * Math.sin(60*Math.PI/180);
            npcNormal.getBody().setVel(cp.v(0,0));
            npcNormal.getBody().applyImpulse(cp.v(x,y), cp.v(-20, 0));

        },

        collisionBegin : function ( arbiter, space ) {

            if (isFail) return true;
            if (state == 0) return true;
            state = 2;

            var shapes = arbiter.getShapes();

            var shapeA = shapes[0];
            var shapeB = shapes[1];

            var collTypeA = shapeA.collision_type;
            var collTypeB = shapeB.collision_type;

            if (collTypeB == 3 && collTypeA == 1){
                leftFootBody.setVel(cp.v(0,0));
                rightFootBody.setVel(cp.v(0,0));
                mainBody.setVel(cp.v(0,0));
                rightArmBody.setVel(cp.v(0,0));
                leftArmBody.setVel(cp.v(0,0));
                headBody.setVel(cp.v(0,0));
            }else if (collTypeB == 3 && collTypeA == 0){
                //state = 2
                console.log("fail!!");
                //失败
                isFail = true;
            }

            return true;
        },

        collisionPre : function ( arbiter, space ) {
            //console.log('collision pre');
            return true;
        },

        collisionPost : function ( arbiter, space ) {
            //console.log('collision post');
        },

        collisionSeparate : function ( arbiter, space ) {
            //console.log('collision separate');
        }
	}
);

var addHead = function(pos,space,boxOffset)
{
    var radius = 20;
    var mass = 0.1;
    var body = space.addBody(new cp.Body(mass, cp.momentForCircle(mass, 0, radius, cp.v(0,0))));
    body.setPos(cp.v.add(pos, boxOffset));

    var verts = [
        310.00000 - 310/2,0.00000 - 177/2,
        0.00000 - 310/2,0.00000 - 177/2,
        20.00000 - 310/2,80.00000 - 177/2,
        96.00000 - 310/2,133.00000 - 177/2,
        204.00000 - 310/2,134.00000 - 177/2,
        290.00000 - 310/2,80.00000 - 177/2,
    ];

    for (var i = 0; i < verts.length; i++){
        verts[i] /= 7.75;
    }

    var shape = space.addShape(new cp.PolyShape(body, verts, cp.vzero));

    shape.setElasticity(0);
    shape.setFriction(2);
    shape.group = 1; // use a group to keep the car parts from colliding

    shape.setSensor(true);

    shape.setCollisionType(4);

    return body;
};

var addLeftArm = function(pos,space,boxOffset)
{
    var radius = 20;
    var mass = 0.1;
    var body = space.addBody(new cp.Body(mass, cp.momentForCircle(mass, 0, radius, cp.v(0,0))));
    body.setPos(cp.v.add(pos, boxOffset));

    //var shape = space.addShape(new cp.CircleShape(body, radius, cp.v(0,0)));
    var shape = space.addShape(new cp.BoxShape(body, 10, 25));
    //var verts = [
    //    -8, -16,
    //    -8, 16,
    //    8, 16,
    //    8, -16
    //];
    //var shape = space.addShape(new cp.PolyShape(body, verts, cp.vzero));

    shape.setElasticity(0);
    shape.setFriction(2);
    shape.group = 1; // use a group to keep the car parts from colliding

    shape.setSensor(true);

    shape.setCollisionType(4);

    return body;
};

var addRightArm = function(pos,space,boxOffset)
{
    var radius = 20;
    var mass = 0.1;
    var body = space.addBody(new cp.Body(mass, cp.momentForCircle(mass, 0, radius, cp.v(0,0))));
    body.setPos(cp.v.add(pos, boxOffset));

    //var shape = space.addShape(new cp.CircleShape(body, radius, cp.v(0,0)));
    var shape = space.addShape(new cp.BoxShape(body, 10, 25));
    //var verts = [
    //    -8, -16,
    //    -8, 16,
    //    8, 16,
    //    8, -16
    //];
    //var shape = space.addShape(new cp.PolyShape(body, verts, cp.vzero));
    shape.setSensor(true);

    shape.setElasticity(0);
    shape.setFriction(2);
    shape.group = 1; // use a group to keep the car parts from colliding

    shape.setCollisionType(4);

    return body;
};

var addLeftLeg = function(pos,space,boxOffset)
{
    var radius = 20;
    var mass = 1;
    var body = space.addBody(new cp.Body(mass, cp.momentForCircle(mass, 0, radius, cp.v(0,0))));
    body.setPos(cp.v.add(pos, boxOffset));

    //var shape = space.addShape(new cp.CircleShape(body, radius, cp.v(0,0)));
    //var shape = space.addShape(new cp.BoxShape(body, 15, 30));
    var verts = [
        -8, -18,
        -8, 16,
        8, 16,
        8, -12
    ];
    var shape = space.addShape(new cp.PolyShape(body, verts, cp.vzero));

    shape.setElasticity(0);
    shape.setFriction(0.5);
    shape.group = 1; // use a group to keep the car parts from colliding

    shape.setCollisionType(1);

    return body;
};

var addRightLeg = function(pos,space,boxOffset)
{
    var radius = 20;
    var mass = 1;
    var body = space.addBody(new cp.Body(mass, cp.momentForCircle(mass, 0, radius, cp.v(0,0))));
    body.setPos(cp.v.add(pos, boxOffset));

    var verts = [
        -8, -12,
        -8, 16,
        8, 16,
        8, -18
    ];
    var shape = space.addShape(new cp.PolyShape(body, verts, cp.vzero));

    shape.setElasticity(0);
    shape.setFriction(0.5);
    shape.group = 1; // use a group to keep the car parts from colliding

    shape.setCollisionType(1);

    return body;
};

var addMainBody = function(pos,space,boxOffset)
{
    var mass = 1;
    var width = 40;
    var height = 40;

    var body = space.addBody(new cp.Body(mass, cp.momentForBox(mass, width, height)));
    body.setPos(cp.v.add(pos, boxOffset));

    var shape = space.addShape(new cp.BoxShape(body, width, height));
    shape.setElasticity(0);
    shape.setFriction(2);
    shape.group = 1; // use a group to keep the car parts from colliding

    shape.setCollisionType(0);

    return body;
};