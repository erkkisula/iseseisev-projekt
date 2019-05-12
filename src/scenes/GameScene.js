/* jshint esversion:6*/
import { CST } from "../CST";

export class GameScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.GAME
        });

    }

    init(){
        console.log("Game starting...");
    }

    preload(){
        this.healthBar = this.add.graphics({
            fillStyle: {
                color: 0x40ff00
            }
        });

        this.healthBarBack = this.add.graphics({
            fillStyle: {
                color: 0xff4000
            }
        });
    }

    create(){
        //Game stats
        this.gameTimer = 0;
        this.score = 0;
        this.coins = 0;
        this.scoreAdd = 0.1;
        this.playerMaxHealth = 100;
        this.playerHealth = 100;
        this.playerImmune = 0;
        this.immuneTimer = 0;
        this.level = 1;
        this.regen = 0;
        this.regenAmount = 0;
        this.regenLevel = 0;
        this.regenCost = 40;
        this.maxHpCost = 30;
        this.speedCost = 25;
        this.fillCost = 0;
        
        this.lastHoming = 5000;
        this.lastBasic = 500;
        this.lastWave = 400;
        this.lastRusher = 1000;
        this.lastRegen = 0;
        this.lastCoin = 0;

        this.info = this.add.text(10,10, "Score: " + this.score, { font: '48px Roboto', fill: '#000000' }).setDepth(1000);
        this.coininfo = this.add.text(10,60, "Coins: " + this.coins, { font: '48px Roboto', fill: '#000000' }).setDepth(1000);
        this.player = this.add.existing(new Player(this, 600, 300, this.playerSpeedVal)).setDepth(2).setImmovable(true);
        this.add.image(0,0, "title_bg").setOrigin(0).setDepth(1);    
        //Groups
        this.basicenemies = this.add.group();
        this.homingenemies = this.add.group();
        this.waveenemies = this.add.group();
        this.rushers = this.add.group();
        //Collisions
        this.physics.add.collider(this.player, this.basicenemies, this.playerHitBasic, null, this);
        this.physics.add.collider(this.player, this.homingenemies, this.playerHitHoming, null, this);
        this.physics.add.collider(this.player, this.waveenemies, this.playerHitWave, null, this);
        this.physics.add.collider(this.player, this.rushers, this.playerHitRusher, null, this);
        //Health
        this.drawHealthBar();
        this.healthBarBack.fillRect(800, 20, 150, 40);
        this.healthBarBack.setDepth(999);
        //Shop
        this.shopButton = this.add.image(750, 20, "shop_button").setOrigin(0, 0).setDepth(1000);
        this.shopButton.setInteractive();

        this.shopButton.on("pointerover", ()=>{
            this.shopButton.setTexture("shop_buttonh");
        });
        this.shopButton.on("pointerout", ()=>{
            this.shopButton.setTexture("shop_button");
        });
        this.shopButton.on("pointerdown", ()=>{
            this.scene.run('shop');
            this.scene.pause();
        });
    }

    update(){
        //punktid
        this.score += this.scoreAdd;
        this.info.setText('Score: ' + Math.round(this.score));
        this.coininfo.setText('Coins: ' + Math.round(this.coins));
        this.lastBasic ++;
        this.lastHoming ++;
        this.gameTimer ++;
        this.lastWave ++;
        this.lastRusher ++;
        this.lastCoin ++;
        this.spawnBasics();
        this.spawnHoming();
        this.spawnWaves();
        this.spawnRusher();
        this.playerImmunity();
        this.changeLevel();
        this.increaseScoreAdd();
        this.healthRegen();
        this.coinGenerator();
        if(this.hEnemy != undefined){
            if(this.hEnemy.active === true){
                if(this.level > 7){
                    this.physics.accelerateToObject(this.hEnemy, this.player, 300);
                }else{
                    this.physics.accelerateToObject(this.hEnemy, this.player, 500);
                }
            }
        }
        this.gameOver();
    }

    playerHitBasic(){
        if(this.playerImmune == 0){
            this.doDamage(10);
            this.score -= 10;
            this.playerImmune = 1;
            this.drawHealthBar();
            this.calculateFillCost();
        }else{
            console.log("Player is immune to damage!");
        }
        
    }

    playerHitHoming(){
        if(this.playerImmune == 0){
            this.doDamage(20);
            this.score -= 30;
            this.playerImmune = 1;
            this.drawHealthBar();
            this.calculateFillCost();
        }else{
            console.log("Player is immune to damage!");
        }
    }

    playerHitWave(){
        if(this.playerImmune == 0){
            this.doDamage(30);
            this.score -= 50;
            this.playerImmune = 1;
            this.drawHealthBar();
            this.calculateFillCost();
        }else{
            console.log("Player is immune to damage!");
        }
    }

    playerHitRusher(){
        if(this.playerImmune == 0){
            this.doDamage(50);
            this.score -= 50;
            this.playerImmune = 1;
            this.drawHealthBar();
            this.calculateFillCost();
        }else{
            console.log("Player is immune to damage!");
        }
    }

    playerImmunity(){
        if(this.playerImmune == 1 && this.immuneTimer != 70){
            this.immuneTimer += 1;
        }
        if(this.playerImmune == 1 && this.immuneTimer >= 70){
            this.playerImmune = 0;
            this.immuneTimer = 0;
            console.log("Player is no longer immune");
        }
    }

    spawnBasics(){
        if(this.level < 11){
            if(this.lastBasic > Phaser.Math.Between(150,300)){
                this.bEnemy = this.add.existing(new BasicEnemy(this, Phaser.Math.Between(50, 900), Phaser.Math.Between(50, 680)).setDepth(2));
                this.physics.add.existing(this.bEnemy);
                this.basicenemies.add(this.bEnemy);
                this.lastBasic = 0;
            }
        }else if(this.level > 10){
            if(this.lastBasic > Phaser.Math.Between(125,225)){
                this.bEnemy = this.add.existing(new BasicEnemy(this, Phaser.Math.Between(50, 900), Phaser.Math.Between(50, 680)).setDepth(2));
                this.physics.add.existing(this.bEnemy);
                this.basicenemies.add(this.bEnemy);
                this.lastBasic = 0;
            }
        }
    }

    spawnHoming(){
        if(this.level >= 2 && this.level < 7 && this.lastHoming >  Phaser.Math.Between(700, 800)){
            this.hEnemy = this.add.existing(new HomingEnemy(this, Phaser.Math.Between(50, 900),  Phaser.Math.Between(50, 680)).setDepth(2));
            this.physics.add.existing(this.hEnemy);
            this.homingenemies.add(this.hEnemy);
            this.physics.accelerateToObject(this.hEnemy, this.player);
            this.lastHoming = 0;
        }else if(this.level > 6 && this.lastHoming >  Phaser.Math.Between(300, 400)){
            this.hEnemy = this.add.existing(new HomingEnemy(this, Phaser.Math.Between(50, 900),  Phaser.Math.Between(50, 680)).setDepth(2));
            this.physics.add.existing(this.hEnemy);
            this.homingenemies.add(this.hEnemy);
            this.physics.accelerateToObject(this.hEnemy, this.player);
            this.lastHoming = 0;
        }
    }

    spawnWaves(){
        if(this.level > 2 && this.level < 8 && this.lastWave > 450){
            let temp = Phaser.Math.Between(1,4);
            if(temp == 1){
                let placeX = 20;
                for(let i = 0; i < 8; i++){
                    this.addWaveEnemyX(placeX, 800, 'wave1', -400);
                    placeX += 50;
                }
                this.lastWave = 0;
            }

            if(temp == 2){
                let placeX = 940;
                for(let i = 0; i < 8; i++){
                    this.addWaveEnemyX(placeX, -100, 'wave3', 400);
                    placeX -= 50;
                }
                this.lastWave = 0;
            }

            if(temp == 3){
                let placeY = 20;
                for(let i = 0; i < 8; i++){
                    this.addWaveEnemyY(-100, placeY, 'wave2', 400);
                    placeY += 50;
                }
                this.lastWave = 0;
            }
            if(temp == 4){
                let placeY = 700;
                for(let i = 0; i < 8; i++){
                    this.addWaveEnemyY(1060, placeY, 'wave4', -400);
                    placeY -= 50;
                }
                this.lastWave = 0;
            }
        }

        if(this.level > 7 && this.lastWave > 450){
            let temp = Phaser.Math.Between(1,5);
            //let temp = 5;
            if(temp == 1){
                let placeX = 20;
                for(let i = 0; i < 4; i++){
                    this.addWaveEnemyX(placeX, 800, 'wave1', -450);
                    placeX += 50;
                }
                placeX = 350;
                for(let i = 0; i < 13; i++){
                    this.addWaveEnemyX(placeX, 800, 'wave1', -450);
                    placeX += 50;
                }
                this.lastWave = 0;
            }

            if (temp == 2) {
                let placeX = 20;
                for (let i = 0; i < 8; i++) {
                    this.addWaveEnemyX(placeX, -100, 'wave3', 450);
                    placeX += 50;
                }
                placeX = 550;
                for (let i = 0; i < 9; i++) {
                    this.addWaveEnemyX(placeX, -100, 'wave3', 450);
                    placeX += 50;
                }
                this.lastWave = 0;

            }

            if(temp == 3){
                let placeY = 20;
                let placeX = 20;
                for(let i = 0; i < 8; i++){
                    this.addWaveEnemyX(placeX, 800, 'wave1', -400);
                    placeX += 50;
                }
                for(let i = 0; i < 8; i++){
                    this.addWaveEnemyY(1060, placeY, 'wave4', -580);
                    placeY += 50;
                }
                this.lastWave = 0;
            }

            if(temp == 4){
                let placeY = 20;
                for(let i = 0; i < 6; i++){
                    this.addWaveEnemyY(-100, placeY, 'wave2', 400);
                    placeY += 50;
                }
                placeY = 700;
                for(let i = 0; i < 6; i++){
                    this.addWaveEnemyY(1060, placeY, 'wave4', -400);
                    placeY -= 50;
                }
                this.lastWave = 0;
            }

            if(temp == 5){
                let placeX = 20;
                for(let i = 0; i < 6; i++){
                    this.addWaveEnemyX(placeX, 800, 'wave1', -450);
                    placeX += 50;
                }
                placeX = 450;
                for(let i = 0; i < 10; i++){
                    this.addWaveEnemyX(placeX, 800, 'wave1', -450);
                    placeX += 50;
                }
                let placeY = 20;
                for(let i = 0; i < 6; i++){
                    this.addWaveEnemyY(-100, placeY, 'wave2', 400);
                    placeY += 50;
                }
                placeY = 700;
                for(let i = 0; i < 6; i++){
                    this.addWaveEnemyY(1060, placeY, 'wave4', -400);
                    placeY -= 50;
                }
                this.lastWave = 0;
            }
        }
    }

    spawnRusher(){
        if(this.level > 9 && this.level < 14){
            if(this.lastRusher > 500){
                let temp = Phaser.Math.Between(1,2);
                if(temp == 1){
                    this.rusher = this.add.existing(new Rusher(this, -100, Phaser.Math.Between(20, 700), 'rusher').setDepth(2));
                    this.physics.add.existing(this.rusher);
                    this.rushers.add(this.rusher);
                    this.physics.accelerateToObject(this.rusher, this.player, 1300);
                    this.lastRusher = 0;
                }else{
                    this.rusher = this.add.existing(new Rusher(this, 1060, Phaser.Math.Between(20, 700), 'rusher').setDepth(2));
                    this.physics.add.existing(this.rusher);
                    this.rushers.add(this.rusher);
                    this.physics.accelerateToObject(this.rusher, this.player, 1300);
                    this.lastRusher = 0;
                }
            }
        }else if(this.level > 13){
            if(this.lastRusher > 200){
                let temp = Phaser.Math.Between(1,2);
                if(temp == 1){
                    this.rusher = this.add.existing(new Rusher(this, -100, Phaser.Math.Between(20, 700), 'rusher').setDepth(2));
                    this.physics.add.existing(this.rusher);
                    this.rushers.add(this.rusher);
                    this.physics.accelerateToObject(this.rusher, this.player, 1300);
                    this.lastRusher = 0;
                }else{
                    this.rusher = this.add.existing(new Rusher(this, 1060, Phaser.Math.Between(20, 700), 'rusher').setDepth(2));
                    this.physics.add.existing(this.rusher);
                    this.rushers.add(this.rusher);
                    this.physics.accelerateToObject(this.rusher, this.player, 1300);
                    this.lastRusher = 0;
                }
            }
        }
    }

    addWaveEnemyX(x, y, texture, vVal){
        this.wave1 = this.add.existing(new WaveEnemy(this, x, y, texture).setDepth(2).setImmovable(true));
        this.physics.add.existing(this.wave1);
        this.wave1.setVelocityY(vVal);
        this.waveenemies.add(this.wave1);
    }

    addWaveEnemyY(x, y, texture, vVal){
        this.wave1 = this.add.existing(new WaveEnemy(this, x, y, texture).setDepth(2).setImmovable(true));
        this.physics.add.existing(this.wave1);
        this.wave1.setVelocityX(vVal);
        this.waveenemies.add(this.wave1);
    }

    changeLevel(){
        if(this.gameTimer > (this.level*1000)){
            this.level++;
            console.log("Level is now: " + this.level);
        }
    }

    gameOver(){
        if(this.playerHealth <= 0){
            this.finalscore = this.score;
            this.finallevel = this.level;
            
            this.gameTimer = 0;
            this.score = 0;
            this.coins = 0;
            this.scoreAdd = 0.1;
            this.playerMaxHealth = 100;
            this.playerHealth = 100;
            this.playerImmune = 0;
            this.immuneTimer = 0;
            this.level = 1;
            this.regen = 0;
            this.regenAmount = 0;
            this.regenLevel = 0;
            this.regenCost = 40;
            this.maxHpCost = 30;
            this.speedCost = 25;
            this.fillCost = 0;
            
            this.lastHoming = 5000;
            this.lastBasic = 500;
            this.lastWave = 400;
            this.lastRusher = 1000;
            this.lastRegen = 0;
            this.lastCoin = 0;

            console.log("GAME OVER!");
            this.scene.start("gameover", { score: this.finalscore, level: this.finallevel});
        }
    }

    increaseScoreAdd(){
        if((this.level % 2) == 0){
            if(this.scoreAdd != (this.level*0.1)){
                this.scoreAdd = (this.level * 0.1);
            }
        }
    }

    doDamage(dmg){
        if(this.playerHealth >= dmg){
            this.playerHealth -= dmg;
        }else{
            this.playerHealth = 0;
        }
    }

    drawHealthBar(){
        let x = 0;
        let temp = 0;
        temp = (this.playerHealth / this.playerMaxHealth);
        x = 150 * temp;
        this.healthBar.clear();
        this.healthBar.fillRect(800, 20, x, 40);
        this.healthBar.setDepth(1000);
    }

    healthRegen(){
        if(this.regen == 1 && this.lastRegen > 500){
            this.playerHealth += this.regenAmount;
            if(this.playerHealth > this.playerMaxHealth){
                this.playerHealth = this.playerMaxHealth;
            }
            this.lastRegen = 0;
            this.drawHealthBar();
            this.calculateFillCost();
        }else{
            this.lastRegen++;
        }
    }

    coinGenerator(){
        if(this.lastCoin > 99 && this.gameTimer < 2000){
            this.coins++;
            this.lastCoin = 0;
        }else if(this.lastCoin > 69 && this.gameTimer >= 2000 && this.gameTimer < 4000){
            this.coins++;
            this.lastCoin = 0;
        }else if(this.lastCoin > 49 && this.gameTimer >3999){
            this.coins++;
            this.lastCoin = 0;
        }
    }

    calculateFillCost(){
        this.fillCost = (this.playerMaxHealth - this.playerHealth) / 5;
    }
}



