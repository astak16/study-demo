[项目演示](https://astak16.github.io/study-demo/canvas/countdown/)

## 点阵

在`canvas`中绘制数字，可以使用点阵的方式。

![7.png](https://i.loli.net/2019/09/08/F1ZtaXvmriO23kp.png)

下面是`5`的点阵布局，`1`代表要绘制，`0`代表不要绘制。这里数字采用的是`10 * 7`的网格系统，冒号是`10 * 4`的网格系统。

```js
[
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [0, 1, 1, 1, 1, 1, 0]
]
```

有了这个这个网格的系统，我们就能将数字绘制出来了。

## 数字绘制

在`canvas`中如何用圆将数字绘制出来呢？，圆心的`x`轴坐标，`y`坐标如何确定？

```js
ctx.arc(
  x + j * 2 * (radius + 1) + (radius + 1),
  y + i * 2 * (radius + 1) + (radius + 1),
  radius,
  0,
  2 * Math.PI
)
```
假设圆的半径为`R`
* 圆的半径为`R`，包围盒的方框为`R+1`，所以每个方框的边长就是`2*(R+1)`
* 假设点阵顶点为`(x,y)`，`i`表示行，`j`表示列
* 所以第`(i,j)`位置的坐标是:
    * `x`轴坐标: `x + j*2*(R+1)+(R+1)`
    * `y`轴坐标: `y + i*2*(R+1)+(R+1)`

这里面`x + j*2*(R+1)` 是绘制到包围盒的前面，在加上`(R+1)`，使得绘制的点在圆心。

## 如何确定第二个数的位置

第二个数字的起始位置怎么确定？

`marginLeft`加上第一个数字的位置。我们的数字点阵是`7`列，一个数字的占的空间就是`14*(R+1)`，为了在两个数字间空出点的距离，所以就用了`15`

这要注意第三个位置是冒号，而我们冒号使用的是`10 * 4`的点阵系统，所以在绘制第四个数字时，加上的是`9`而不是`15`。

```js
renderDigit(marginLeft, marginTop, parseInt(hour / 10), ctx);
renderDigit(marginLeft + 15 * (radius + 1), marginTop, parseInt(hour % 10), ctx);
renderDigit(marginLeft + 30 * (radius + 1), marginTop, 10, ctx);
renderDigit(marginLeft + 39 * (radius + 1), marginTop, parseInt(minutes / 10), ctx);
renderDigit(marginLeft + 54 * (radius + 1), marginTop, parseInt(minutes % 10), ctx);
renderDigit(marginLeft + 69 * (radius + 1), marginTop, 10, ctx);
renderDigit(marginLeft + 78 * (radius + 1), marginTop, parseInt(seconds / 10), ctx);
renderDigit(marginLeft + 93 * (radius + 1), marginTop, parseInt(seconds % 10), ctx);
```

## 更新数字

怎么样在屏幕上显示出时间在动的效果呢？

1. 在屏幕上显示倒计时，获取下一次的时间`nextShowTimeSeconds`
2. 比较当前的时间和下一次时间是否相同（只需比较 秒 即可）
3. 如果`nextSeconds`不等于`curSeconds`，说明时间变化了，需要更新当前时间。

```js
let nextShowTimeSeconds = getCurrentShowTimeSeconds();

  let nextHour = parseInt(nextShowTimeSeconds / 3600);
  let nextMinutes = parseInt((nextShowTimeSeconds - nextHour * 3600) / 60);
  let nextSeconds = nextShowTimeSeconds % 60;

  let curHour = parseInt(curShowTimeSeconds / 3600);
  let curMinutes = parseInt((curShowTimeSeconds - curHour * 3600) / 60);
  let curSeconds = curShowTimeSeconds % 60;

  if (nextSeconds !== curSeconds) {
    curShowTimeSeconds = nextShowTimeSeconds;
  }
```

## 绘制多彩小球

时间已经动起来了，在时间发生变化的时候，如何让在时间的位置出现多彩小球呢？

在时间放生变化的时候，让多彩小球出现在页面中。

这里就需要对每个时间都进行判断，在时间发生变化的时候，调用`addBall`函数

```js
if (parseInt(curHour / 10) !== parseInt(nextHour / 10)) {
  addBall(marginLeft, marginTop, parseInt(curHour / 10));
}
if (parseInt(curHour % 10) !== parseInt(nextHour % 10)) {
  addBall(marginLeft + 15 * (radius + 1), marginTop, parseInt(curHour % 10));
}
if (parseInt(curMinutes / 10) !== parseInt(nextMinutes / 10)) {
  addBall(marginLeft + 39 * (radius + 1), marginTop, parseInt(curMinutes / 10));
}
if (parseInt(curMinutes % 10) !== parseInt(nextMinutes % 10)) {
  addBall(marginLeft + 54 * (radius + 1), marginTop,parseInt(curMinutes % 10));
}
if (parseInt(curSeconds / 10) !== parseInt(nextSeconds / 10)) {
  addBall(marginLeft + 78 * (radius + 1), marginTop, parseInt(curSeconds / 10));
}
if (parseInt(curSeconds % 10) !== parseInt(nextSeconds % 10)) {
  addBall(marginLeft + 93 * (radius + 1), marginTop, parseInt(curSeconds % 10));
}
```

### `addBall`

`addBall`函数是对小球在指定位置进行渲染

`addBall`函数接收三个参数，小球的`x`坐标，`y`坐标以及数字。

在此遍历所有数字，小球如果是`1`就需要再该位置绘制，并添加小球`balls`里。

```js
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
```

`aball`是要绘制在屏幕的小球，它接收`7`个参数：

* `x`: `x`坐标
* `y`: `Y`坐标
* `r`: 半径
* `g`: 加速度
* `vx`: `x`轴速度
* `vy`: `y`轴速度
* `color`: 颜色

这里重点说下`g`，`vx`，`vy`这三个属性的作用，这里用到的其实是初中物理知识——速度和加速度。

```js
ball = {x:512, y:100, r:20, g:1.5, vx:-4, vy:0, color:'#058'}
```

## 更新小球

小球绘制完之后，需要让小球有个落地的效果

对小球的数组`balls`进行比遍历，让每个小球的`x`，`y`坐标分别加上在自己轴上的运动速度，`y`轴速度`vy`要加上小球的加速度。这样就有一个小球落地的效果了。

```js
balls.forEach(ball => {
  ball.x += ball.vx;
  ball.y += ball.vy;
  ball.vy += ball.g;
});
```

## 落地检测

还是在`balls`遍历的数组里面。

如何知道小球有没落地呢？

检测小球的`y`轴坐标，如果小球`y`轴坐标大于等于 屏幕的高度减去小球半径，就说明小球已经触底了。需要有一个回弹的效果。

回弹的时候受空气阻力的影响有的阻力系数。

更新小球的`y`坐标和`y`轴的速度，小球就会有一个回弹的效果。

```js
if (ball.y >= windowHeight - radius) {
  ball.y = windowHeight - radius;
  ball.vy = -ball.vy * 0.6;
}
```

这个程序行运行一段时间后，会发现特别卡顿。这是因为我们一直在添加小球，而没有删除小球，

```js
console.log(balls.length)
```

在更新小球的时候，打印`balls`的长度，就会发现一直在不断的增加，不管你电脑内存有多大，最后都会被占用光，所以必须得对`balls`数组的长度进行限制。

## 优化

这里的优化技巧就是，检测小球是否在屏幕内，如果不在屏幕内，就将它删除。

```js
let cnt = 0;
balls.forEach(ball => {
  if (ball.x + radius > 0 && ball.x - radius < windowWidth) {
    balls[cnt++] = ball;
  }
});
```
如何检测小球是否在屏幕内进行检测呢？

还是使用上面检测落地的方法。

小球的`x`坐标 `+` 小球的半径 `>` `0` 并且 小球的`x`坐标 - 小球的半径 `<` 画布半径，说明小球在画布里面。

使用`cnt`进行计数，将符合要求（在屏幕内）的小球，放到`balls`的前面

那么前`cnt`个小球都是也画布中的，只需要将`cnt`后的小球进行删除就行了。

```js
while (balls.length > Math.min(300, cnt)) {
  balls.pop();
}
```

`Math.min(300, cnt))`的意思是，如果`cnt > 300`，取`300`，否则取`cnt`。

它的作用是控制屏幕中效果的个数。

## 总结

做这个动画的最大收获是:

1. 使用点阵系统绘制数字
2. 小球落地是一个简单的初衷物理知识
3. 小球落地检测方法
