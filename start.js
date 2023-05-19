class Start {
    constructor() {
        this.initialize();
        this.setupEventListeners();
    }

    initialize() {
        $("#background-img2").hide();
        $(".level").hide();
        $(".help-content").hide();
    }

    setupEventListeners() {
        $("#start-button").click(() => {
            this.startGame();
        });

        $(".level #back").click(() => {
            this.goBack();
        });

        $("#help-button").click(() => {
            this.showHelp();
        });

        $(".help-content #back").click(() => {
            this.goBack();
        });

        $(".button-style").hover(
            function() {
                $(this).css("background-color", "#FFA200");
                $(this).css("border-width", "8px");
            },
            function() {
                $(this).css("background-color", "");
                $(this).css("border-width", "");
            }
            );
    }

    startGame() {
        $("#start-button").hide();
        $("#set-screen").hide();
        $("#help").hide();
        $("#background-img").hide();
        $("#background-img2").show();
        $(".level").show();
    }

    goBack() {
        location.reload();
    }

    showHelp() {
        $("#start-button").hide();
        $("#set-screen").hide();
        $("#help-button").hide();
        $("#background-img").hide();
        $("#background-img2").show();
        $(".help-content").show();
    }


    //환경설정
    bgm_setting() { 
        bgm=-bgm;
        if(bgm==true){
            audio.addEventListener('ended',function(){this.currentTime=0;this.play();},false);
            audio.play();
            document.getElementById('bgmBtn').value="OFF";
        }
        else{
            document.getElementById('bgmBtn').value="ON";
            audio.pause();
            audio.currentTime=0;
        }
    }
    color_setting(){
    //alert("1");
        var red = document.getElementById("Red").value;
        var green = document.getElementById("Green").value;
        var blue = document.getElementById("Blue").value;
        ballColor = "RGB("+red+","+ green+","+ blue+")";
        var canvas = document.getElementById('settingCanvas');
        var context = canvas.getContext('2d');
        context.beginPath();
        context.fillStyle = ballColor;
        context.fillRect(0, 0, 60, 60);
        context.closePath();
    }

}

$(document).ready(function() {
    new Start();
});
