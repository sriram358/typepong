
var sh = window.innerHeight - (Math.floor(window.innerHeight/900 * 100)); // Gets window height - 200
var sw = window.innerWidth; // Gets window width


//Array of Coordinates of Words
const wor = [sw/144, 17*sw/144, 11*sw/48, 49*sw/144, 65*sw/144, 41*sw/72, 49*sw/72, 19*sw/24, 65*sw/72]

//Array to store which words are in which index
var ind = []

//Array to store the frame number when each word in the last 10 words were typed
var fra = []

//Array to store the number of characters in each word in the last 10 words typed
var cha = []

//Stores the word found in each position on the screen
var dat = []

//Dictionary of 100 most commonly used words
const dict = ["the", "of", "to", "and", "in", "is", "it", "you", "that", "he", "was", "for", "on", "are", "with", "as", "his", "they", "be", "at", "one", "have", "this", "from", "or", "had", "by", "hot", "but", "some", "what", "there", "we", "can", "out", "other", "were", "all", "your", "when", "up", "use", "word", "how", "said", "an", "each", "she", "which", "do", "their", "time", "if", "will", "way", "about", "many", "then", "them", "would", "write", "like", "so", "these", "her", "long", "make", "thing", "see", "him", "two", "has", "look", "more", "day", "could", "go", "come", "did", "my", "sound", "no", "most", "number", "who", "over", "know", "water", "than", "call", "first", "people", "may", "down", "side", "been", "now", "find"]

//If a highscore does not exist, this sets it to 0
if (localStorage.length == 0) {
    localStorage.setItem("hs", 0)
}

//Variables
var change = ""; //indcates whether the paddle moved to the right or left ('+' is for right and '-' is for left)
var score = 0; // Score
var isPower = false //Boolean that stores whehter a power-up currently exists on the canvas
var lost = true //Whether the player has lost the game
var yc = 0 //stores the last time the ball hit something and changed x-direction, to prevent the ball from bouncing continously and repetitively at the same location
var xc = 0 //stores the last time the ball hit something and changed y-direction, to prevent the ball from bouncing continously and repetitively at the same location
var poten = -1 //Current WPM
var hc = 0 //stores the last frame number where the ball hit the paddle
var frameNo = 0 //Current frame number
var lives = 1 //Number of lives
var totalTyped = 0 //Total number of words typed
var highwpm = 0 //Highest WPM thus far
var totalChars = 0 //Total number of characters typed in the last 10 words
var started = false //Checks wheter the game has started
var hsc = false //Checks whether current score is greater than the highscore
var newLife = false //Checks whether it is time for a Life power-up to be generated
var lastLife = 0 //The last score at which a Life power-up was generated
var helpOpened = false; //Checks whether the help page is opened (to prevent many tabs of the same help page from opening)

//Starts the game
function startGame() {
    //Resets Variables
    ind = []
    fra = []
    cha = []
    dat = []

    change = ""; 
    score = 0; 
    isPower = false 
    lost = false
    yc = 0 
    xc = 0 
    poten = -1 
    hc = 0 
    frameNo = 0 
    lives = 1 
    totalTyped = 0 
    highwpm = 0 
    totalChars = 0
    started = false 
    hsc = false 
    newLife = false 
    lastLife = 0 
    helpOpened = false;

    //Paddle
    paddle = new component(5*sw/48, sh/35, "red", myGameArea.canvas.width / 2 - (5*sw/96), myGameArea.canvas.height - (sh/14) , "paddle");

    //Generatres the 8 words
    wo1 = new component(0, 0, "yellow", 0, 13*sh/14, "words", 0);
    wo2 = new component(0, 0, "yellow", 1, 13*sh/14, "words", 0);
    wo3 = new component(0, 0, "yellow", 2, 13*sh/14, "words", 0);
    wo4 = new component(0, 0, "yellow", 3, 13*sh/14, "words", 0);
    wo5 = new component(0, 0, "yellow", 5, 13*sh/14, "words", 0);
    wo6 = new component(0, 0, "yellow", 6, 13*sh/14, "words", 0);
    wo7 = new component(0, 0, "yellow", 7, 13*sh/14, "words", 0);
    wo8 = new component(0, 0, "yellow", 8, 13*sh/14, "words", 0);

    //Ball
    ball = new component(sw/48, sw/48, "white", Math.floor((Math.random() * (65*sw/72)) + sw/48), 3*sh/7, "ball", 0);

    //Score
    scoreboard = new component(0, 0, "lime", 5*sw/288, sh/10, "score", 0);

    //Lives
    liveboard = new component(0, 0, "yellow", 5*sw/6, sh/10, "live", 0)

    //Progress Bar to Next Life power-up
    pb = new component(35*sw/72, sh/28, "white", 5*sw/24, sh/28, "prog", 0)

    //Current text value in the text box
    disp = new component(0, 0, "white", 5*sw/9, 4*sh/7, "dis", 0)

    //WPM meter
    wp = new component(0, 0, "cyan", 5*sw/6, 17*sh/70, "wpm", 0)



    //Picks unique words for the beginning. This picks a word by checking if the new word picked has already been picked previously. If yes, then it runs it again until a new word is picked. Word for index 4 is not picked as that's where the paddle starts
    for (let i = 0; i < 9; i++) {
        if (i == 4) {
            ind[4] = -1
            dat[4] = ""
            continue;
        } else {
            var k = Math.floor(Math.random() * 98);
            if (ind.includes(k)) {
                i--;
            } else {
                ind[i] = k
                dat[i] = dict[k]
                console.log(dict[k])
            }

        }
    }
}

