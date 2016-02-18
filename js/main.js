window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'bambooscreen', 'assets/bamboo1.jpg' ); //load background 
        game.load.spritesheet('panda', 'assets/pandasprites11test.png', 120, 122); //load panda sprite
        game.load.image('coin', 'assets/pandacoin.png'); //load coin 
        game.load.image('ground','assets/grassplatform2.png');
    }
    
    //var bouncy;
    var bkgr; //use this var for the background "bkgr"  
    var sprite;
    var player;
    var facing = 'left';
    var jumpTimer = 0;
    var cursors;
    var jumpButton;
    var yAxis = p2.vec2.fromValues(0, 1);
    var coins;
    var platforms;

    
    function create() {
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        
        
        
        // Create a sprite at the center of the screen using the 'logo' image.
        /////bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
        bkgr = game.add.tileSprite(0, 0, 2000, 2000, 'bambooscreen'); 
        //game.add.sprite(0,0,'bambooscreen');
        //game.add.sprite(0,0,'coin');
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        ////bouncy.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        ////////game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        ////////////bouncy.body.collideWorldBounds = true;
        
        
        
        //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 20, 'ground');  //70

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    //var ledge = platforms.create(500, 400, 'ground');
    var ledge = platforms.create(500, 400, 'ground');

    ledge.body.immovable = true;

    //ledge = platforms.create(-150, 250, 'ground');
    ledge = platforms.create(-150, 250, 'ground');

    ledge.body.immovable = true;
  
    ledge = platforms.create(550, 150, 'ground');

    ledge.body.immovable = true;
        
        
        
        //game.physics.startSystem(Phaser.Physics.P2JS);
        //game.physics.startSystem(Phaser.Physics.ARCADE);

        //game.physics.p2.gravity.y = 350;
        //game.physics.p2.world.defaultContactMaterial.friction = 0.3;
        //game.physics.p2.world.setGlobalStiffness(1e5);
        
        
        //Add a sprite
        //player = game.add.sprite(50, game.world.height - 300, 'panda');
        player = game.add.sprite(200,200,'panda');
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true; 
        player.animations.add('left', [2], 10, true);
        player.animations.add('turn', [1], 20, true);
        player.animations.add('right', [1], 10, true);
        
        
        //  Enable if for physics. This creates a default rectangular body.
        //game.physics.p2.enable(player);
    //
        //player.body.fixedRotation = true;
        //player.body.damping = 0.5;
        //player.body.collideWorldBounds = true;
        //var spriteMaterial = game.physics.p2.createMaterial('spriteMaterial', player.body);
        //var worldMaterial = game.physics.p2.createMaterial('worldMaterial');
        //var boxMaterial = game.physics.p2.createMaterial('worldMaterial');
        
        //game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        
        //text = game.add.text(200, 100, 'move panda with arrow', { fill: '#190718' });

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "60px Broadway", fill: "#190718", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "PANDAVILLE", style );
        text.anchor.setTo( 0.5, 0.0 );
        
        //game.physics.startSystem(Phaser.Physics.ARCADE);
        //  Here we create our coins group
        coins = game.add.group();
        coins.enableBody = true;
        
        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 16; i++)
        {
        //  Create a star inside of the 'stars' group
        var coin = coins.create(i * 70, 0, 'coin');

        //  Let gravity do its thing
        coin.body.gravity.y = 4;

        //  This just gives each star a slightly random bounce value
        coin.body.bounce.y = 0.4 + Math.random() * 0.2;
        }
        

        }
    
    function collectCoin (player, coin) {

        // Removes the star from the screen
        coin.kill();
        }
    
    function update() {
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(coins, platforms);
        game.physics.arcade.overlap(player, coins, collectCoin, null, this);
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //////bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, this.game.input.activePointer, 500, 500, 500 )
        
        
        
        player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -399;
    }
        
        
        
        
        
    }
    
    /*function checkIfCanJump() {

    var result = false;

    for (var i=0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++)
    {
        var c = game.physics.p2.world.narrowphase.contactEquations[i];

        if (c.bodyA === player.body.data || c.bodyB === player.body.data)
        {
            var d = p2.vec2.dot(c.normalA, yAxis);

            if (c.bodyA === player.body.data)
            {
                d *= -1;
            }

            if (d > 0.5)
            {
                result = true;
            }
        }
    }
    
    return result;

}*/
};
