// Created by Musab Kılıç
let shape = [
math.complex(-0.25555555555555554, - 2.2666666666666666),
math.complex(-0.18888888888888888, 0.13333333333333333),
math.complex(-0.18888888888888888, 1.5888888888888888),
math.complex(0.9111111111111111, 0.5555555555555556),
math.complex(-0.18888888888888888, 1.5666666666666667),
math.complex(1.4555555555555555, 1.7444444444444445),
math.complex(-0.16666666666666666, 1.5555555555555556),
math.complex(1, 2.522222222222222),
math.complex(-0.18888888888888888, 1.5666666666666667),
math.complex(-0.2, 2.533333333333333),
math.complex(-0.15555555555555556, 1.5666666666666667),
math.complex(-1.2333333333333334, 1.7777777777777777),
math.complex(-0.15555555555555556, 1.5666666666666667),
math.complex(-1.0555555555555556, 0.7333333333333333),
math.complex(-0.16666666666666666, 1.6)
];
let trail = [];
let sliderTrail;
let sliderSpeed;
let sliderSize;
let buttonClear;

let TRAIL;
let SPEED;
let SIZE;
let t;

function dft(x){
    let X = [];
    let N = x.length;
    for(let k = 0; k < N; k++){
        let Xk = math.complex(0, 0);
        for(let n = 0; n < N; n++){
            let xn = x[n];
            Xk = Xk.add(xn.mul(math.exp(math.i.mul(-2*PI*k*n/N))));
        }
        X.push(Xk.div(N));
    }
    return X;
}

function g(t, c){
    let N = c.length;
    let r = math.complex(0, 0);
    for(let x = 0; x < c.length; x++){
        let n = (x < N / 2 ? x : - N + x);
        let e = c[x].mul(math.exp(math.i.mul(n * t)));
        r = r.add(e);
    }
    return r;
}

function drawEpicycles(t){
    let C = []
    let N = shape.length;
    let d = dft(shape);
    let r = math.complex(0, 0);

    for(let i = 0; i < d.length; i++){
        C.push([d[i], i]);
    }
    C = C.sort(((x,y) => y[0].abs() - x[0].abs()));
    
    for(let i of C){
        let c = i[0];
        let n = (i[1] < N / 2 ? i[1] : - N + i[1]);
        let e = c.mul(math.exp(math.i.mul(n * t)));

        push();
        stroke(255, 255, 255, 30);
        fill(255, 255, 255, 30);
        ellipse(r.mul(SIZE).re, -r.mul(SIZE).im, e.mul(SIZE*2).abs());
        fill(0, 0, 255, 55);
        ellipse(r.mul(SIZE).re, -r.mul(SIZE).im, 10);
        line(r.mul(SIZE).re, -r.mul(SIZE).im, r.add(e).mul(SIZE).re, -r.add(e).mul(SIZE).im);
        pop();
        r = r.add(e);
    }
    return r.mul(SIZE);
}

function drawComplex(num){
    point(num.re, -num.im);   
}

function setup() {
    createCanvas(600, 600);
    background(0);

    createDiv("<br/>");
    buttonClear = createButton("Clear");
    buttonClear.mousePressed(
        function(){
            shape = [];
            trail = [];
        }
    );
    createP("Trail: ");
    sliderTrail = createSlider(1, 400, 340);
    createP("Speed: ");
    sliderSpeed = createSlider(0.1, 1, 0.9, 0.3);
    createP("Size: ");
    sliderSize  = createSlider(30, 100, 90);
    createDiv("<p># Created by <a href='https://musab.netlify.com'>Musab Kılıç</a></p>");
}

function f(t){
    return g(t, dft(shape)).mul(SIZE);
}

function draw() {
    t = radians(frameCount) * SPEED;

    TRAIL = sliderTrail.value(); 
    SPEED = sliderSpeed.value();
    SIZE  = sliderSize.value();

    background(0);
    translate(width/2, height/2);
    
    trail.push(drawEpicycles(t));
    if(trail.length > TRAIL){
        trail = trail.slice(trail.length - TRAIL);
    }
    
    stroke(255);
    strokeWeight(3);
    /*for(let point of trail){
        drawComplex(point);
    }*/

    for(let i=0;i<trail.length-1;i++){
        let pointA = trail[i];
        let pointB = trail[i+1];
        line(pointA.re, -pointA.im, pointB.re, -pointB.im);
    }

    stroke(255, 0, 0);
    strokeWeight(7);
    for(let point of shape){
        drawComplex(point.mul(SIZE));
    }

    stroke(255);
    strokeWeight(1);
    noFill();

    let C = []
    let d = dft(shape);
    
    for(let i = 0; i < d.length; i++){
        C.push([d[i], i]);
    }
}

function mousePressed(){
    if(mouseX < width){
        if(mouseY < height){
            trail = [];
            shape.push(math.complex((mouseX-width/2)/SIZE, -(mouseY-height/2)/SIZE));
        }
    }
}