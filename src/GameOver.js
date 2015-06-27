/**
 * @author purelite.zhu <purelite.zhu@gmail.com>
 * @createTime 2014年12月4日上午9:25:58
 * @filename GameOver.js
 */
var shareScore = 0;
var zygoUrl;

var GameOver = cc.Layer.extend
(
	{
		ctor: function()
		{
			this._super();
			
			var size = cc.director.getWinSize();

			var layer = new cc.LayerColor(cc.color(125, 125, 125, 125));
			layer.ignoreAnchor = false;
			layer.anchorX = 0.5;
			layer.anchorY = 0.5;
			layer.setContentSize(size.width, size.height);
			layer.x = size.width/2;
			layer.y = size.height/2;
			this.addChild(layer);
/////////////////////////////////微信分享箭头 微信中显示掌阅logo/////////////////////
			var wxShareBtn= new cc.MenuItemSprite(
					new cc.Sprite(res.ShareBtn), // normal state image
					new cc.Sprite(res.ShareBtn), //select state image
					this.wxShare, this);
			var wxfxBtn = new cc.Menu(wxShareBtn);  //7. create the menu
			wxfxBtn.setPosition(size.width/2, size.height/2-250);
			this.addChild(wxfxBtn);

			var RestartBtn= new cc.MenuItemSprite(
					new cc.Sprite(res.Restart_png), // normal state image
					new cc.Sprite(res.Restart_png), //select state image
					this.onRestart, this);
			var HomeBtn= new cc.MenuItemSprite(
					new cc.Sprite(res.Home_png), // normal state image
					new cc.Sprite(res.Home_png), //select state image
					this.onHome, this);
					
			var ResBtn = new cc.Menu(RestartBtn);  //7. create the menu
			ResBtn.setPosition(size.width/2-100, size.height/2-100);
			this.addChild(ResBtn);

			var HomBtn = new cc.Menu(HomeBtn);  //7. create the menu
			HomBtn.setPosition(size.width/2+100, size.height/2-100);
			this.addChild(HomBtn);					
			return true;
		},
		onRestart:function(){
			this.removeFromParent(true);
			var scene = new cc.Scene();
			var gameViewBackground = new GameViewBackground();
			scene.addChild(gameViewBackground, -1, 0);
			var gameView = new GameView();
			scene.addChild(gameView, -1, 0);
			
			cc.director.runScene(scene);
			gameViewBackground.scoreBg();
			gameView.startGame();
		},
		zyUrl:function(){
			goUrl(zygoUrl);
		},
		
		
		onHome:function(){
			this.removeFromParent(true);
			cc.director.runScene(new MenuViewScene());
		},
		
		
		onShare:function(){
			zyShare(shareScore);
		},
		
		wxShare:function (){
			//var  size = cc.director.getWinSize();
			//var arrow = new cc.Sprite(res.arrow_png);
			//arrow.setPosition(size.width/2,size.height/2+460);
			//this.addChild(arrow,2);
		},
		showScore:function(currScore){
			shareScore = currScore;
			cc.sys.localStorage.setItem("curScore",currScore);
			var size = cc.director.getWinSize();
			var scoreBg = new cc.Sprite(res.overScoreBg);
			var sbgSize = scoreBg.getContentSize();
			scoreBg.x = size.width/2;
			scoreBg.y = size.height/2+220;
			this.addChild(scoreBg, 1);

			var currText = new cc.LabelTTF("","Arial", 24);
			currText.setPosition(cc.p(sbgSize.width/2,sbgSize.height-50));
			currText.setColor(cc.color(0,0,0));
			scoreBg.addChild(currText,2);
			currText.setString("分数");
			//
			var bestText = new cc.LabelTTF("","Arial",24);
			bestText.setPosition(cc.p(sbgSize.width/2,sbgSize.height-160));
			bestText.setColor(cc.color(0,0,0));
			scoreBg.addChild(bestText,2);
			bestText.setString("最佳");
			//
			var currScoreText = new cc.LabelTTF("","Arial", 50);
			currScoreText.setPosition(cc.p(sbgSize.width/2,sbgSize.height-100));
			currScoreText.setColor(cc.color(0,0,0));
			scoreBg.addChild(currScoreText,2);
			currScoreText.setString(currScore);
			//
			var bestScore=0;
			var score = cc.sys.localStorage.getItem("best_score");  
			if (score) {
				bestScore = score;
			} else {
				bestScore = 0;
			}
			var bestScoreText = new cc.LabelTTF("","Arial",50);
			bestScoreText.setPosition(cc.p(sbgSize.width/2,sbgSize.height-210));
			bestScoreText.setColor(cc.color(0,0,0));
			scoreBg.addChild(bestScoreText,2);
			bestScoreText.setString(bestScore);
		},
	}
);