class Player extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y){
        super(scene, x, y);

        this.setTexture('player');
        this.setPosition(x, y);
        scene.physics.world.enableBody(this, 0);
        this.body.collideWorldBounds = true;
        this.keys = this.scene.input.keyboard.createCursorKeys();
        this.speed = 300;

        this.moveleft = false;
        this.moveright = false;
        this.moveup = false;
        this.movedown = false;
    }

    create(){

    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);

        //Player movement
        if(this.keys.right.isDown){
            this.setVelocityX(this.speed);
        }
        if(this.keys.left.isDown){
            this.setVelocityX(-this.speed);
        }
        if(this.keys.right.isUp && this.keys.left.isUp){
            this.setVelocityX(0);
        } 
        if(this.keys.up.isDown){
            this.setVelocityY(-this.speed);
        }
        if(this.keys.down.isDown){
            this.setVelocityY(this.speed);
        }
        if(this.keys.up.isUp && this.keys.down.isUp){
            this.setVelocityY(0);
        }
    }

    increaseSpeed(add){
        this.speed += add;
    }
}

class BasicEnemy extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y){
        super(scene, x, y);
        this.setTexture('basic_enemy');
        this.setPosition(x, y);
        this.timeAlive = 0;

        scene.physics.world.enableBody(this, 0);
        this.body.collideWorldBounds = true;
        this.setVelocity(300,300);
        this.setBounce(1,1);
    }

    create(){

    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);
        //time alive
        this.timeAlive ++;
        this.checkAlive();
    }

    checkAlive(){
        if(this.timeAlive > Phaser.Math.Between(400, 700)){
            this.destroy();
        }
    }
}

