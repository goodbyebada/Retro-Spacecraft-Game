let score = 0;

//캔버스세팅

let canvas;
let ctx; //ctx?

canvas = document.createElement("canvas"); //캔버스 엘리먼트 생성
ctx = canvas.getContext("2d"); //캔버스 2d 컨택스트 가져오기 ==> 실제로 그려지는 요소
canvas.width= 400; 
canvas.height = 550;
document.body.appendChild(canvas); //body 채그 내부 하단에 캔버스 엘리먼트 주입

let backgroundImage, bulletImage, enemyImage, gameOverImage; //변수

let gameOver = false; //true이면 게임이 끝남, false이면 게임이 안 끝남

//우주선 좌표
let spaceshipX = canvas.width/2-32 ;
let spaceshipY = canvas.height- 64;

let bulletList = [] 

//총알생성
function Bullet(){
  

    this.init = function(){
        this.x = spaceshipX + 0 ;
        this.y = spaceshipY;
        this.alive = true; // true면 살아있는 총알 false면 죽어있는 총알
        bulletList.push(this);
    }

    this.update = function(){
        if(this.y <=  0){
            this.alive = false
        }
        this.y -= 7;
        
    };

    this.checkHit = function(){
        //총알.y <= 적군.y And
        //총알.x >= 적군.x and 총알.x <= 적군.x + 적군의 넓이
        for(let i=0 ; i < enemyList.length;i++){
            if(this.y <= enemyList[i].y && 
               this.x >= enemyList[i].x && 
               this.x <= enemyList[i].x + 40) 
               {
                console.log("hit!!")
                //총알이 죽게됨 적군의 우주선이 없어짐, 점수 획득

                score++; 
                console.log("x: "+this.x.toString() + " y: "+ this.y.toString());

                this.alive = false; //죽은 총알
                enemyList.splice(i,1) //1개의 요소를 제거 => 우주선 잘라내기
               }

             
        }

    }
}

function generateRandomValue(min,max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;
    return randomNum;
}



let enemyList = [];
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = 0;
        this.x = generateRandomValue(0,canvas.width - 64);
        enemyList.push(this);

    };
    //생성
    //?? enemy list?? -> render 

    this.update = function(){
        this.y += 3;
    // 적군 내려오기 속도

    if(this.y >= canvas.height - 52){
        gameOver = true;
        console.log("game over");
        
    }
};

}

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src = "images/background.jpg";

    spaceshipImage = new Image();
    spaceshipImage.src = "images/spaceship.png";

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png";

    enemyImage = new Image();
    enemyImage.src = "images/enemy.png";

    gameOverImage = new Image();
    gameOverImage.src = "images/gameover.png";

}

let keysDown = {};

function setupKeyboardListener(){
    document.addEventListener("keydown",function(event){
        keysDown[event.keyCode] = true;
        
    });
    document.addEventListener("keyup",function(event){
        delete keysDown[event.keyCode];

        if(event.keyCode == 32){
            createBullet(); //총알 생성
        
        }

    })
}


function createBullet(){
    console.log("총알 생성");
    let b = new Bullet();//총알 하나 생성
    b.init(); 
    console.log("새로운 총알 리스트",bulletList);
}
//o

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy();
        e.init();
        //적군 생성 
    }, 1000);
    //interval 간격
}

function update(){
    if(39 in keysDown){
        spaceshipX += 5; //우주선의 속도
    } //right
    if(37 in keysDown){
        spaceshipX -= 5;
    } //left
    if(spaceshipX <= 0){
        spaceshipX = 0;
    }
    if(spaceshipX >= canvas.width-64){
        spaceshipX = canvas.width-64;
    }

        //총알의 y좌표 업데이트를 위한 함수 
    for(let i = 0; i < bulletList.length; i++){

        if(bulletList[i].alive){
       
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    
       
    }

    //적군 y좌표 업데이트를 위한 함수
    for( let i =0; i< enemyList.length; i++){
        enemyList[i].update(); //???
    }
}



function render(){
    ctx.drawImage(backgroundImage, 0 , 0, canvas.width , canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);

    ctx.fillText( 'Score: '+score,20,20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    for(let i=0; i< bulletList.length; i++){
        if (bulletList[i].alive){
        ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y,40,40);
        }

    }

    for(let i=0; i< enemyList.length; i++){
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }
    
    


}

function main(){
    if(!gameOver){
        update(); //좌표값 업데이트
        render(); // 그리기
        requestAnimationFrame(main);
    
    }else{
        ctx.drawImage(gameOverImage,10,100,380,380);
        //
    }
}


loadImage();
setupKeyboardListener();
createEnemy();
main();



//총알 만들기
//1.스페이스바를 누르면 총알 발사
//2.총알 발사 = 총알의 y값이 --, 총알의 x값은? 스페이스를 누른 순간의 우주선의 x좌표
//3.발사된 총알 배열에 저장을 한다
//4.총알들은 x,y좌표값이 있어야하다
//5.총알 배열을 가지고 render 그려준다

//적군이 죽는다
//총알이 적군에게 닿는다
//총알.y <= 적군.y and 총알.x >= 적군.x and 총알.x <= 적군.x + 40
//==> 닿았다 
//==> 총알이 죽게됨 적군의 우주선이 없어짐, 점수 획득
