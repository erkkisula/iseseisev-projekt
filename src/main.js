/* jshint esversion:6*/

import {LoadScene} from "./scenes/LoadScene";
import {MenuScene} from "./scenes/MenuScene";
import {GameScene, ShopScene} from "./scenes/GameScene";
import {OverScene} from "./scenes/OverScene";
import {HelpScene} from "./scenes/HelpScene";


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
        LoadScene, MenuScene, GameScene, OverScene, HelpScene, ShopScene
    ],
    parent: 'game'
};

let game = new Phaser.Game(config);