var myGameArea = {
    canvas: document.createElement("canvas"), // creates the Canvas
    create: function() {
        console.log("oj")
    },   
    start: function() {
        //draws the canvas
        this.canvas.width = sw; //usually 1440
        this.canvas.height = sh; // usually 700
        this.context = this.canvas.getContext("2d"); //get all 2D functions and methods provided by the canvas
        document.body.insertBefore(this.canvas, document.body.childNodes[0]); // inserts the canvas into theb HTML document
        this.interval = setInterval(updateGame, 20); //Creates an interval to run the game forever

        // inserts the canvas as first element in the html document


    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); //clears canvas every frame
    },

    stop: function() {
        clearInterval(this.interval)//Interval is cleared
    }

}



//When called, this returns the size of the font in respect to canvas size
function getFont(x, fam){
    var ratio = x/1440;
    var siz = sw * ratio
    return (siz|0) + 'px ' + fam;
}

function mainScreen() {
    //Start screen, and starts the game
    myGameArea.start()
    ctx = myGameArea.context
    ctx.fillStyle = "yellow"
    ctx.font = getFont(90, 'Trebuchet MS');

    ctx.fillText("TypePong!", 25*sw/72, 2*sh/7)
    ctx.font = getFont(60, 'Trebuchet MS');

    ctx.fillText("Type 's' to begin!", sw/3, 4*sh/7)
    ctx.fillText("Type 'i' for help!", sw/3, 5*sh/7)
}





