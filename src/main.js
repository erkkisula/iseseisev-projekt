/* jshint esversion:6*/

import {LoadScene} from "./scenes/LoadScene";
import {MenuScene} from "./scenes/MenuScene";
import {GameScene} from "./scenes/GameScene";
import {OverScene} from "./scenes/OverScene";

let config = {
    width:960,
    height:720,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0},
            debug: false
        }
    },
    scene:[
        LoadScene, MenuScene, GameScene, OverScene
    ]
};

let game = new Phaser.Game(config);