class HomingEnemy extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y){
        super(scene, x, y);
        this.setTexture('homing_enemy');
        this.setPosition(x, y);
        this.timeAlive = 0;

        scene.physics.world.enableBody(this, 0);
        this.body.collideWorldBounds = true;
        this.setMaxVelocity(400, 400);
        this.setBounce(1,1);
    }

    create(){

    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);

        this.timeAlive ++;
        this.checkAlive();
    }

    checkAlive(){
        if(this.timeAlive > Phaser.Math.Between(600, 800)){
            this.destroy();
        }
    }
}

class WaveEnemy extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y, texture){
        super(scene, x, y);
        this.setTexture(texture);
        this.setPosition(x, y);
        this.timeAlive = 0;

        scene.physics.world.enableBody(this, 0);
    }

    create(){

    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);

        this.timeAlive ++;
        this.checkAlive();
    }

    checkAlive(){
        if(this.timeAlive > 200){
            this.destroy();
        }
    }
}

class Rusher extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y, texture){
        super(scene, x, y);
        this.setTexture(texture);
        this.setPosition(x, y);
        this.timeAlive = 0;

        scene.physics.world.enableBody(this, 0);
    }

    create(){

    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);

        this.timeAlive++;
        this.checkAlive();
    }

    checkAlive(){
        if(this.timeAlive > 150){
            this.destroy();
        }
    }
}

