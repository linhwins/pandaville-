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
        //game.load.spritesheet('panda', 'assets/pandasprites1.gif', 29, 30); //load panda sprite
        game.load.spritesheet('panda', 'assets/pandasprites11test.png', 120, 122); //load panda sprite
        game.load.image('coin', 'assets/pandacoin.png'); //load coin 
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

    
    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        /////bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
        ////bkgr = game.add.tileSprite(0, 0, 2000, 2000, 'bambooscreen'); 
        game.add.sprite(0,0,'bambooscreen');
        //game.add.sprite(0,0,'coin');
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        ////bouncy.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        ////////game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        ////////////bouncy.body.collideWorldBounds = true;
        
         game.physics.startSystem(Phaser.Physics.P2JS);
         game.physics.startSystem(Phaser.Physics.ARCADE);

        game.physics.p2.gravity.y = 350;
        game.physics.p2.world.defaultContactMaterial.friction = 0.3;
        game.physics.p2.world.setGlobalStiffness(1e5);
        
        
        //Add a sprite
        //player = game.add.sprite(50, game.world.height - 300, 'panda');
        player = game.add.sprite(200,200,'panda');
        player.animations.add('left', [2], 10, true);
        player.animations.add('turn', [1], 20, true);
        player.animations.add('right', [1], 10, true);
        
        
        //  Enable if for physics. This creates a default rectangular body.
        game.physics.p2.enable(player);
    
        player.body.fixedRotation = true;
        player.body.damping = 0.5;

        var spriteMaterial = game.physics.p2.createMaterial('spriteMaterial', player.body);
        var worldMaterial = game.physics.p2.createMaterial('worldMaterial');
        var boxMaterial = game.physics.p2.createMaterial('worldMaterial');
        
        game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        
        text = game.add.text(200, 100, 'move with arrow, space to jump', { fill: '#190718' });

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
        for (var i = 0; i < 12; i++)
        {
        //  Create a star inside of the 'stars' group
        var coin = coins.create(i * 70, 0, 'coin');

        //  Let gravity do its thing
        coin.body.gravity.y = 6;

        //  This just gives each star a slightly random bounce value
        coin.body.bounce.y = 0.4 + Math.random() * 0.2;
        }

        }
    
    function collectCoin (player, coin) {

        // Removes the star from the screen
        coin.kill();
        }
    
    function update() {
        game.physics.arcade.overlap(player, coins, collectCoin, null, this);
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //////bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, this.game.input.activePointer, 500, 500, 500 );
        if (cursors.left.isDown)
    {
        player.body.moveLeft(200);

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.moveRight(200);

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        player.body.velocity.x = 0;

        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && game.time.now > jumpTimer && checkIfCanJump())
    {
        player.body.moveUp(800);
        jumpTimer = game.time.now + 750;
    }
    }
    
    function checkIfCanJump() {

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

}
};
