class f{constructor(){this.container=document.getElementById("vinyl-particles"),this.vinyls=[],this.mouse={x:0,y:0,isMoving:!1},this.animationId=null,this.isVisible=!0,this.lastCollisionCheck=0,this.config={count:6,maxCount:6,maxSize:80,minSize:40,speed:{min:.05,max:.3},rotationSpeed:{min:.2,max:.8},interactionRadius:120,fleeRadius:100,fleeSpeed:3,collisionRadius:30,interaction:{enabled:!0,flee:!0}},this.init()}init(){if(!this.container)return;const i=window.location.pathname;if(["/noticias/","/programas/","/vinilos/"].some(s=>i.includes(s)&&i!==s&&i.split("/").length>2)){console.log("🚫 VinylParticles desactivado en página individual:",i),this.container.style.display="none";return}this.createVinyls(),this.bindEvents(),this.animate(),this.setupCollisionDetection(),console.log("🎵 VinylParticles minimalista iniciado con",this.config.count,"vinilos")}createVinyls(){this.container.innerHTML="",this.vinyls=[];for(let i=0;i<this.config.count;i++)this.createVinyl()}createVinyl(i=null,e=null,t=null){if(this.vinyls.length>=this.config.maxCount)return null;const s=document.createElement("div");s.className="vinyl-particle";const n=t||this.random(this.config.minSize,this.config.maxSize),o=this.getRandomColor(),a=60,l=100,r=i!==null?i:this.random(0,window.innerWidth-n),c=e!==null?e:this.random(a,window.innerHeight-l-n),h=this.random(-this.config.speed.max,this.config.speed.max),d=this.random(-this.config.speed.max,this.config.speed.max),m=this.random(this.config.rotationSpeed.min,this.config.rotationSpeed.max);return s.innerHTML=this.getVinylSVG(n,1,o),s.style.cssText=`
      position: fixed;
      left: ${r}px;
      top: ${c}px;
      width: ${n}px;
      height: ${n}px;
      pointer-events: none;
      z-index: -1;
      opacity: 0;
      transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      filter: blur(0.5px);
      transform: scale(0.8);
    `,s.vinylData={x:r,y:c,size:n,velocityX:h,velocityY:d,rotationSpeed:m,rotation:0,originalVelocityX:h,originalVelocityY:d,isFleeing:!1,fleeStartTime:0,id:Date.now()+Math.random()},this.container.appendChild(s),this.vinyls.push(s),setTimeout(()=>{s.style.opacity="0.2",s.style.transform="scale(1)"},100+this.vinyls.length*200),s}getVinylSVG(i,e,t){const s=i*.3,n=Math.floor(i/20);let o="";for(let r=1;r<=n;r++){const c=i*.4-r*4;o+=`<circle cx="50%" cy="50%" r="${c}" fill="none" stroke="rgba(0,0,0,0.05)" stroke-width="0.3"/>`}const a=`vinylGradient${Date.now()}_${Math.random()}`,l=`glow${Date.now()}_${Math.random()}`;return`
      <svg width="100%" height="100%" viewBox="0 0 ${i} ${i}" class="vinyl-svg">
        <defs>
          <radialGradient id="${a}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:${t};stop-opacity:0.6"/>
            <stop offset="30%" style="stop-color:${t};stop-opacity:0.4"/>
            <stop offset="70%" style="stop-color:${this.darkenColor(t,.3)};stop-opacity:0.5"/>
            <stop offset="100%" style="stop-color:${this.darkenColor(t,.5)};stop-opacity:0.6"/>
          </radialGradient>
          <filter id="${l}">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Disco principal -->
        <circle cx="50%" cy="50%" r="${i*.45}" 
                fill="url(#${a})" 
                filter="url(#${l})"
                class="vinyl-disc"/>
        
        <!-- Surcos más sutiles -->
        ${o}
        
        <!-- Centro del vinilo -->
        <circle cx="50%" cy="50%" r="${s*.5}" 
                fill="rgba(0,0,0,0.4)" 
                class="vinyl-center"/>
        
        <!-- Etiqueta central -->
        <circle cx="50%" cy="50%" r="${s*.3}" 
                fill="${t}" 
                opacity="0.3"/>
        
        <!-- Agujero central -->
        <circle cx="50%" cy="50%" r="${s*.1}" 
                fill="rgba(0,0,0,0.6)"/>
        
        <!-- Reflejo sutil -->
        <ellipse cx="40%" cy="30%" rx="${i*.1}" ry="${i*.06}" 
                 fill="rgba(255,255,255,0.05)" 
                 class="vinyl-reflection"/>
      </svg>
    `}getRandomColor(){if(document.documentElement.getAttribute("data-theme")==="day"){const e=["#c5ad7b","#8B7355","#5D7B9D","#A0522D","#708090"];return e[Math.floor(Math.random()*e.length)]}else{const e=["#c5ad7b","#ff8a80","#80cbc4","#a5d6a7","#ffcc80","#ce93d8"];return e[Math.floor(Math.random()*e.length)]}}darkenColor(i,e){const t=i.replace("#",""),s=Math.max(0,parseInt(t.substr(0,2),16)*(1-e)),n=Math.max(0,parseInt(t.substr(2,2),16)*(1-e)),o=Math.max(0,parseInt(t.substr(4,2),16)*(1-e));return`rgb(${Math.floor(s)}, ${Math.floor(n)}, ${Math.floor(o)})`}bindEvents(){document.addEventListener("mousemove",e=>{this.mouse.x=e.clientX,this.mouse.y=e.clientY,this.mouse.isMoving=!0,clearTimeout(this.mouseTimeout),this.mouseTimeout=setTimeout(()=>{this.mouse.isMoving=!1},200)}),document.addEventListener("click",e=>{this.mouse.x=e.clientX,this.mouse.y=e.clientY,this.triggerFlee()}),document.addEventListener("touchstart",e=>{e.touches.length>0&&(this.mouse.x=e.touches[0].clientX,this.mouse.y=e.touches[0].clientY,this.triggerFlee())}),window.addEventListener("resize",()=>{this.handleResize()}),new MutationObserver(e=>{e.forEach(t=>{t.attributeName==="data-theme"&&this.updateColorsForTheme()})}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),document.addEventListener("visibilitychange",()=>{this.isVisible=!document.hidden,this.isVisible?this.animate():cancelAnimationFrame(this.animationId)})}handleResize(){this.vinyls.forEach(t=>{const s=t.vinylData;s.x>window.innerWidth-s.size&&(s.x=window.innerWidth-s.size,t.style.left=s.x+"px"),s.y>window.innerHeight-100-s.size&&(s.y=window.innerHeight-100-s.size,t.style.top=s.y+"px"),s.y<60&&(s.y=60,t.style.top=s.y+"px")})}updateColorsForTheme(){this.vinyls.forEach(i=>{const e=i.vinylData,t=this.getRandomColor();i.style.transition="all 1s ease",setTimeout(()=>{i.innerHTML=this.getVinylSVG(e.size,1,t)},Math.random()*500)})}setupCollisionDetection(){this.lastCollisionCheck=0}checkCollisions(){const i=Date.now();if(!(i-this.lastCollisionCheck<100)){this.lastCollisionCheck=i;for(let e=0;e<this.vinyls.length;e++)for(let t=e+1;t<this.vinyls.length;t++){const s=this.vinyls[e],n=this.vinyls[t],o=s.vinylData,a=n.vinylData,l=o.x+o.size/2-(a.x+a.size/2),r=o.y+o.size/2-(a.y+a.size/2);if(Math.sqrt(l*l+r*r)<this.config.collisionRadius){this.explodeVinyls(s,n,e,t);return}}}}explodeVinyls(i,e,t,s){if(this.vinyls.length>=this.config.maxCount)return;console.log("💥 ¡Explosión de vinilos!");const n=i.vinylData,o=e.vinylData;this.createExplosionEffect(n.x+n.size/2,n.y+n.size/2),this.removeVinyl(t),this.removeVinyl(s>t?s-1:s);const a=Math.max(this.config.minSize,n.size*.7),l=Math.max(this.config.minSize,o.size*.7);setTimeout(()=>{this.vinyls.length<this.config.maxCount&&this.createVinyl(n.x,n.y,a),this.vinyls.length<this.config.maxCount&&this.createVinyl(o.x,o.y,l)},300)}createExplosionEffect(i,e){const t=document.createElement("div");t.className="vinyl-explosion",t.style.cssText=`
      position: fixed;
      left: ${i-30}px;
      top: ${e-30}px;
      width: 60px;
      height: 60px;
      background: radial-gradient(circle, 
        var(--color-accent) 0%, 
        rgba(255, 107, 107, 0.6) 50%,
        transparent 70%);
      border-radius: 50%;
      transform: scale(0);
      opacity: 1;
      z-index: 5;
      pointer-events: none;
      animation: explode 0.6s ease-out forwards;
    `,this.container.appendChild(t);for(let s=0;s<3;s++)setTimeout(()=>{this.createSparkle(i,e)},s*100);setTimeout(()=>{t.parentNode&&t.remove()},600)}createSparkle(i,e){const t=document.createElement("div"),s=Math.random()*Math.PI*2,n=20+Math.random()*40,o=i+Math.cos(s)*n,a=e+Math.sin(s)*n;t.style.cssText=`
      position: fixed;
      left: ${i}px;
      top: ${e}px;
      width: 4px;
      height: 4px;
      background: var(--color-accent);
      border-radius: 50%;
      opacity: 1;
      z-index: 4;
      pointer-events: none;
      transition: all 0.8s ease-out;
    `,this.container.appendChild(t),setTimeout(()=>{t.style.left=o+"px",t.style.top=a+"px",t.style.opacity="0",t.style.transform="scale(0)"},50),setTimeout(()=>{t.parentNode&&t.remove()},800)}removeVinyl(i){if(i>=0&&i<this.vinyls.length){const e=this.vinyls[i];e.style.transition="all 0.3s ease-out",e.style.transform="scale(0) rotate(180deg)",e.style.opacity="0",setTimeout(()=>{e.parentNode&&e.parentNode.removeChild(e)},300),this.vinyls.splice(i,1)}}triggerFlee(){this.vinyls.forEach(i=>{const e=i.vinylData,t=this.mouse.x-(e.x+e.size/2),s=this.mouse.y-(e.y+e.size/2);if(Math.sqrt(t*t+s*s)<this.config.fleeRadius*2){const o=Math.atan2(s,t);e.velocityX-=Math.cos(o)*this.config.fleeSpeed*1.5,e.velocityY-=Math.sin(o)*this.config.fleeSpeed*1.5,e.isFleeing=!0,e.fleeStartTime=Date.now(),i.style.filter="blur(2px) brightness(2)",i.style.opacity="0.3",i.style.transform=`scale(1.2) rotate(${e.rotation}deg)`}})}animate(){this.isVisible&&(this.vinyls.forEach((i,e)=>{const t=i.vinylData,s=Date.now();if(this.mouse.isMoving&&this.config.interaction.enabled){const l=this.mouse.x-(t.x+t.size/2),r=this.mouse.y-(t.y+t.size/2),c=Math.sqrt(l*l+r*r);if(c<this.config.fleeRadius){const h=Math.atan2(r,l),d=(this.config.fleeRadius-c)/this.config.fleeRadius;t.velocityX-=Math.cos(h)*this.config.fleeSpeed*d,t.velocityY-=Math.sin(h)*this.config.fleeSpeed*d,t.isFleeing=!0,t.fleeStartTime=s,i.style.filter="blur(1px) brightness(1.5)",i.style.opacity="0.2"}}t.isFleeing&&s-t.fleeStartTime>2e3&&(t.isFleeing=!1,i.style.filter="blur(0.5px)",i.style.opacity="0.2",i.style.transform=`scale(1) rotate(${t.rotation}deg)`),t.isFleeing||(t.velocityX+=(t.originalVelocityX-t.velocityX)*.01,t.velocityY+=(t.originalVelocityY-t.velocityY)*.01);const n=t.isFleeing?this.config.fleeSpeed:this.config.speed.max;t.velocityX=Math.max(-n,Math.min(n,t.velocityX)),t.velocityY=Math.max(-n,Math.min(n,t.velocityY)),t.x+=t.velocityX,t.y+=t.velocityY;const o=60,a=100;(t.x<=0||t.x>=window.innerWidth-t.size)&&(t.velocityX*=-.7,t.originalVelocityX*=-1,t.x=Math.max(0,Math.min(window.innerWidth-t.size,t.x))),(t.y<=o||t.y>=window.innerHeight-a-t.size)&&(t.velocityY*=-.7,t.originalVelocityY*=-1,t.y=Math.max(o,Math.min(window.innerHeight-a-t.size,t.y))),t.rotation+=t.rotationSpeed,i.style.left=t.x+"px",i.style.top=t.y+"px",t.isFleeing||(i.style.transform=`rotate(${t.rotation}deg)`)}),this.checkCollisions(),this.animationId=requestAnimationFrame(()=>this.animate()))}random(i,e){return Math.random()*(e-i)+i}pause(){cancelAnimationFrame(this.animationId)}resume(){this.isVisible&&this.animate()}destroy(){cancelAnimationFrame(this.animationId),this.container.innerHTML="",this.vinyls=[]}}document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{window.vinylParticles=new f},500)});