export class ShopScene extends Phaser.Scene{
    constructor(){
        super({
            key: "shop"
        });

    }
    
    create(){
        let gameplay = this.scene.get(CST.SCENES.GAME);
        this.shopBack = this.add.image(15, 100, "shop_back").setOrigin(0).setDepth(0);
        this.shopText = this.add.text(40, 123, "Shop", { font: '48px Arial', fill: '#000000' }).setDepth(0);
        this.closeButton = this.add.image(886, 117, "close_button").setOrigin(0).setDepth(0);
        this.regenButton = this.add.image(300, 250, "buy_button").setOrigin(0).setDepth(0);
        this.regenText = this.add.text(40, 250, "Health regen", { font: '40px Arial', fill: '#000000' }).setOrigin(0).setDepth(0);
        this.regenCost = this.add.text(360, 250, "Cost: " + gameplay.regenCost +" coins", { font: '40px Arial', fill: '#000000' }).setOrigin(0).setDepth(0);
        this.speedButton = this.add.image(300, 330, "buy_button").setOrigin(0).setDepth(0);
        this.speedText = this.add.text(40, 330, "Player speed", { font: '40px Arial', fill: '#000000' }).setOrigin(0).setDepth(0);
        this.speedCost = this.add.text(360, 330, "Cost: " + gameplay.speedCost + " coins", { font: '40px Arial', fill: '#000000' }).setOrigin(0).setDepth(0);
        this.healthButton = this.add.image(300, 410, "buy_button").setOrigin(0).setDepth(0);
        this.healthText = this.add.text(40, 410, "Fill health", { font: '40px Arial', fill: '#000000' }).setOrigin(0).setDepth(0);
        this.healthCost = this.add.text(360, 410, "Cost: " + gameplay.fillCost + " coins", { font: '40px Arial', fill: '#000000' }).setOrigin(0).setDepth(0);
        this.maxHealthButton = this.add.image(300, 490, "buy_button").setOrigin(0).setDepth(0);
        this.maxHealthText = this.add.text(40, 490, "Max Health +", { font: '40px Arial', fill: '#000000' }).setOrigin(0).setDepth(0);
        this.maxHealthCost = this.add.text(360, 490, "Cost: " + gameplay.maxHpCost + " coins", { font: '40px Arial', fill: '#000000' }).setOrigin(0).setDepth(0);

        this.notice = this.add.text(250, 130, "", { font: '40px Arial', fill: '#000000' }).setDepth(1);

        this.closeButton.setInteractive();

        this.closeButton.on("pointerover", ()=>{
            this.closeButton.setTexture("close_buttonh");
        });
        this.closeButton.on("pointerout", ()=>{
            this.closeButton.setTexture("close_button");
        });
        this.closeButton.on("pointerdown", ()=>{
            this.scene.resume(CST.SCENES.GAME);
            this.scene.stop();
        });

        this.regenButton.setInteractive();

        this.regenButton.on("pointerover", ()=>{
            this.regenButton.setTexture("buy_buttonh");
        });
        this.regenButton.on("pointerout", ()=>{
            this.regenButton.setTexture("buy_button");
        });
        this.regenButton.on("pointerdown", ()=>{
            if(gameplay.regenLevel < 4){
                if(gameplay.coins >= gameplay.regenCost){
                    if(gameplay.regen == 0){
                        gameplay.regen = 1;
                    }
                    gameplay.regenAmount += 5;
                    gameplay.regenLevel++;
                    gameplay.coins -= gameplay.regenCost;
                    gameplay.coininfo.setText("Coins: " + gameplay.coins);
                    gameplay.regenCost += 10;
                    this.regenCost.setText("Cost: " + gameplay.regenCost +" coins");
                }else if(gameplay.coins < gameplay.regenCost){
                    this.notice.setText("Not enough coins!");
                }
            }else{
                this.notice.setText("Out of stock!");
            }
        });

        this.speedButton.setInteractive();

        this.speedButton.on("pointerover", ()=>{
            this.speedButton.setTexture("buy_buttonh");
        });
        this.speedButton.on("pointerout", ()=>{
            this.speedButton.setTexture("buy_button");
        });
        this.speedButton.on("pointerdown", ()=>{
            if(gameplay.coins >= gameplay.speedCost){
                gameplay.player.increaseSpeed(50);
                gameplay.coins -= gameplay.speedCost;
                gameplay.coininfo.setText("Coins: " + gameplay.coins);
                gameplay.speedCost += 10;
                this.speedCost.setText("Cost: " + gameplay.speedCost +" coins");
            }else if(gameplay.coins < gameplay.speedCost){
                this.notice.setText("Not enough coins!");
            }
        });

        this.healthButton.setInteractive();

        this.healthButton.on("pointerover", ()=>{
            this.healthButton.setTexture("buy_buttonh");
        });
        this.healthButton.on("pointerout", ()=>{
            this.healthButton.setTexture("buy_button");
        });
        this.healthButton.on("pointerdown", ()=>{
            if(gameplay.coins >= gameplay.fillCost){
                gameplay.coins -= gameplay.fillCost;
                gameplay.playerHealth = gameplay.playerMaxHealth;
                gameplay.drawHealthBar();
                gameplay.calculateFillCost();
                gameplay.coininfo.setText("Coins: " + gameplay.coins);
                this.healthCost.setText("Cost: " + gameplay.fillCost +" coins");
            }else if(gameplay.coins < gameplay.fillCost){
                this.notice.setText("Not enough coins!");
            }
        });
        
        this.maxHealthButton.setInteractive();

        this.maxHealthButton.on("pointerover", ()=>{
            this.maxHealthButton.setTexture("buy_buttonh");
        });
        this.maxHealthButton.on("pointerout", ()=>{
            this.maxHealthButton.setTexture("buy_button");
        });
        this.maxHealthButton.on("pointerdown", ()=>{
            if(gameplay.coins >= gameplay.maxHpCost){
                gameplay.playerMaxHealth += 25;
                gameplay.drawHealthBar();
                gameplay.calculateFillCost();
                gameplay.coins -= gameplay.maxHpCost;
                gameplay.coininfo.setText("Coins: " + gameplay.coins);
                gameplay.maxHpCost += 10;
                this.healthCost.setText("Cost: " + gameplay.fillCost +" coins");
                this.maxHealthCost.setText("Cost: " + gameplay.maxHpCost +" coins");
            }else if(gameplay.coins < gameplay.maxHpCost){
                this.notice.setText("Not enough coins!");
            }
        });
    }
}