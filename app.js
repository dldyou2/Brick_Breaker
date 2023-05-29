import { gameManager } from "./gameManager.js";
class App {
    constructor() {
        // test call
        console.log("App Loaded");
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.mainMenu();
        this.status = 0;
    }
    /*
    Author : 윤찬규
    Date : 2023-05-12
    Description: 초기화 함수

    맨 처음 한 번 실행시키는 함수입니다.
    */
    init() {
        // test call
        console.log("initialize complete");
        $("#start-screen").hide();
        $("#game-display").show();
    }

    /*
    Author : 윤찬규
    Date : 2023-05-12
    Description : 인게임 함수

    게임 플레이의 전제를 관장합니다.
    */
    inGame(difficulty) {
        this.gm = new gameManager(this.ctx, difficulty);

        // test call
        console.log("inGame complete")
    }

    /*
    Author : 윤찬규
    Date : 2023-05-28
    Description : 게임 시작 화면
    */
    mainMenu() {
        const mainBGM = new Audio("./sounds/BGM/Main_Menu.mp3");
        mainBGM.volume = 0.2;
        mainBGM.loop = true;
        mainBGM.play();
        $("#gameStart").on("click", function() {
            console.log("Game Start");
            $("#start-screen #main-menu").hide();
            $("#start-screen #difficulty").show();

            $("#d1").on("click", function() {
                this.init();
                this.gm = null;
                this.inGame(1);
                mainBGM.pause();
            }.bind(this));
            $("#d2").on("click", function() {
                this.init();
                this.gm = null;
                this.inGame(2);
                mainBGM.pause();
            }.bind(this));
            $("#d3").on("click", function() {
                this.init();
                this.gm = null;
                this.inGame(3);
                mainBGM.pause();
            }.bind(this));
            $("#back").on("click", function() {
                $("#main-menu").show();
                $("#difficulty").hide();
            }.bind(this));
        }.bind(this));
        $("#help").on("click", function() {
            if(this.status != 0) 
                return;
            this.status = 1;

            console.log("Help");
            const help = '<img id="helpImg" src="./images/Main/helpPaper/help_v3.png">';
            $("#main-menu").hide();
            $("#start-screen").append(help);
            function removeHelp() {
                $("#helpImg").remove(); 
                $("#main-menu").show();
                this.status = 0;
            }
            setTimeout(removeHelp.bind(this), 2000);
        }.bind(this));

        $("button").on("mouseenter", function() {
            let hoverSound = new Audio("./sounds/In-Game/button_hover.mp3");
            hoverSound.play();
        })
        $("#gameStart img").on("mouseenter", function() {
            $(this).attr("src", "./images/Main/start-hover.png");
        }).on("mouseleave", function() {
            $(this).attr("src", "./images/Main/start.png");
        });
        $("#help img").on("mouseenter", function() {
            $(this).attr("src", "./images/Main/help-hover.png");
        }).on("mouseleave", function() {
            $(this).attr("src", "./images/Main/help.png");
        });
        $("#d1 img").on("mouseenter", function() {
            $(this).attr("src", "./images/Main/easy-hover.png");
        }).on("mouseleave", function() {
            $(this).attr("src", "./images/Main/easy.png");
        });
        $("#d2 img").on("mouseenter", function() {
            $(this).attr("src", "./images/Main/normal-hover.png");
        }).on("mouseleave", function() {
            $(this).attr("src", "./images/Main/normal.png");
        });
        $("#d3 img").on("mouseenter", function() {
            $(this).attr("src", "./images/Main/hard-hover.png");
        }).on("mouseleave", function() {
            $(this).attr("src", "./images/Main/hard.png");
        });
        $("#back img").on("mouseenter", function() {
            $(this).attr("src", "./images/Main/back-hover.png");
        }).on("mouseleave", function() {
            $(this).attr("src", "./images/Main/back.png");
        });
    }
}

window.onload = () => {
    new App();
}