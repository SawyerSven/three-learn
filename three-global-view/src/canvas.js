import * as THREE from 'three';

let lat = 0;
let lng = 0;
const width = window.innerWidth;
const height = window.innerHeight;
const radius = 50; // 球体半径
export const init = () => {
  // 第一步：创建场景
  const scene = new THREE.Scene();

  // 第二步：绘制一个球体
  const geometry = new THREE.SphereBufferGeometry(radius, 32, 32);

  geometry.scale(-1, 1, 1); // 球面反转，由外表面改成内表面贴图

  const material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('./src/assets/background.jpg') // 上面的全景图片
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 第三步：创建相机，并确定相机位置
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
  camera.position.x = 0; // 确定相机位置移到球心
  camera.position.y = 0;
  camera.position.z = 0;

  camera.target = new THREE.Vector3(radius, 0, 0); // 设置一个对焦点
  // 第四步：拍照并绘制到canvas
  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height); // 设置照片大小

  document.querySelector('#app').appendChild(renderer.domElement); // 绘制到canvas
  renderer.render(scene, camera);

  function render() {
    // lng += 0.003;
    camera.target.x = radius * Math.cos(lat) * Math.cos(lng);
    camera.target.y = radius * Math.sin(lat);
    camera.target.z = radius * Math.cos(lat) * Math.sin(lng);
    camera.lookAt(camera.target); // 对焦
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();
};

export const touchListenner = () => {
  let lastX, lastY; // 上次touch的屏幕位置
  let startX, startY; // 开始touch的位置，用于计算速度
  let curX, curY; // 当前屏幕位置
  let speedX, speedY; // 速度
  let isMoving = false; // 是否正在单指操作
  let startTime;

  const factor = 1 / 10; // 灵敏系数
  const deceleration = 0.1; // 减速度，惯性动画使用
  const $wrap = document.querySelector('#app');

  // touch start
  $wrap.addEventListener('touchstart', function (evt) {
    const evtObj = evt.targetTouches[0];
    startX = lastX = evtObj.clientX;
    startY = lastY = evtObj.clientY;
    startTime = Date.now();
    isMoving = true;
  });

  // touching

  $wrap.addEventListener('touchmove', function (evt) {
    evt.preventDefault();
    const obj = evt.targetTouches[0];
    curX = obj.clientX;
    curY = obj.clientY;

    // 参考:弧长公式
    lng -= ((curX - lastX) / radius) * factor; //factor为了全景旋转平稳，乘以一个灵敏系数
    lat += ((curY - lastY) / radius) * factor;

    lastX = curX;
    lastY = curY;
  });

  $wrap.addEventListener('touchend', function (evt) {
    isMoving = false;
    const t = Date.now() - startTime;

    speedX = (curX - startX) / t;
    speedY = (curY - startY) / t;
    subSpeedAnimate(); // 惯性动画
  });

  function subSpeedAnimate() {
    console.log(123);
    lng -= speedX * factor;
    lat -= speedY * factor;
    speedX = subSpeed(speedX);
    speedY = subSpeed(speedY);
    if((speedX !== 0 || speedY !== 0) && !isMoving){
      requestAnimationFrame(subSpeedAnimate);
    }
  }

  // 减速度
  function subSpeed(speed) {
    if (speed !== 0) {
      if (speed > 0) {
        speed -= deceleration;
        speed < 0 && (speed = 0);
      } else {
        speed += deceleration;
        speed > 0 && (speed = 0);
      }
    }
    return speed;
  }
};
