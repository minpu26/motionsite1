(() => {
  'use strict';
  const GRID = 5;
  const TOTAL = GRID * GRID;
  const canvas = document.getElementById('mascotCanvas');
  const context = canvas.getContext('2d', { alpha: true, desynchronized: true });
  const counter = document.getElementById('frameCounter');
  const coords = document.getElementById('trackingCoords');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const images = Array.from({ length: TOTAL }, () => null);
  let loaded = 0;
  let centerFrame = null;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let isManual = false;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let lastTime = 0;
  let lastCoordsTime = 0;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasWidth = rect.width;
    canvasHeight = rect.height;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
  }

  const preload = (row, col) => {
    const index = row * GRID + col;
    const image = new Image();
    image.decoding = 'async';
    image.src = `assets/poses/pose-${row}-${col}.webp`;
    image.onload = () => {
      images[index] = image;
      if (row === 2 && col === 2) centerFrame = image;
      loaded++;
      counter.textContent = `${String(loaded).padStart(2,'0')} / ${TOTAL} FRAMES READY`;
    };
    image.onerror = () => {
      console.warn(`Could not load pose: ${row},${col}`);
      counter.textContent = `FRAMES ${loaded} / ${TOTAL}`;
    };
  };
  preload(2, 2);
  for(let row = 0; row < GRID; row++) {
    for(let col = 0; col < GRID; col++) {
      if(row !== 2 || col !== 2) preload(row, col);
    }
  }

  function onPointerMove(event) {
    if (reducedMotion.matches) return;
    if (event.pointerType === 'touch' && event.buttons === 0) return;
    isManual = false;
    const screenW = Math.max(1, window.innerWidth);
    const screenH = Math.max(1, window.innerHeight);
    targetX = Math.max(-1, Math.min(1, 2 * event.clientX / screenW - 1));
    targetY = Math.max(-1, Math.min(1, 2 * event.clientY / screenH - 1));
    updateDirectionButtons();
  }
  window.addEventListener('pointermove', onPointerMove, {passive:true});
  document.addEventListener('pointerout', (e) => {
    if(!isManual && !e.relatedTarget) {targetX=0;targetY=0;}
  });
  window.addEventListener('blur', () => { if(!isManual) {targetX=0;targetY=0;} });

  function draw(now) {
    const seconds = Math.min(0.06, (now - (lastTime || now)) / 1000);
    lastTime = now;
    const follow = reducedMotion.matches ? 1 : 1 - Math.exp(-9 * seconds);
    if (reducedMotion.matches) {
      currentX = 0;
      currentY = 0;
    } else {
      currentX += (targetX - currentX) * follow;
      currentY += (targetY - currentY) * follow;
    }
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    if(centerFrame) {
      const gx = Math.max(0,Math.min(GRID-1, (currentX + 1)*(GRID-1)/2));
      const gy = Math.max(0,Math.min(GRID-1, (currentY + 1)*(GRID-1)/2));
      const x0 = Math.floor(gx), y0 = Math.floor(gy);
      const x1 = Math.min(GRID-1,x0+1), y1 = Math.min(GRID-1,y0+1);
      const wx = gx-x0, wy=gy-y0;
      const aspect = centerFrame.naturalWidth / centerFrame.naturalHeight;
      const width = Math.min(canvasWidth * .9, canvasHeight * aspect * .98);
      const height = width / aspect;
      const left = (canvasWidth - width) * .54;
      const top = canvasHeight - height + 35;
      const poses = [
        [x0, y0, (1-wx)*(1-wy)], [x1,y0,wx*(1-wy)],
        [x0,y1,(1-wx)*wy], [x1,y1,wx*wy]
      ];
      // Alpha-weighted bilinear frame blending; no CSS mascot transforms.
      for(const [x,y,weight] of poses) {
        if(weight <= 0.001) continue;
        const image = images[y*GRID+x] || centerFrame;
        context.globalAlpha = weight;
        context.drawImage(image,left,top,width,height);
      }
      context.globalAlpha=1;
    }
    if(now-lastCoordsTime>100) {
      coords.textContent = `X ${currentX.toFixed(2)} / Y ${currentY.toFixed(2)}`;
      lastCoordsTime=now;
    }
    requestAnimationFrame(draw);
  }
  new ResizeObserver(resizeCanvas).observe(canvas);
  resizeCanvas();
  requestAnimationFrame(draw);

  const directions = [
    ['↖',-1,-1],['↑',0,-1],['↗',1,-1],
    ['←',-1,0],['•',0,0],['→',1,0],
    ['↙',-1,1],['↓',0,1],['↘',1,1]
  ];
  const grid = document.getElementById('directionGrid');
  directions.forEach(([symbol,x,y],index) => {
    const button=document.createElement('button');
    button.type='button';
    button.textContent=symbol;
    button.setAttribute('aria-label',`Look ${index === 4 ? 'forward' : symbol}`);
    button.setAttribute('aria-pressed',index===4 ? 'true':'false');
    button.dataset.index=index;
    button.addEventListener('click',()=>{
      targetX=x;targetY=y;isManual=true;updateDirectionButtons();
      document.getElementById('experience').scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth'});
    });
    grid.appendChild(button);
  });
  function updateDirectionButtons(){
    const nearestX=Math.round(targetX), nearestY=Math.round(targetY);
    grid.querySelectorAll('button').forEach((button)=>{
      const [,x,y]=directions[Number(button.dataset.index)];
      button.setAttribute('aria-pressed',String(x===nearestX && y===nearestY));
    });
  }
  document.getElementById('resetPose').addEventListener('click',()=>{targetX=0;targetY=0;isManual=true;updateDirectionButtons();});

  const translations={
    ja:{
      navAbout:'ABOUT',navExperience:'EXPERIENCE',navTech:'HOW IT WORKS',statusOnline:'INTERACTIVE / ONLINE',
      eyebrow:'小さな目が、あなたを見ている。',heroLine1:'その動き、',heroLine2:'見てます。',
      heroDescription:'カーソルを動かすと、小さな視線が追いかける。<br>どこへ動いても、ちゃんと見ているよ。',
      cta:'目を合わせる',ctaHelp:'MOVE AROUND TO MEET<br> YOUR NEW LITTLE FRIEND.',
      tracking:'EYES ON YOU',scroll:'SCROLL TO DISCOVER',aboutTitle:'見つめ返す、<br>ちいさな世界。',
      aboutBody:'画面の向こうに、あなたの動きに気づく小さな友達がいます。これは動画をスキップする仕組みではなく、事前に用意された画像をCanvas上で滑らかに切り替えるインタラクティブな体験です。',
      techTitle:'Not a video.<br><em>A little bit of magic.</em>',techDescription:'The animation uses preloaded image poses, pointer coordinates, and smooth crossfading on Canvas. Nothing is scrubbed in real time.',
      stepOne:'Load 25 WebP frames once. Cache them in memory.',stepTwo:'Translate the cursor’s position into a direction.',stepThree:'Interpolate frames with requestAnimationFrame.',
      directionsLabel:'Or tap a direction to see a different pose.',reset:'RESET ↗',backTop:'BACK TO TOP ↑'
    },
    en:{
      navAbout:'ABOUT',navExperience:'EXPERIENCE',navTech:'HOW IT WORKS',statusOnline:'INTERACTIVE / ONLINE',
      eyebrow:'A LITTLE SOMEONE IS WATCHING.',heroLine1:'Every move,',heroLine2:'I see it.',
      heroDescription:'Move your cursor around the screen.<br>Those little eyes will find you anywhere.',
      cta:'MEET MANUL',ctaHelp:'MOVE AROUND TO MEET<br> YOUR NEW LITTLE FRIEND.',
      tracking:'EYES ON YOU',scroll:'SCROLL TO DISCOVER',aboutTitle:'A tiny world<br>looking back.',
      aboutBody:'There’s a tiny friend on the other side of your screen, noticing your every move. This experience does not scrub a video: it switches between preloaded images on Canvas and blends the transitions smoothly.',
      techTitle:'Not a video.<br><em>A little bit of magic.</em>',techDescription:'The animation uses preloaded image poses, pointer coordinates, and smooth crossfading on Canvas. Nothing is scrubbed in real time.',
      stepOne:'Load 25 WebP frames once. Cache them in memory.',stepTwo:'Translate the cursor’s position into a direction.',stepThree:'Interpolate frames with requestAnimationFrame.',
      directionsLabel:'Or tap a direction to see a different pose.',reset:'RESET ↗',backTop:'BACK TO TOP ↑'
    }
  };
  const langButton=document.getElementById('langButton');
  let lang='ja';
  langButton.addEventListener('click',()=>{
    lang=lang==='ja'?'en':'ja';
    document.documentElement.lang=lang;
    for(const item of document.querySelectorAll('[data-i18n]')) {
      item.innerHTML=translations[lang][item.dataset.i18n];
    }
    langButton.innerHTML=(lang==='ja'?'EN':'JP')+' <span class="tiny-arrow">↗</span>';
    langButton.setAttribute('aria-pressed',String(lang==='en'));
  });

  const menuButton=document.getElementById('menuButton');
  const mobileNav=document.getElementById('mobileNav');
  menuButton.addEventListener('click',()=>{
    const open=mobileNav.hasAttribute('hidden');
    mobileNav.toggleAttribute('hidden',!open);
    menuButton.setAttribute('aria-expanded',String(open));
    menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');
  });
  mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    mobileNav.setAttribute('hidden','');
    menuButton.setAttribute('aria-expanded','false');
    menuButton.setAttribute('aria-label','Open menu');
  }));
})();
