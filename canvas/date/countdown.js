const windowWidth = document.body.clientWidth;
const windowHeight = document.body.clientHeight - 5;
const radius = Math.round((windowWidth * 4) / 5 / 108) - 1;
const marginTop = Math.round(windowHeight / 5); //数字距离画布顶部的距离
const marginLeft = Math.round(windowWidth / 10); //第一个数字距离画布左边的距离

// const endTime = new Date(2019, 8, 7, 22, 18, 24);
let curShowTimeSeconds = 0;

//坐标 x,y,半径,加速度,x轴速度,y轴速度
// const ball = {x:512,y:100,r:20,vx:-4,vy:0,color:'#058'}
var balls = [];
const colors = [
  "#33B5E5",
  "#0099CC",
  "#AA66CC",
  "#9933CC",
  "#99CC00",
  "#669900",
  "#FFBB33",
  "#FF8800",
  "#FF4444",
  "#CC0000"
];
const canvas = document.getElementById("canvas");
canvas.width = windowWidth;
canvas.height = windowHeight;
const context = canvas.getContext("2d");

curShowTimeSeconds = getCurrentShowTimeSeconds();
setInterval(() => {
  // console.log(1)
  render(context);
  update();
}, 50);

function update() {
  /**
   * 在屏幕上显示倒计时，获取下一次的时间 nextShowTimeSeconds
   * 比较当前的时间和下一次时间是否相同（只需比较 秒 即可）
   * 如果 nextSeconds 不等于 curSeconds ，说明时间变化了，需要更新当前时间。
   */
  let nextShowTimeSeconds = getCurrentShowTimeSeconds();

  let nextHour = parseInt(nextShowTimeSeconds / 3600);
  let nextMinutes = parseInt((nextShowTimeSeconds - nextHour * 3600) / 60);
  let nextSeconds = nextShowTimeSeconds % 60;

  let curHour = parseInt(curShowTimeSeconds / 3600);
  let curMinutes = parseInt((curShowTimeSeconds - curHour * 3600) / 60);
  let curSeconds = curShowTimeSeconds % 60;

  if (nextSeconds !== curSeconds) {
    if (parseInt(curHour / 10) !== parseInt(nextHour / 10)) {
      addBall(marginLeft, marginTop, parseInt(curHour / 10));
    }
    if (parseInt(curHour % 10) !== parseInt(nextHour % 10)) {
      addBall(
        marginLeft + 15 * (radius + 1),
        marginTop,
        parseInt(curHour % 10)
      );
    }
    if (parseInt(curMinutes / 10) !== parseInt(nextMinutes / 10)) {
      addBall(
        marginLeft + 39 * (radius + 1),
        marginTop,
        parseInt(curMinutes / 10)
      );
    }
    if (parseInt(curMinutes % 10) !== parseInt(nextMinutes % 10)) {
      addBall(
        marginLeft + 54 * (radius + 1),
        marginTop,
        parseInt(curMinutes % 10)
      );
    }
    if (parseInt(curSeconds / 10) !== parseInt(nextSeconds / 10)) {
      addBall(
        marginLeft + 78 * (radius + 1),
        marginTop,
        parseInt(curSeconds / 10)
      );
    }
    if (parseInt(curSeconds % 10) !== parseInt(nextSeconds % 10)) {
      addBall(
        marginLeft + 93 * (radius + 1),
        marginTop,
        parseInt(curSeconds % 10)
      );
    }

    curShowTimeSeconds = nextShowTimeSeconds;
  }

  //对已经存在的小球进行更新
  updateBall();
}
function updateBall() {
  balls.forEach(ball => {
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vy += ball.g;

    //小球落地检测
    if (ball.y >= windowHeight - radius) {
      ball.y = windowHeight - radius;
      ball.vy = -ball.vy * 0.6;
    }
    //删除已经离开屏幕的小球
    let cnt = 0;
    balls.forEach(ball => {
      //小球的 x 坐标 + 小球的半径 > 0 并且 小球的坐标 - 小球的半径 < 画布半径，说明小球在画布里面。
      if (ball.x + radius > 0 && ball.x - radius < windowWidth) {
        //前 cnt 个小球在画布内，后面的都不在。
        balls[cnt++] = ball;
      }
    });
    //Math.min，如果 cnt > 300，取300，否则取 cnt
    while (balls.length > Math.min(300, cnt)) {
      balls.pop();
    }
  });
}
function addBall(x, y, num) {
  digit[num].forEach((element, i) => {
    element.forEach((item, j) => {
      let aBall = {};
      if (item === 1) {
        aBall = {
          x: x + j * 2 * (radius + 1) + (radius + 1),
          y: y + i * 2 * (radius + 1) + (radius + 1),
          g: 1.5 + Math.random(), //加速度
          vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4, //前面一段是取 -1 还是 1
          vy: -5,
          color: colors[Math.floor(Math.random() * colors.length)]
        };
      }
      balls.push(aBall);
    });
  });
}
function render(ctx) {
  ctx.clearRect(0, 0, windowWidth, windowHeight);

  const hour = parseInt(curShowTimeSeconds / 3600);
  const minutes = parseInt((curShowTimeSeconds - hour * 3600) / 60);
  const seconds = parseInt(curShowTimeSeconds % 60);

  renderDigit(marginLeft, marginTop, parseInt(hour / 10), ctx);
  /**
   * 第二个数字的起始位置怎么确定？
   * marginLeft 加上第一个数字的位置。我们的数字点阵是 7 列，一个数字的距离就是 14*(R+1)，为了留出两个数字间的距离，所以就用了 15
   */
  renderDigit(
    marginLeft + 15 * (radius + 1),
    marginTop,
    parseInt(hour % 10),
    ctx
  );
  renderDigit(marginLeft + 30 * (radius + 1), marginTop, 10, ctx);
  renderDigit(
    marginLeft + 39 * (radius + 1),
    marginTop,
    parseInt(minutes / 10),
    ctx
  );
  renderDigit(
    marginLeft + 54 * (radius + 1),
    marginTop,
    parseInt(minutes % 10),
    ctx
  );
  renderDigit(marginLeft + 69 * (radius + 1), marginTop, 10, ctx);
  renderDigit(
    marginLeft + 78 * (radius + 1),
    marginTop,
    parseInt(seconds / 10),
    ctx
  );
  renderDigit(
    marginLeft + 93 * (radius + 1),
    marginTop,
    parseInt(seconds % 10),
    ctx
  );
  balls.forEach(ball => {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, radius, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fill();
  });
}

function renderDigit(x, y, num, ctx) {
  ctx.fillStyle = "rgb(0,102,153)";
  digit[num].forEach((element, i) => {
    element.forEach((item, j) => {
      if (item === 1) {
        /*
        圆的半径为 R，包围盒的方框为 R+1，所以每个方框的边长就是 2*(R+1)
        假设点阵顶点为 (x,y)，i 表示行，j 表示列
        所以第 (i,j) 位置的坐标是:
        centerX: x + j*2*(R+1)+(R+1)   //其中 x + j*2*(R+1) 是绘制到包围盒的前面，在加上 (R+1)，使得绘制的点在圆心。
        centerY: y + i*2*(R+1)+(R+1)
        */
        ctx.beginPath();
        ctx.arc(
          x + j * 2 * (radius + 1) + (radius + 1),
          y + i * 2 * (radius + 1) + (radius + 1),
          radius,
          0,
          2 * Math.PI
        );
        ctx.closePath();
        ctx.fill();
      }
    });
  });
}
function getCurrentShowTimeSeconds() {
  const curTime = new Date();
  let ret =
    curTime.getHours() * 3600 +
    curTime.getMinutes() * 60 +
    curTime.getSeconds();
  return ret;
}
