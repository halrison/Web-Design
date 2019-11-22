document.body.onload=function() {
    var canvas = document.getElementsByTagName('canvas')[0], context = canvas.getContext('2d');
    context.fillStyle = "white";
    context.font="52px 標楷體";
    context.shadowColor= "#333333";
    context.shadowBlur= 15;
    context.shadowOffsetX=10;
    context.shadowOffsetY = 10;
    context.textBaseline = 'center';
    context.fillText("運動廣場連結網",canvas.width/4,canvas.height*2/3,364);
};