//Component constructor
function component(width, height, colour, x, y, type, vari) {
    this.width = width; //Width of the object
    this.height = height; //Height of the object
    this.x = x; //x position
    this.y = y; //y position
    this.type = type //Type of object
    this.colour = colour //Colour of object (if any)
    this.vari = vari //Variation of object (only used for power-ups)

    ctx = myGameArea.context;

    //how each component begins
    //Paddle -> draws a red rectangle at position 4 (in a range from 0-8, middle of this range)
    if (this.type == "paddle") {
        ctx.fillStyle = this.colour;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.pos = 4; //middle of canvas

    //Words -> text
    } else if (this.type == "words") {
        ctx.font = getFont(30, "Georgia");
        ctx.fillStyle = this.colour;
        ctx.fillText(dat[this.x], wor[this.x], this.y);
        this.ans = dat[this.x];

    //Ball -> a white circle spawns at the middle of the screen
    } else if (this.type == "ball") {
        ctx.beginPath();
        ctx.fillStyle = this.colour
        ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
        ctx.stroke();

        this.xSpeed = 1.5
        this.ySpeed = -1.5 // change of x and y per frame

    //Score -> Displays the score at the top left corner of the screen
    } else if (this.type == "score") {
        ctx.font = getFont(60, "Trebuchet MS");
        ctx.fillStyle = this.colour
        ctx.fillText(score, this.x, this.y)

    //Live -> Displays number of lives at the top right corener of the screen
    } else if (this.type == "live") {
        ctx.font = getFont(60, "Trebuchet MS");
        ctx.fillStyle = this.colour
        ctx.fillText(`Lives: ${lives}`, this.x, this.y)

    } 

    //Function to update each component

    this.update = function() {
        if (this.type == "words") {
            
            //If the paddle moves to the right, word moves to the left, and generates a new word for the position which was originally occupied by the paddle
            if (change == "+" && paddle.pos == this.x) {

                ind[this.x] = -1
                dat[this.x] = ""
                this.x -= 1;

                for (let j = 0; j < 1; j++) {

                    var ne = Math.floor(Math.random() * 98)
                    if (ind.includes(ne)) {
                        j--;
                    } else {
                        ind[this.x] = ne
                        dat[this.x] = dict[ne]
                    }

                }

            }

            //If the paddle moves to the left, word moves to the right, and generates a new word for the position which was originally occupied by the paddle
            if (change == "-" && paddle.pos == this.x) {
                ind[this.x] = -1
                dat[this.x] = ""
                this.x += 1;
                for (let j = 0; j < 1; j++) {

                    var ne = Math.floor(Math.random() * 98)
                    if (ind.includes(ne)) {
                        j--;
                    } else {
                        ind[this.x] = ne
                        dat[this.x] = dict[ne]
                    }

                }
            }

            //Changes the colour of the words directly adjacent to the paddle to cyan, else yellow
            if (Math.abs(this.x - paddle.pos) == 1) {
                this.colour = "aqua"
            } else {
                this.colour = "yellow"
            }
            ctx.font = getFont(30, "Georgia");
            ctx.fillStyle = this.colour
            ctx.fillText(dat[this.x], wor[this.x], this.y);
            this.ans = dat[this.x];

         //Updates the paddle to move to it's new position (if it did change)   
        } else if (this.type == "paddle") {
            ctx.fillStyle = this.colour;
            ctx.fillRect(wor[this.pos] - (5*sw/144), this.y, this.width, this.height);
            
        //Updates ball to move to it's new position 
        } else if (this.type == "ball") {
            ctx.beginPath();
            ctx.fillStyle = this.colour
            ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
            ctx.fill();

        //Updates scoreboard to reflect current score. Also turns the scoreboard cyan if the highscore has been beaten
        } else if (this.type == "score") {
           ctx.font = getFont(60, "Trebuchet MS");
           if (score > localStorage.getItem("hs")) {
                ctx.fillStyle = "cyan"
                localStorage.setItem("hs", Math.floor(score))
                
            } else {
                ctx.fillStyle = this.colour
            }
            
            ctx.fillText(Math.floor(score), this.x, this.y)
            ctx.font = getFont(30, "Trebuchet MS")
            ctx.fillText(`Highscore: ${localStorage.getItem("hs")}`, this.x, this.y + (sh/14))

        //Updates the Lives display to display current number of lives 
        } else if (this.type == "live") {
            ctx.font = getFont(60, "Trebuchet MS");
            ctx.fillStyle = this.colour
            ctx.fillText(`Lives: ${lives}`, this.x, this.y)

        //Updates the progress bar 
        } else if (this.type == "prog") {
            ctx.strokeStyle = "white"
            ctx.strokeRect(this.x, this.y, this.width, this.height)
            ctx.fillStyle = "cyan"
            var wow;
            wow = score%50000 / 50000
            ctx.fillRect(this.x + 1, this.y + 1, wow * (this.width - 2), this.height - 2)
            ctx.fillStyle = "red"
            ctx.fillRect(this.x + this.width + 3*sh/140, this.y, sh/35, sh/35)
            ctx.fillStyle = "pink"
            ctx.font = getFont(20, "Impact");
            ctx.fillText("L", this.x + this.width + (sh/35), this.y + (sh/40))

        //Updates the position of the power-ups (if there are any currently)
        } else if (this.type == "power") {
            this.y += this.spe
            if (this.y > myGameArea.canvas.height) {
                isPower = false
            }
            if (this.vari == 1) {
                ctx.fillStyle = "aqua"
                ctx.fillRect(this.x, this.y, this.width, this.height)
                ctx.fillStyle = "orange"
                ctx.font = getFont(36, "Impact");
                ctx.fillText("S", this.x + this.width / 3, this.y + this.height / 1.25)
            } else if (this.vari == 2) {
                ctx.fillStyle = "gold"
                ctx.fillRect(this.x, this.y, this.width, this.height)
                ctx.fillStyle = "green"
                ctx.font = getFont(36, "Impact");
                ctx.fillText("M", this.x + this.width / 4, this.y + this.height / 1.25)
            } else if (this.vari == 3) {
                ctx.fillStyle = "maroon"
                ctx.fillRect(this.x, this.y, this.width, this.height)
                ctx.fillStyle = "aqua"
                ctx.font = getFont(36, "Impact");
                ctx.fillText("F", this.x + this.width / 3, this.y + this.height / 1.25)
            } else if (this.vari == 0) {
                ctx.fillStyle = "red"
                ctx.fillRect(this.x, this.y, this.width, this.height)
                ctx.fillStyle = "pink"
                ctx.font = getFont(36, "Impact");
                ctx.fillText("L", this.x + this.width / 3, this.y + this.height / 1.25)
            } else if (this.vari == 4) {
                ctx.fillStyle = "green"
                ctx.fillRect(this.x, this.y, this.width, this.height)
                ctx.fillStyle = "lime"
                ctx.font = getFont(36, "Impact");
                ctx.fillText("P", this.x + this.width / 3, this.y + this.height / 1.25)
            }

        //Updates what the player is currently typing
        } else if (this.type == "dis") {
            var fun = document.getElementById("tb").value
            ctx.font = getFont(60, "Impact");
            if(((paddle.pos < 1) || fun != dat[paddle.pos-1].slice(0, fun.length)) && ((paddle.pos > 7) || fun != dat[paddle.pos+1].slice(0, fun.length))){
                ctx.fillStyle = "red"; // Turns red if whatever the player types does not match any of the starting few chars of the two words
            } else if (((paddle.pos >= 1) && fun == dat[paddle.pos-1]) || ((paddle.pos <= 7) && fun == dat[paddle.pos+1])){
                ctx.fillStyle = "lime"; //Turns green if the player has successfully typed a word (indicates them to press space)
                
            } else {
                ctx.fillStyle = "grey";
            }
            
            ctx.fillText(document.getElementById("tb").value, this.x - (5*sw/48), this.y - (sh/14))
        } else if (this.type == "wpm"){
            
            if(totalTyped >= 10){
            ctx.fillStyle = `rgb(${Math.max(0, 255 - poten*2.5)}, ${Math.min(255, poten*2.5)}, ${poten*2 - 80})`// Determines the colour of the WPM indicator. Lower number = red, Average number (~70) = green, high number (~100) = cyan
            } else {
                ctx.fillStyle = "black";
            }
            ctx.font = getFont(40, "Trebuchet MS");
            ctx.fillRect(this.x, this.y, (poten/200)*(5*sw/24), sh/35)
            ctx.fillText(`WPM: ${Math.floor(poten)}`, this.x, this.y + (3*sh/28))

            
        }
    }

    this.collide = function() {//Function for when something collides with the bottom of the screen or paddle
        if (this.type == "ball") { //If this something is a ball
            this.rightEdge = this.x + this.width / 2
            this.leftEdge = this.x - this.width / 2
            this.upEdge = this.y - this.width / 2
            this.downEdge = this.y + this.width / 2

            //Checks if the ball is bouncing on either the left edge or right edge of the screen, multiplies xspeed by -1 if true
            if ((this.rightEdge >= myGameArea.canvas.width || this.leftEdge <= 0)) { 
                this.xSpeed *= -1;
                xc = frameNo
            }
            
            //Checks if the ball is bouncing on the top edge of the screen, multiplies yspeed by -1 if true
            if ((this.upEdge <= 0)) { 
                this.ySpeed *= -1;
                yc = frameNo
            }

            //Checks if the ball is touching the bottom edge, decreases a life and reduces + resets the ball's speed and position respectively if true.
            if (this.downEdge >= myGameArea.canvas.height) {
                //los()
                lives -= 1;
                this.x = Math.floor(Math.random() * (65*sw/72)) + (5*sw/144);
                this.y = 3*sh/7;
                this.xSpeed /= 2;
                this.ySpeed /= 2;
                this.ySpeed = -(Math.abs(this.ySpeed))
                isPower = false //Clears any power-up that may exist on the canvas at the point of losing a life


            }

            //Checks if the ball is touching the paddle, mutliplies the ySpeed by -1 and increase score by 500 if true
            if (this.downEdge >= myGameArea.canvas.height - (3*sh/35) && this.downEdge < myGameArea.canvas.height - (sh/35) && this.leftEdge > wor[paddle.pos] - (sw/18) && this.rightEdge < wor[paddle.pos] + (13*sw/144) && frameNo > hc + 130) {
                hc = frameNo
                this.ySpeed *= -1;
                score += 500
            }



        } else if (this.type == "power") { //if that something is a power-up
            this.downEdge = this.y + this.height

            //Checks if the power-up is touching the paddle, carries out the power-up's function if true
            if (this.downEdge >= myGameArea.canvas.height - (3*sh/35) && this.downEdge < myGameArea.canvas.height && this.x >= wor[paddle.pos] - (sh/7) && this.x < wor[paddle.pos] + (5*sw/72)) {
                
                isPower = false

                if (this.vari == 1) { //Slow powerup -> makes the ball's speed a third of it's original one
                    ball.xSpeed /= 3;
                    ball.ySpeed /= 3;
                } else if (this.vari == 2) { //Multiply powerup -> Multiplies the score with 1.25
                    score *= 1.25;
                } else if (this.vari == 3) {//Fast power-up -> makes the ball go faster
                    ball.xSpeed *= 1.5;
                    ball.ySpeed *= 1.5;
                } else if (this.vari == 0) {//Life power-up -> Grants an extra life
                    lives += 1;
                    newLife = false;
                } else if (this.vari == 4) {//Poision power-up -> Reduces number of lives by 1
                    lives -= 1;
                }
            }
        } else if (this.type == "dis") { //draws a text on the canvas
            ctx.fillText("")

        }
    }


}

