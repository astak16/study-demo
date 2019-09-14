let canvas = document.getElementById("canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

let ctx = canvas.getContext("2d");
let painting = false;
let firstClick = {};
const wrapper = document.querySelector(".wrapper");

let equipment = /Android|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
if(equipment){
  document.addEventListener("touchmove", e => {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  });
}else{
  document.addEventListener("mousedown", e => {
    painting = true;
    firstClick.x = e.clientX;
    firstClick.y = e.clientY;
    ctx.beginPath();
    ctx.arc(firstClick.x, firstClick.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  document.addEventListener("mouseup", e => {
    painting = false;
  });

  document.addEventListener("mousemove", e => {
    if (!painting) return;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 10;
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(firstClick.x, firstClick.y); //设置起点
    ctx.lineTo(e.clientX, e.clientY); //画线
    ctx.closePath();
    ctx.stroke();
    firstClick.x = e.clientX;
    firstClick.y = e.clientY;
  });


}