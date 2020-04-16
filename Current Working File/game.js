let game;
let cursors;
let spaceBar;
let jump = 0;
let gameOptions = {

    // player gravity
    playerGravity: 900,

    // player friction when on wall
    playerGrip: 100,

    // player horizontal speed
    playerSpeed: 200,

    // player jump force
    playerJump: 400,

    // player double jump force
    playerDoubleJump: 300,
    
    // player dash
    playerDash:3000,

    // trampoline tile impulse
    trampolineImpulse: 500
}

// constants to make some variable numbers more readable
const STOP_TILE = 2;
const TRAMPOLINE_TILE = 3;

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        width: 640,
        height: 480,
        backgroundColor: 0x444444,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
       scene: [preloadGame, playGame]
    }
    game = new Phaser.Game(gameConfig);
}
class preloadGame extends Phaser.Scene{
    constructor(){
        super("PreloadGame");
    }
    preload(){
        this.load.tilemapTiledJSON("level", "level.json");
        this.load.image("tile", "tile.png");
        this.load.image("hero", "hero.png");
    }
    create(){
        this.scene.start("PlayGame");
    }
}
class playGame extends Phaser.Scene{
    constructor(){
        super("PlayGame");
    }
    
    handleJump(){
        if(jump = 3 ){
                this.hero.body.velocity.y =-gameOptions.playerDoubleJump, this;
                // the hero can't double jump anymore
            jump = 4;

            }
        else if(jump = 1){

            // applying jump force
            this.hero.body.velocity.y = -gameOptions.playerJump, this;
            jump = 2;
        
            
        }
        
    }
  
    
    handleLDash(){
        
//         if(this.canDoubleJump){
//            this.hero.body.velocity.x =-gameOptions.playerDash, this;
//         }
         
    }

    handleRDash(){
        
//        if(this.canDoubleJump){
//            // applying double jump force
//            this.hero.body.velocity.x =+gameOptions.playerJump, this;
//            
//        }
    }
    
    
    
    
    create(){
         cursors = this.input.keyboard.createCursorKeys();
        // creation of "level" tilemap
        this.map = this.make.tilemap({
            key: "level"
        });
        // adding tiles to tilemap
        let tile = this.map.addTilesetImage("tileset01", "tile");

        // which layers should we render? That's right, "layer01"
        this.layer = this.map.createStaticLayer("layer01", tile);

        // which tiles will collide? Tiles from 1 to 3
        this.layer.setCollisionBetween(1, 3);

        // adding the hero sprite and enabling ARCADE physics for the hero
        this.hero = this.physics.add.sprite(260, 376, "hero");

        // setting hero horizontal speed
        //this.hero.body.velocity.x = gameOptions.playerSpeed;

        // the hero is not on the wall 
        this.onWall = false;

        // waiting for player input
        //this.input.keyboard.on("keydown-S", this.handleJump, this);

        // set workd bounds to allow camera to follow the player
        this.cameras.main.setBounds(0, 0, 1920, 1440);

        // making the camera follow the player
        this.cameras.main.startFollow(this.hero);
    }

        
    

    update(){
        
        console.log(jump + " "+ this.canDoubleJump);
        this.setDefaultValues();

        // handling collision between the hero and the tiles
        this.physics.world.collide(this.hero, this.layer, function(hero, layer){

            // should the player stop?
            let shouldStop = false;

            // some temporary variables to determine if the player is blocked only once
            let blockedDown = hero.body.blocked.down;
            let blockedLeft = hero.body.blocked.left;
            let blockedRight = hero.body.blocked.right;


            // hero on the ground
            if(blockedDown){

                // hero can jump
                this.canJump = true;
                jump = 0;

                // if we are on tile 2 (stop tile)...
                if(layer.index == STOP_TILE){

                    // player should stop
                    shouldStop = true;
                    this.canJump = false;
                }

                // if we are on a trampoline and previous player velocity was greater than zero
                if(layer.index == TRAMPOLINE_TILE && this.previousYVelocity > 0){

                    // trampoline jump!
                    hero.body.velocity.y = -gameOptions.trampolineImpulse;

                }

            }

        

            // hero NOT on the ground and touching a wall
            if((blockedRight || blockedLeft) && !blockedDown){

                // hero on a wall
                hero.scene.onWall = true;

                // remove gravity
                hero.body.gravity.y = 600;

                // setting new y velocity
                hero.body.velocity.y = gameOptions.playerGrip;
            }

        }, null, this);

        // saving current vertical velocity
        this.previousYVelocity = this.hero.body.velocity.y;
        
        
     //----------------------walking   
        
             
            if (cursors.up.justDown){ 
//                Phaser.Input.Keyboard.JustDown 
//                cursors = this.input.keyboard.createCursorKeys();
                if(jump = 2){
                jump = 3;
                this.handleJump();
                 }
                 else if (jump = 0){   
                jump = 1;
                this.handleJump();
                 } 
            }
        
            if (cursors.left.isDown){
                this.hero.flipX = true;
                this.hero.body.setVelocityX(-200);
                this.handleLDash();
                }
        
            if (cursors.right.isDown){
                this.hero.flipX = false;
                this.hero.body.setVelocityX(200);
                this.handleRDash();
                }
            
        
            if ( cursors.up.isUp && cursors.right.isUp && cursors.left.isUp ){
                this.hero.body.setVelocityX(0);
            }

        }
    

    // default values to be set at the beginning of each update cycle,
    // which may be changed according to what happens into "collide" callback function
    // (if called)
    setDefaultValues(){
        this.hero.body.gravity.y = gameOptions.playerGravity;
        this.onWall = false;
    }

   
}
