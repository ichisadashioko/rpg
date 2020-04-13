enchant();

window.onload = function () {
    var game = new Game(256, 256);
    game.fps = 15;
    game.preload('tilesets.png', 'chara0.png');
    game.spriteWidth = 16;
    game.spriteHeight = 16;

    var map = new Map(game.spriteWidth, game.spriteHeight);
    var foregroundMap = new Map(game.spriteWidth, game.spriteHeight);

    var setMap = function () {
        map.image = game.assets['tilesets.png'];
        map.loadData(mapData1, mapData2);
        map.collisionData = collisionData;
        foregroundMap.image = game.assets['tilesets.png'];
        foregroundMap.loadData(foregroundData);
    }

    var player = new Sprite(32, 32);

    var setPlayer = function () {
        player.x = 1 * 16 - 8;
        player.y = 17 * 16 - 16;
        player.image = new Surface(96, 128);
        player.image.draw(game.assets['chara0.png'], 0, 0, 96, 128, 0, 0, 96, 128);

        player.isMoving = false;
        player.direction = 0;
        player.walk = 1;
        player.addEventListener('enterframe', function () {
            this.frame = this.direction * 3 + this.walk;
            if (this.isMoving) {
                this.moveBy(this.vx, this.vy);

                if (!(game.frame % 3)) { // 0, 3, 6, etc.
                    this.walk++; // 0, 1, 2, 0, 1, 2, etc.
                    this.walk %= 3;
                }
                if ((this.vx && (this.x - 8) % 16 == 0) || (this.vy && this.y % 16 == 0)) {
                    this.isMoving = false;
                    this.walk = 1;
                }
            } else {
                this.vx = this.vy = 0;
                if (game.input.left) {
                    this.direction = 1;
                    this.vx = -4;
                } else if (game.input.right) {
                    this.direction = 2;
                    this.vx = 4;
                } else if (game.input.up) {
                    this.direction = 3;
                    this.vy = -4;
                } else if (game.input.down) {
                    this.direction = 0;
                    this.vy = 4;
                }
                if (this.vx || this.vy) {
                    var x = this.x + (this.vx ? this.vx / Math.abs(this.vx) * 16 : 0) + 16;
                    var y = this.y + (this.vy ? this.vy / Math.abs(this.vy) * 16 : 0) + 16;
                    if (0 <= x && x < map.width && 0 <= y && y < map.height && !map.hitTest(x, y)) {
                        this.isMoving = true;
                        arguments.callee.call(this);
                    }
                }
            }
        });
    }

    var setStage = function () {

        var stage = new Group();
        stage.addChild(map);
        stage.addChild(player);
        stage.addChild(foregroundMap);
        game.rootScene.addChild(stage);

        var pad = new enchant.ui.Pad();
        pad.moveTo(0, game.height - 100);
        game.rootScene.addChild(pad);

        var buttonA = new enchant.ui.Button("A", "light");
        buttonA.moveTo(game.width - 50, game.height - 30);
        buttonA.opacity = 0.5;
        buttonA.addEventListener('touchstart', function () {
            let x = player.x + 8;
            let y = player.y + 16;
            x /= 16;
            y /= 16;
            if(mapData2[y][x] == CAVE){
                if(y == 2 && x == 1){
                    player.moveTo(15 * 16 - 8, 13 * 16 - 16)
                }else if(y == 13 && x == 15){
                    player.moveTo(13 * 16 - 8, 6 * 16 - 16)
                }else if(y == 6 && x == 13){
                    player.moveTo(1 * 16 - 8, 2 * 16 - 16)
                }
                return;
            }
            switch (player.direction) {
                case 0:
                    y += 1;
                    break;
                case 1:
                    x -= 1;
                    break;
                case 2:
                    x += 1;
                    break;
                case 3:
                    y -= 1;
                default:
                    break;
            }
            if (mapData2[y][x] == CHEST || mapData2[y][x] == POT) {
                mapData2[y][x] = -1;
                collisionData[y][x] = 0;
                setMap();
            }
        })
        game.rootScene.addChild(buttonA);

        stage.addEventListener('enterframe', function () {
            let x = (game.width / 2) - (player.x + 8);
            let y = (game.height / 2) - (player.y + 16);
            if (x > 0) {
                x = 0;
            }
            if (y > 0) {
                y = 0;
            }
            if (x < (game.width - map.width)) {
                x = game.width - map.width;
            }
            if (y < (game.height - map.height)) {
                y = game.height - map.height;
            }
            stage.moveTo(x, y);
        });
    }

    game.onload = function () {
        setMap();
        setPlayer();
        setStage();
    };
    game.start();
};