//When the player has lost
function los() {
    isPower = false
    lost = true
    
    var final = highwpm
    
    //clear the canvas
    myGameArea.clear();

    //Check if higher than highscore. -> If yes, new highscore is set -> If not, nothing happens and display highscore
    if (localStorage.length == 0 || score > localStorage.getItem("hs")) {
        localStorage.setItem("hs", Math.floor(score));
        ctx.font = getFont(50, "Trebuchet MS");
        ctx.fillStyle = "cyan"
        ctx.fillText(`New Highscore!!!`, 5*sw/24, 3*sh/7)
    } else {
        
        ctx.font = getFont(50, "Trebuchet MS");
        ctx.fillStyle = "yellow"
        ctx.fillText(`Highscore: ${localStorage.getItem("hs")}`, 5*sw/24, 3*sh/7)

    }

    //Final Score
    ctx.font = getFont(90, "Trebuchet MS");
    ctx.fillStyle = "yellow"
    ctx.fillText(`Your Score: ${Math.floor(score)}`, 5*sw/24, 3*sh/14)
    ctx.font = getFont(50, "Trebuchet MS");
    if(totalTyped < 10){
        ctx.fillStyle = "red"
        ctx.fillText(`Highest WPM: Too little words to determine`, 5*sw/24, 9*sh/14)
        ctx.fillStyle = "yellow"
    } else {
        ctx.fillText(`Highest WPM: ${Math.floor(final)} WPM`, 5*sw/24, 9*sh/14)
    }
    
    ctx.fillText(`Type 's' to play again :)`, 5*sw/24, 6*sh/7)
}

