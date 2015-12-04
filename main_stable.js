(function(){	
	document.addEventListener('DOMContentLoaded', function(event){
		//screen.lockOrientation('portrait');			

		function createGame () {
			enchant();
			
			var w = 320, h = 540;
			var speed = 300;
			var go = false;
			var shoot = false;
			var shootChance = 5;
			var needleChance = 66.6;
			var blockChance = 33.6;
			var re, exit;
			re = setImg("restart");
			exit = setImg("exit");

			var game = new Core(w, h);
		    game.fps = 60;
		    game.score = 0;
		    game.preload('restart.png', 'exit.png', 'chara1.png', 'icon.png', 
		    			'block.png', 'needle2.png', 'needle1.png', '01.png', 
		    			'player.png', 'shoot.png');

		    var loading = function(){
		    	var mouseX, mouseY;
				/****************************************************
				**		     Creat Needle on the Top Class	        **
				 ****************************************************/
		        var Top = enchant.Class.create(enchant.Sprite, {
		        	initialize: function(x){
				        enchant.Sprite.call(this, 16, 16);
				        this.image = game.assets['icon.png']; // set image
				        this.moveTo(x, 20); // set position
				        this.addEventListener('enterframe', function(){
				        	if(this.intersect(player)){
				        		if(this.y+14>=player.y){
				        			game.end(game.score, game.score);
				        			//show restart, exit
					        		re.style.visibility = 'visible';
					        		exit.style.visibility = 'visible';
								}
				        	}
				        });
		        	}
		        });
		        //generate on the screen
		        for(var i=16; i<=320; i+=16){
		        	var top = new Top(i-16);
		        	game.rootScene.addChild(top);
		        }

				/****************************************************
				**		         Creat Missile Class	     		**
				 ****************************************************/
		        var Missile = enchant.Class.create(enchant.Sprite, {
		        	initialize: function(x){
				        enchant.Sprite.call(this, 8, 32);
				        this.image = game.assets['shoot.png']; // set image
				        this.moveTo(x, h); // set position
				        this.tl.moveBy(0, -h-30, Math.random()*80+60);
				        this.addEventListener('enterframe', function(){
				        	if(this.intersect(player)){
				        	    game.end(game.score, game.score);
				        	    //show restart, exit
				        		re.style.visibility = 'visible';
				        		exit.style.visibility = 'visible';
				        	}
				        	if(this.y<=34){
				        		this.remove();
				        	}
				        });
				        game.rootScene.addChild(this);
		        	},
		        	remove: function(){
		        		game.rootScene.removeChild(this);
		        	}
		        });

		        /****************************************************
				**		          Creat Player Class	     	   	**
				 ****************************************************/
				var Player = enchant.Class.create(enchant.Sprite, {
				    initialize: function(game){
				        enchant.Sprite.call(this, 20, 20);
				        this.image = game.assets['player.png'];
				        this.x = 150;
				        this.y = 40;
				        this.frame = 5;
				        this.offsetX = 0;
				        this.offsetY = 0;
				        this.tempX = 0;
				        this.tempY = 0; 
				        this.blockX1 = 0;
				        this.blockX2 = 0;
				        this.blockY1 = 0;
				        this.blockY2 = 0;
				    	this.X_blockTouched = false;
				        this.Y_blockTouched = false;
				        this.Xtouch = 0;
				        this.Ytouch = 0;      
				        game.rootScene.addChild(this);     // add to canvas
				    },

					X_touched: function(x, y, curLocalX){
						player.X_blockTouched = true;
						player.X_boundaryCheck(x, curLocalX);
						if(player.X_blockTouched){
							(player.y>y+12||player.y<y-20)?player.X_blockTouched=false:"";
						}
					},

					Y_touched: function(x, y, curLocalY){
						player.Y_blockTouched = true;
						player.Y_boundaryCheck(y, curLocalY);
						if(player.Y_blockTouched&&player.Ytouch===1){
							(player.x>x+32||player.x<x-20)?player.Y_blockTouched=false:"";
						}else if(player.Y_blockTouched&&player.Ytouch===2){
							(player.x>x+32||player.x<x-20)?player.Y_blockTouched=false:"";
						}
					},

					X_boundaryCheck: function(x, curLocalX){
						this.x = x;
						this.tempX = x;
						this.offsetX = curLocalX+10;
					},

					Y_boundaryCheck: function(y, curLocalY){
						player.y = y;
						player.tempY = y;
						player.offsetY = curLocalY+10;
					}
				});

		        /****************************************************
				**		        Creat Normal Block Class	        **
				 ****************************************************/	        
		        var Block = enchant.Class.create(enchant.Sprite, {
				    initialize: function(x){
				        enchant.Sprite.call(this, 32, 12);
				        this.image = game.assets['block.png']; // set image
				        this.moveTo(x, h); // set position
				        this.scaleY = -1;
				        this.tl.moveBy(0, -h-30, speed);      // set movement
				        /*this.addEventListener('touchmove', function(e){console.log(" detecting~~~ ");
				        	if(this.intersect(player)){
				        		player.blockX1 = this.x;
				        		player.blockX2 = this.x+32;
				        		player.blockY1 = this.y;
				        		player.blockY2 = this.y+12;
				        		if(player.y<=this.y&&player.x<this.x+32&&player.x+20>this.x){
				        			player.Y_touched(this.x, this.y, mouseY);
				        		}
				        		else if(player.x>=this.x+30){
				        			player.X_touched(this.x+32, this.y, 1);
				        		}
				        		else if(player.x+18<=this.x){
				        			player.X_touched(this.x-20, this.y, 2);
				        		}
				        	}
				        });*/
				        this.addEventListener('enterframe', function(){//console.log(" "+player.X_blockTouched+" "+player.Y_blockTouched+" ");
				        	if(this.intersect(player)){
				        		player.blockX1 = this.x;
				        		player.blockX2 = this.x+32;
				        		player.blockY1 = this.y;
				        		player.blockY2 = this.y+12;
				        		//top side
				        		if(player.y<=this.y+6&&player.x<this.x+30&&player.x+18>this.x){
				        			player.Y_touched(this.x, this.y-20, mouseY);
				        			player.Ytouch = 1;
				        		}//bottom side
				        		else if(player.y>=this.y+6&&player.x<this.x+30&&player.x+18>this.x){
				        			player.Y_touched(this.x, this.y+12, mouseY);
				        			player.Ytouch = 2;
				        		}//right side
				        		else if(player.x>=this.x+16&&player.y>=this.y+2&&player.y<=this.y+10){
				        			player.X_touched(this.x+32, this.y, mouseX);
				        			player.Xtouch = 1;
				        		}//left side
				        		else if(player.x<=this.x+16&&player.y>=this.y+2&&player.y<=this.y+10){
				        			player.X_touched(this.x-20, this.y, mouseX);
				        			player.Xtouch = 2;
				        		}else{}
				        	}
				        	if(this.y<=34){
				        		this.remove();
				        	}
				        });
				        game.rootScene.addChild(this);     // canvas
				    },
				    remove: function(){
				    	game.rootScene.removeChild(this);
				    }
				});

		        /****************************************************
				**		        Creat Needle Block Class	     	**
				 ****************************************************/
		        var Needle = enchant.Class.create(enchant.Sprite, {
				    initialize: function(x){
				        enchant.Sprite.call(this, 32, 16);
				        this.image = game.assets['needle2.png']; // set image
				        this.moveTo(x, h); // set position
				        this.scaleY = -1;
				        this.tl.moveBy(0, -h-30, speed);      // set movement
				        this.addEventListener('enterframe', function(){
				        	if(this.intersect(player)){
		        				game.end(game.score, game.score);
		        				//show restart, exit
				        		re.style.visibility = 'visible';
				        		exit.style.visibility = 'visible';
				        	}
				        	if(this.y<=34){
				        		this.remove();
				        	}
				        });
				        game.rootScene.addChild(this);     // canvas
				    },
				    remove: function(){
				    	game.rootScene.removeChild(this);
				    }
				});

		        //generate main player!!
				player = new Player(game);

				// add event listener (called when click/touch started)
		        game.rootScene.on('touchstart', function(e){// console.log("touchstart\n");
		        	mouseX = e.localX; mouseY = e.localY;
		        	player.offsetX = e.localX+10;	// set position to touch-x position
		            player.offsetY = e.localY+10;  // set position to touch-y position
		            player.tempX = player.x;
		            player.tempY = player.y;
		        });

		        // add event listener (called when click/touch moved)
		        game.rootScene.on('touchmove', function(e){//console.log((e.localY+10-player.offsetY)+" == "+player.Y_blockTouched+"\n");
		        	mouseX = e.localX; mouseY = e.localY;
		        	var tX = e.localX + 10 - player.offsetX;
		        	var tY = e.localY + 10 - player.offsetY;
		        	//right boundary check
		        	if(tX+player.tempX+22>=w && tX>0){
		        		player.X_boundaryCheck(w-22, e.localX);
		        	}//left boundary check
		        	else if(tX+player.tempX<=0 && tX<0){
		    			player.X_boundaryCheck(0, e.localX);      		
		        	}//touch-x position
		        	else{
		        		if(!player.X_blockTouched){
		        			player.x = player.tempX + e.localX + 10 - player.offsetX;
		        		}
						else{
		        			//touch the right side of the block
				        	if(player.Xtouch===1){
				        		if(tX<0){
		        					player.X_boundaryCheck(player.blockX2, e.localX);
				        		}
		        				else{ 
		        					player.X_blockTouched = false;
		        					player.Xtouch = 0;
		        				}
		        			}
		        			//touch the left side of the block
		        			if(player.Xtouch===2){
				        		if(tX>0){
		        					player.X_boundaryCheck(player.blockX1-20, e.localX);
				        		}
		        				else{ 
		        					player.X_blockTouched = false;
		        					player.Xtouch = 0;
		        				}
		        			}
		        		}
		        	}
		        	//bottom boundary check
		        	if(player.tempY+tY+20>=h && tY>0){
		        		player.Y_boundaryCheck(h-20, e.localY);
		        	}//up boundary check
		        	else if(player.tempY+tY<=12 && tY<0){
		        		player.y = 12;
		        	}//touch-y position
		        	else{
		        		if(!player.Y_blockTouched){
		        			player.y = player.tempY+tY;
		        		}else{
		        			//touch the top side of the block
				        	if(player.Ytouch===1){
				        		if(tY>0){
		        					player.Y_boundaryCheck(player.blockY1-20, e.localY);
				        		}
		        				else{ 
		        					player.Y_blockTouched = false;
		        					player.Ytouch = 0;
		        				}
		        			}
		        			//touch the bottom side of the block
		    				if(player.Ytouch===2){
				        		if(tY<0){
		        					player.Y_boundaryCheck(player.blockY2-6, e.localY);
				        		}
		        				else{ 
		        					player.Y_blockTouched = false;
		        					player.Ytouch = 0;
		        				}       				
		        			}
		        		}
		        	}
		        });

				/****************************************************
				**					Generate Blocks					**
				 ****************************************************/
		        game.rootScene.tl.then(function() {
		        	var space = 2, nd = 3;
		            for(var i=32; i<=320; i+=32){
		            	var r = Math.random()*100;

		            	if(i===320&&space===1){
		            		continue;
		            	}
		            	if(!go){
		            		if(i===320&&space===2){continue;}
			            	if(r<66.6||space===0){ var block = new Block(i-32);}
			            	else{space--;}
			            }else{
			            	if(i===320&&space===2){continue;}
			            	if(r>=needleChance&&nd!=0){ var needle = new Needle(i-32); nd--;}
			            	else if(r<=blockChance||space===0){ var block = new Block(i-32);}
			            	else{space--;}
			            }
		            }
		        }).delay(100).loop();

				/****************************************************
				**					Generate Missile				**
				 ****************************************************/
		        game.rootScene.addEventListener('enterframe', function () {
		        	if(shoot&&Math.random()*100<shootChance){
		            	var missile = new Missile(Math.random()*312);
		            }
		        });

				/****************************************************
				**					Level and Score 			    **
				 ****************************************************/        
		        game.rootScene.addEventListener('enterframe', function () {
		        	if(game.score-3000>0){
		        		shootChance = 30;
		        	}
		        	if(game.score-1000>0){
		        		shootChance = 10;
		        	}
		        	if(game.score-100>0){
		        		shoot = true;
		        	}
		        	if(game.score-1500>0){
		        		needleChance = 50;
		        		blockChance = 10;
		        	}
		        	if(game.score-500>0){
		        		go = true;
		        	}
		        	if(speed>20){
		        		speed-=0.05;
		        	}
		        	game.score += 1;
			        scoreLabel.score = game.score;
			    });
			    //set the scoreLabel location on (8, 4)
		        scoreLabel = new ScoreLabel(8, 4);
		        //add object
		        game.rootScene.addChild(scoreLabel);
		    };
		    game.onload = loading;
		    //start the game!
		    game.start();
		};

		createGame();

		function setImg (id) {
			var img = document.getElementById(id);
			img.addEventListener('click', function(){
				id==="restart"?window.location.reload():window.close();
			});
			var proportion = document.documentElement.clientHeight/540;
			img.setAttribute("style","width:"+proportion*64+"px;"+"height:"+proportion*64+"px;");
			if(id==="restart"){
				img.style.left = proportion*85+"px";
				img.style.top = proportion*260+"px";
			}else if(id==="exit"){
				img.style.left = proportion*171+"px";
				img.style.top = proportion*260+"px";
			}
			return img;
		};
	});
})();
