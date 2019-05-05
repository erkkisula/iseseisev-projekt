/* jshint esversion:6*/
import { CST } from "../CST";

export class GameScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.GAME
        });

        this.gameTimer = 0;
        this.score = 0;
        this.scoreAdd = 0.1;
        this.playerMaxHealth = 100;
        this.playerHealth = 100;
        this.playerImmune = 0;
        this.immuneTimer = 0;
        this.level = 1;
        
        this.lastHoming = 5000;
        this.lastBasic = 500;
        this.lastWave = 400;
        this.lastRusher = 1000;
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
        this.info = this.add.text(10,10, "Score: " + this.score, { font: '48px Arial', fill: '#000000' }).setDepth(2);
        this.player = this.add.existing(new Player(this, 600, 300)).setDepth(1).setImmovable(true);
        this.add.image(0,0, "title_bg").setOrigin(0).setDepth(0);    
        //Grupid
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
    }

    update(){
        //punktid
        this.score += this.scoreAdd;
        this.info.setText('Score: ' + Math.round(this.score));
        this.lastBasic ++;
        this.lastHoming ++;
        this.gameTimer ++;
        this.lastWave ++;
        this.lastRusher ++;
        this.spawnBasics();
        this.spawnHoming();
        this.spawnWaves();
        this.spawnRusher();
        this.playerImmunity();
        this.changeLevel();
        this.increaseScoreAdd();
        if(this.hEnemy != undefined){
            if(this.hEnemy.active === true){
                this.physics.accelerateToObject(this.hEnemy, this.player, 200);
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
        if(this.lastBasic > Phaser.Math.Between(150,300)){
            this.bEnemy = this.add.existing(new BasicEnemy(this, Phaser.Math.Between(50, 900), Phaser.Math.Between(50, 680)).setDepth(1));
            this.physics.add.existing(this.bEnemy);
            this.basicenemies.add(this.bEnemy);
            this.lastBasic = 0;
        }
    }

    spawnHoming(){
        if(this.level >= 2 && this.lastHoming >  Phaser.Math.Between(500, 800)){
            this.hEnemy = this.add.existing(new HomingEnemy(this, Phaser.Math.Between(50, 900),  Phaser.Math.Between(50, 680)).setDepth(1));
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
                console.log("Wave Spawning! TYPE: A1");
                this.lastWave = 0;
            }

            if(temp == 2){
                let placeX = 940;
                for(let i = 0; i < 8; i++){
                    this.addWaveEnemyX(placeX, -100, 'wave3', 400);
                    placeX -= 50;
                }
                console.log("Wave Spawning! TYPE: A2");
                this.lastWave = 0;
            }

            if(temp == 3){
                let placeY = 20;
                for(let i = 0; i < 8; i++){
                    this.addWaveEnemyY(-100, placeY, 'wave2', 400);
                    placeY += 50;
                }
                console.log("Wave Spawning! TYPE: A3");
                this.lastWave = 0;
            }
            if(temp == 4){
                let placeY = 700;
                for(let i = 0; i < 8; i++){
                    this.addWaveEnemyY(1060, placeY, 'wave4', -400);
                    placeY -= 50;
                }
                console.log("Wave Spawning! TYPE: A4");
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
                console.log("Wave Spawning! TYPE: B1");
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
                console.log("Wave Spawning! TYPE: B2");
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
                console.log("Wave Spawning! TYPE: B3");
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
                console.log("Wave Spawning! TYPE: B4");
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
                console.log("Wave Spawning! TYPE: B5");
                this.lastWave = 0;
            }
        }
    }

    spawnRusher(){
        if(this.level > 9){
            if(this.lastRusher > 500){
                //let temp = Phaser.Math.Between(1,2);
                let temp = 1;
                if(temp == 1){
                    this.rusher = this.add.existing(new Rusher(this, -100, Phaser.Math.Between(20, 700), 'rusher'));
                    this.physics.add.existing(this.rusher);
                    this.rushers.add(this.rusher);
                    this.physics.accelerateToObject(this.rusher, this.player, 700);
                    this.lastRusher = 0;
                    console.log("RUSHER INCOMING");
                }
            }
        }
    }

    addWaveEnemyX(x, y, texture, vVal){
        this.wave1 = this.add.existing(new WaveEnemy(this, x, y, texture).setDepth(1).setImmovable(true));
        this.physics.add.existing(this.wave1);
        this.wave1.setVelocityY(vVal);
        this.waveenemies.add(this.wave1);
    }

    addWaveEnemyY(x, y, texture, vVal){
        this.wave1 = this.add.existing(new WaveEnemy(this, x, y, texture).setDepth(1).setImmovable(true));
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
            console.log("GAME OVER!");
            this.scene.start("gameover", { score: this.score, level: this.level});
            //this.scene.start("wtf");
        }
    }

    increaseScoreAdd(){
        if((this.level % 2) == 0){
            if(this.scoreAdd != (this.level*0.1)){
                this.scoreAdd = (this.level * 0.1);
                console.log("DEBUG: scoreAdd increase!");
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
}



class Player extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y){
        super(scene, x, y);

        this.setTexture('player');
        this.setPosition(x, y);
        scene.physics.world.enableBody(this, 0);
        this.body.collideWorldBounds = true;
        this.keys = this.scene.input.keyboard.createCursorKeys();
    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);

        //Player movement
        if(this.keys.right.isDown){
            this.setVelocityX(300);
        }else if(this.keys.right.isUp && this.keys.left.isUp){
            this.setVelocityX(0);
        } 
        //ainult üks on vaja olla up     
        if(this.keys.left.isDown){
            this.setVelocityX(-300);
        }

        if(this.keys.up.isDown){
            this.setVelocityY(-300);
        }else if(this.keys.up.isUp && this.keys.down.isUp){
            this.setVelocityY(0);
        }
        if(this.keys.down.isDown){
            this.setVelocityY(300);
        }
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
        //this.setMaxVelocity(500, 500);
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