//Function to find WPM
function findWPM(x){
    if(x != -1){ //x is -1 when no new words are typed, as this function is called every frame
        if(fra.length >= 10){ // removes the first element, adds x at the back
            fra.splice(0, 1)
            fra.push(frameNo)
            totalChars -= cha[0]; //changes the totalChars to reflect the total number of characters in the last 10 words typed. Subtracts first element and adds last element
            cha.splice(0, 1)
            cha.push(x)
            totalChars += cha[9];
        } else {
            fra.push(frameNo)
            cha.push(x)
            totalChars += cha[cha.length-1];
        }
    }
    

    if(fra.length >= 10 && totalChars > 1 && frameNo > 10){
        poten = (3000/(frameNo - fra[0]) * totalChars) / (totalChars / fra.length);
    } else {
        poten = 0
    }

    
    if (poten >= highwpm){
        highwpm = poten
    }
    return;
}

//Updates the game for every frame
function updateGame() {


    if (lost && document.getElementById("tb").value == 's') { //Starts the game when there is something typed in the textbox.
        lost = false
        helpOpened = false;
        document.getElementById("tb").value = ""
        startGame()
        
    } else if (lost && document.getElementById("tb").value == 'i' && helpOpened == false) { //Starts the game when there is something typed in the textbox.
        helpOpened = true;
        console.log(frameNo)
        window.open('https://www.notion.so/Gameplay-Mechanics-and-Features-41305594008049ea9a5a0764963ffdd3', '_blank');
        document.getElementById("tb").value = ""
        console.log(frameNo)
        
    } 

    

    document.getElementById("tb").value = document.getElementById("tb").value.toLowerCase()


    //If there are no more lives
    if (lives <= 0) {
        los()
        document.getElementById("tb").value = ""
    }
    
    
    //If the game has not been lost yet
    if (!lost) {
        findWPM(-1)
        myGameArea.clear();
        frameNo += 1;
        
        
        //if the word on the right of the paddle is typed correctly
        if (paddle.pos != 8 && document.getElementById("tb").value == dat[paddle.pos + 1] + " ") {
            paddle.pos += 1; //paddle goes right
            findWPM(dat[paddle.pos].length)
            dat[paddle.pos] = "";
            change = "+"; //change in position is +1
            document.getElementById("tb").value = "";
            totalTyped += 1
            score += 100
            

            //if the word on the left of the paddle is typed correctly
        } else if (paddle.pos != 0 && document.getElementById("tb").value == dat[paddle.pos - 1] + " ") {
            paddle.pos -= 1; //paddle goes left
            //totalChars += dat[paddle.pos].length
            findWPM(dat[paddle.pos].length)
            dat[paddle.pos] = "";
            change = "-"; //change in position is -1

            document.getElementById("tb").value = "";
            totalTyped += 1
            score += 100


            //If just a space is typed, then clear the textbox
        } else if (document.getElementById("tb").value == " ") {
            document.getElementById("tb").value = "";
        } else if (document.getElementById("tb").value[document.getElementById("tb").value.length - 1] == " "){
            document.getElementById("tb").value = document.getElementById("tb").value.slice(0, document.getElementById("tb").value.length - 1);
        }
        //Update all components
        wo1.update();
        wo2.update();
        wo3.update();
        wo4.update();
        wo5.update();
        wo6.update();
        wo7.update();
        wo8.update();
        ball.update();
        paddle.update();
        pb.update();
        disp.update();
        change = "";
        wp.update();

        //for every frame, increase the speed of the ball by 0.002
        if (ball.xSpeed < 0) {
            ball.xSpeed -= 0.0025;
        } else {
            ball.xSpeed += 0.0025
        }

        if (ball.ySpeed < 0) {
            ball.ySpeed -= 0.0025;
        } else {
            ball.ySpeed += 0.0025;
        }


        //update the ball's coordinates
        ball.x += ball.xSpeed
        ball.y += ball.ySpeed

        //check if the ball collided with the paddle or the bottom of the screen
        ball.collide();
        
        //increase the score by the ball's speed
        score += (Math.abs(ball.xSpeed))*(poten/10) + 0.5

        //update score
        scoreboard.update();

        //update lives
        liveboard.update();

        //Power Ups (the code is only executed if a power-up currently does not exist on the canvas or newLife is true)
        if (isPower == false || newLife) {

            var cli = Math.floor(Math.random() * 500) //1 in 500 chance of a power up spawning

            if(newLife){ //makes the power-up spawn for sure
                cli = 3
            }

            if (cli == 3 && isPower == false) {
                isPower = true;
                //determine type of powerup
                var typ = Math.floor(Math.random() * 4) + 1

                if(newLife){//changes the type of the power-up to Life if newLife is true
                    typ = 0
                    newLife = false
                }

                //create power up
                po = new component(5*sw/144, 5*sw/144, "", Math.floor(Math.random() * (65*sw/72)) + (sw/48), - (sh/14), "power", typ)
                po.spe = (Math.random() * 3) + 1

            } else if(isPower == true){
                po.update(); 
                po.collide();
            }
        } else { //If a power up does exist...
            //Check if the power up either has touched the paddle or the bottom of the screen
            po.update();
            po.collide();
        }
    }


    //Hides the instructions near the textbox once the score reaches 500
    if (score >= 500 && document.getElementById("hint").style.opacity !== undefined) {
        document.getElementById("hint").style.opacity = 0
    }

    //Turns newLife true when the score is a multiple of 50000
    if(Math.floor(score) >= lastLife + 50000 && newLife == false){
        lastLife = Math.floor(score)
        newLife = true
    }


}
