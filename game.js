'use strict';
(()=>{
  const $=id=>document.getElementById(id);
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=n=>Math.round(Number(n)||0).toLocaleString('vi-VN');
  const clone=x=>JSON.parse(JSON.stringify(x));
  const rand=a=>a[Math.floor(Math.random()*a.length)];
  const shuffle=a=>{const b=a.slice();for(let i=b.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
  const STORAGE='thu-vien-may-nho-chuyen-dong-v2';
  // Hoạt cảnh: nhân vật tự do đi lại và khách đi tới khu vực của mình.
  const WALK_STOPS={reading:{x:116,y:123},cafe:{x:375,y:119},counter:{x:114,y:238},warehouse:{x:373,y:239}};
  const PLAYER_START={x:234,y:260};
  const actor={x:PLAYER_START.x,y:PLAYER_START.y,dest:null,zone:null,guestId:null,keys:new Set(),facing:'down',steps:0};
  const guestSprites=new Map();
  let motionLast=0,motionTime=0;
  function resetMovement(){actor.x=PLAYER_START.x;actor.y=PLAYER_START.y;actor.dest=null;actor.zone=null;actor.guestId=null;actor.keys.clear();guestSprites.clear();}
  function walkToZone(zone,guestId=null){
    if(!s||!WALK_STOPS[zone])return;
    if(s.mode!=='open'){toast('Thư viện chưa mở','Bé hãy mở cửa để đi phục vụ khách.');return;}
    if(ui.active&&!ui.feedback){toast('Đang trò chuyện','Hãy trả lời hoặc chọn Đổi khách trước nhé.');return;}
    actor.dest={...WALK_STOPS[zone]};actor.zone=zone;actor.guestId=guestId;
    const ribbon=$('sceneRibbon');if(ribbon)ribbon.textContent=`🚶 Bé đang đi đến ${ZONES[zone].short}…`;
  }
  function arrivedAtZone(){
    if(!actor.zone)return;
    const zone=actor.zone,guestId=actor.guestId;actor.dest=null;actor.zone=null;actor.guestId=null;
    if(ui.zone!==zone || !ui.active)enterZone(zone);
    const next=pending(zone).find(v=>v.id===guestId)||pending(zone)[0];
    if(next&&s.mode==='open'){serve(next.id);audioBeep('arrive');if(window.innerWidth<=680){$('visitorPanel').scrollIntoView({behavior:'smooth',block:'start'});}} 
    const ribbon=$('sceneRibbon');if(ribbon)ribbon.textContent='💬 Đã đến nơi! Trò chuyện bên phải hoặc chọn một khách khác.';
  }
  function stepActor(dt){
    if(!s||s.mode!=='open'||$('appContent').classList.contains('is-hidden')||ui.modal)return;
    let dx=Number(actor.keys.has('d')||actor.keys.has('arrowright'))-Number(actor.keys.has('a')||actor.keys.has('arrowleft'));
    let dy=Number(actor.keys.has('s')||actor.keys.has('arrowdown'))-Number(actor.keys.has('w')||actor.keys.has('arrowup'));
    let keysMoving=(dx!==0||dy!==0);
    if(keysMoving){actor.dest=null;actor.zone=null;actor.guestId=null;}
    else if(actor.dest){dx=actor.dest.x-actor.x;dy=actor.dest.y-actor.y;}
    const magnitude=Math.hypot(dx,dy);
    if(magnitude>0){
      let travel=Math.min(magnitude,94*dt);
      actor.x=Math.max(19,Math.min(461,actor.x+dx/magnitude*travel));
      actor.y=Math.max(52,Math.min(264,actor.y+dy/magnitude*travel));
      actor.steps+=dt*12;
      if(Math.abs(dx)>Math.abs(dy))actor.facing=dx>0?'right':'left';else actor.facing=dy>0?'down':'up';
    }
    if(actor.dest&&Math.hypot(actor.dest.x-actor.x,actor.dest.y-actor.y)<=3)arrivedAtZone();
  }
  function nearestZone(){
    return Object.entries(WALK_STOPS).sort((a,b)=>Math.hypot(actor.x-a[1].x,actor.y-a[1].y)-Math.hypot(actor.x-b[1].x,actor.y-b[1].y))[0];
  }
  function interactNearby(){
    if(!s||s.mode!=='open')return;
    let [zone,pos]=nearestZone();
    if(Math.hypot(actor.x-pos.x,actor.y-pos.y)>65){toast('Đi gần khách hơn nhé','Dùng phím mũi tên, WASD hoặc chạm vào khu vực để đi lại.');return;}
    if(ui.zone!==zone)enterZone(zone);
    const next=pending(zone)[0];if(next)serve(next.id);else toast('Chưa có khách','Khu này đã phục vụ hết khách trong hôm nay.');
  }
  function drawLibrarian(){
    const x=Math.round(actor.x),y=Math.round(actor.y);
    const bob=Math.sin(actor.steps*1.5)*1.7;
    rect(x-13,y+18,29,5,'#664a4380');
    rect(x-8,y+9+bob,7,12,'#664f74');rect(x+3,y+9-bob,7,12,'#664f74');
    rect(x-12,y-2,26,17,'#dfac71');rect(x-9,y+2,20,12,'#f6d89e');
    rect(x-9,y-12,19,16,'#ffd4b0');
    rect(x-11,y-18,24,7,'#55494e');rect(x-11,y-15,5,11,'#55494e');
    rect(x-3,y-5,3,3,'#54464a');rect(x+7,y-5,3,3,'#54464a');
    rect(x-3,y+5,10,4,'#b96f69');
    rect(x+12,y-18,9,11,'#9cbb89');rect(x+13,y-16,7,5,'#e8cda5');
    rect(x-17,y-31,35,10,'#fff6e6');rect(x-15,y-30,31,7,'#795e58');
    label('BE',x,y-24,'#fff3cf',8);
  }
  function drawGuestSprites(dt){
    if(!s||!s.dayData?.visitors)return;
    const byZone={};
    s.dayData.visitors.filter(v=>!v.served).forEach(v=>{(byZone[v.zone]??=[]).push(v);});
    const showing=Object.entries(byZone).flatMap(([zone,vs])=>vs.slice(0,2));
    const visible=new Set(showing.map(v=>v.id));
    showing.forEach((v,i)=>{
      const stop=WALK_STOPS[v.zone];
      const order=byZone[v.zone].findIndex(u=>u.id===v.id);
      const target={x:stop.x+30+order*21,y:stop.y+8+order*12};
      if(!guestSprites.has(v.id))guestSprites.set(v.id,{x:232+(i%3)*6,y:263+i%2*12,target,leaving:false,seed:i});
      const g=guestSprites.get(v.id);g.target=target;
    });
    for(const [id,g] of guestSprites){
      if(!visible.has(id)) {g.leaving=true;g.target={x:234,y:271};}
      if(s.mode==='open'){
        const dx=g.target.x-g.x,dy=g.target.y-g.y,dist=Math.hypot(dx,dy),step=Math.min(dist,40*dt);
        if(dist>0.5){g.x+=dx/dist*step;g.y+=dy/dist*step;}
        if(g.leaving && dist<1) {guestSprites.delete(id);continue;}
      }
      person(g.x,g.y,g.seed+1,motionTime*1000);
      if(!g.leaving&&Math.hypot(g.x-g.target.x,g.y-g.target.y)<9){rect(g.x+13,g.y-39,16,16,'#fff7dd');label('?',g.x+21,g.y-27,'#8f5845',10);}
    }
  }
  const customers=[['Bông','👧'],['Mít','👦'],['Na','👧'],['Gấu','🧒'],['Sóc','👧'],['Tít','👦'],['Cốm','👧'],['Mây','🧒'],['Bắp','👦'],['Nắng','👧'],['Mơ','🧒'],['Hạt Dẻ','👦']];
  const TIER=['Hạt giống','Mầm xanh','Hoa nở','Ngôi sao','Huyền thoại'];
  let s=null, ui={zone:'reading',active:null,pick:null,picks:[],tokens:[],typing:'',feedback:null,modal:null,modalTab:null},audioContext=null,melodyTimer=null,frame=0;
  const defaults=(name='Bông',grade=1,music=true,effects=true)=>({name,grade,day:1,cash:250,debt:0,mode:'open',music,effects,sound:true,inventory:clone(ITEMS_DEFAULT),upgrades:{counter:0,cafe:0,reading:0,warehouse:0},stats:{daysWon:0,perfectDays:0,correct:0,reading:0,cafe:0,counter:0,warehouse:0,restocks:0,upgrades:0},awards:{},totalEarned:0,dayData:null,daySnapshot:null,zone:'reading'});
  function save(){try{localStorage.setItem(STORAGE,JSON.stringify(s));}catch(e){ /* chơi được ngay cả khi không có localStorage */ }}
  function restore(){try{let raw=localStorage.getItem(STORAGE);if(!raw)return null;let data=JSON.parse(raw);return validState(data)?data:null;}catch(e){return null;}}
  function validState(x){return !!(x&&typeof x.name==='string'&&Number.isInteger(x.day)&&x.day>=1&&x.day<=100000&&x.grade>=1&&x.grade<=5&&Array.isArray(x.inventory)&&x.upgrades&&x.stats&&x.awards);}
  function pickQ(zone,grade,used){const possible=bank.filter(q=>q.zone===zone&&q.grade<=grade&&!used.has(q.id));const atGrade=possible.filter(q=>q.grade===grade);return rand((Math.random()<.58&&atGrade.length)?atGrade:possible)||rand(bank.filter(q=>q.zone===zone));}
  function makeVisitors(){const extra=Math.min(6,Math.floor(Object.values(s.upgrades).reduce((a,b)=>a+b,0)/2));const slots=shuffle(['counter','counter','counter','cafe','cafe','cafe','reading','reading','reading','warehouse',...Array.from({length:extra},(_,i)=>['reading','cafe','counter'][i%3])]);const used=new Set();const names=shuffle(customers);
    return slots.map((zone,i)=>{const q=pickQ(zone,s.grade,used);used.add(q.id);let type=zone==='counter'?rand(['Làm thẻ','Nhắc trả sách quá hạn','Thu phí sách thất lạc','Mua đồ lưu niệm','Mua sách','Trả sách']):zone==='cafe'?'Mua đồ ăn / đồ uống':zone==='reading'?rand(['Mượn sách','Trả sách','Đọc sách tại chỗ','Giữ gìn phòng đọc']):'Nhận hàng từ nhà cung cấp';
      const itemCandidates=zone==='cafe'?s.inventory.filter(p=>['Đồ uống','Đồ ăn'].includes(p.category)):zone==='counter'&&type==='Mua đồ lưu niệm'?s.inventory.filter(p=>p.category==='Lưu niệm'):zone==='counter'&&type==='Mua sách'?s.inventory.filter(p=>p.category==='Sách'):[];
      const item=itemCandidates.length?rand(itemCandidates):null;
      return{id:i+1,qid:q.id,zone,name:names[i%names.length][0],avatar:zone==='warehouse'?'🧑‍🌾':names[i%names.length][1],service:type,itemId:item?.id||null,served:false,correct:null,reward:0};
    });
  }
  function initDay(){s.dayData={visitors:makeVisitors(),revenue:0,expenses:[],bad:[],maintenance:0,maintenanceUnpaid:0,complete:false};s.daySnapshot=null; s.daySnapshot=clone({...s,daySnapshot:null});save();}
  function startFresh(name,grade,music,effects){resetMovement();s=defaults(name,grade,music,effects);ui={zone:'reading',active:null,pick:null,picks:[],tokens:[],typing:'',feedback:null,modal:null};initDay();showGame();}
  function showGame(){ui.zone=s.zone||'reading';$('onboarding').classList.add('is-hidden');$('appContent').classList.remove('is-hidden');renderAll();syncAudio();}
  function goalStats(){let v=s.dayData?.visitors||[];const total=v.length||10;return{served:v.filter(x=>x.served).length,stars:v.filter(x=>x.served&&x.correct).length,total,required:Math.ceil(total*.7)};}
  function pending(zone){return(s.dayData?.visitors||[]).filter(v=>!v.served&&v.zone===zone);}
  function getActive(){return s.dayData?.visitors.find(v=>v.id===ui.active)||null;}
  function itemById(id){return s.inventory.find(p=>p.id===id);}
  function rewardFor(v){let base=v.zone==='cafe'?18:v.zone==='reading'?14:v.zone==='warehouse'?16:18;
    if(v.zone==='counter'&&v.service==='Nhắc trả sách quá hạn')base=23;
    if(v.zone==='counter'&&v.service==='Thu phí sách thất lạc')base=30;
    if(v.zone==='counter'&&v.service==='Làm thẻ')base=18;
    if(v.itemId){let product=itemById(v.itemId);if(product&&product.qty>0)base=product.price;}
    return base+3*(s.upgrades[v.zone]||0);
  }
  function renderHUD(){let k=goalStats();$('hudDay').textContent=`📅 Ngày ${s.day}`;$('gradeSelect').value=String(s.grade);$('hudGuests').textContent=`👥 ${k.served}/${k.total}`;$('hudStars').textContent=`⭐ ${k.stars}/${k.total}`;$('dayGoal').textContent=`🎯 Mục tiêu: ${k.required}/${k.total} sao`; $('hudCash').textContent=`🪙 ${fmt(s.cash)}`;$('librarianName').textContent=s.name;$('modeBtn').textContent={open:'🟢 Mở cửa ▾',paused:'⏸️ Tạm dừng ▾',closed:'🔒 Đóng cửa ▾'}[s.mode]||'🟢 Mở cửa ▾';$('soundBtn').textContent=s.sound?'🔊 Bật':'🔇 Tắt';$('sceneOverlay').classList.toggle('is-hidden',s.mode==='open');const low=s.inventory.filter(p=>p.qty<=2);$('stockNotice').innerHTML=low.length?`<br><span class="stock-alert">📦 Nhà cung cấp báo: ${low.length} mặt hàng gần hết! Hãy vào kho để nhập thêm.</span>`:'';}
  function renderZones(){ $('zoneCards').innerHTML=Object.entries(ZONES).map(([id,z])=>{let n=pending(id).length;return`<button class="zone-card ${ui.zone===id?'active':''}" data-zone="${id}"><span class="zone-icon">${z.icon}</span><span class="zone-title">${z.short}</span><span class="zone-count">${n} khách đang chờ</span>${n?`<span class="bubble">${n}</span>`:''}</button>`;}).join(''); }
  function renderVisitor(){const z=ZONES[ui.zone],v=getActive();let html=`<div class="panel-head"><span class="room-tag">${z.icon} ${z.title}</span><span class="pill">Ngày ${s.day} · Lớp ${s.grade}</span></div>`;
    if(v&&(!v.served||ui.feedback)){const q=bank.find(q=>q.id===v.qid);html+=`<h2>Khách cần bạn giúp! 🌷</h2><div class="hint">${esc(v.service)} · ${esc(q.topic)} (lớp ${q.grade})</div><div class="dialogue"><span class="avatar">${v.avatar}</span><div class="speech"><em>${esc(v.name)} · ${esc(q.speaker)}</em>${esc(v.zone==='warehouse'?'Chào thủ thư! Tôi giao hàng cho kho. ':v.zone==='cafe'?'Mình ghé góc cà phê. ':v.zone==='reading'?'Mình đang ở phòng đọc. ':`Mình muốn ${v.service.toLowerCase()}. `)}${esc(q.question)}</div></div>`;
      if(ui.feedback){html+=renderFeedback();}
      else{html+=renderAnswer(q);html+=`<div class="task-action"><button class="ghost" id="backVisitors">← Đổi khách</button><button class="primary" id="submitAnswer" ${s.mode!=='open'?'disabled':''}>Gửi lời đáp ✓</button></div>`;}
    }else{const pendingVisitors=pending(ui.zone);html+=`<h2>${pendingVisitors.length?'Có khách đang chờ!':'Góc này đã xong rồi 🌼'}</h2><p class="hint">${esc(z.desc)}. Tất cả câu hỏi ở đây đều thuộc chủ đề của khu vực này.</p>`;
      if(pendingVisitors.length){html+=`<div class="waiting"><div class="waiting-title">👥 DANH SÁCH KHÁCH · ${pendingVisitors.length} người</div>${pendingVisitors.map(v=>`<div class="visitor-line"><span class="avatar">${v.avatar}</span><div class="vmeta"><strong>${esc(v.name)}</strong><small>${esc(v.service)}</small></div><button class="secondary" data-serve="${v.id}" ${s.mode!=='open'?'disabled':''}>Trò chuyện</button></div>`).join('')}</div>`;}
      else html+='<div class="empty-state">🧸 Khu vực đã phục vụ hết khách hôm nay.<br/>Hãy thử một khu vực khác nhé!</div>';
      if(ui.zone==='warehouse')html+=`<div class="divider"></div><button class="primary" id="inventoryBtn">📦 Xem kho & nhập hàng</button> <button class="ghost" id="upgradeBtn">🛠️ Nâng cấp</button>`;
      if(ui.zone==='counter')html+=`<div class="divider"></div><button class="ghost" id="financeBtn">🧾 Sổ thu chi & phí duy trì</button>`;
      if(ui.zone==='reading')html+=`<div class="divider"></div><span class="hint">🤫 Nói nhỏ – giữ vệ sinh – nâng niu từng trang sách.</span>`;
      if(ui.zone==='cafe')html+=`<div class="divider"></div><button class="ghost" id="cafeStockBtn">🍰 Kiểm tra món còn bán</button>`;
    }
    $('visitorPanel').innerHTML=html;
  }
  function renderAnswer(q){let header=`<div class="question-type">✏️ ${esc(q.topic)} · ${q.grade===1?'Làm quen':`Ôn tập lớp ${q.grade}`}</div>`;
    if(q.type==='mc'||q.type==='multi'){header+=q.type==='multi'?'<p class="choice-caption">Chọn tất cả phương án đúng (có thể chọn nhiều đáp án).</p>':'<p class="choice-caption">Chọn một đáp án đúng.</p>';
      header+=`<div class="answer-grid">${q.options.map((opt,i)=>`<button class="answer-choice ${(q.type==='mc'?ui.pick===i:ui.picks.includes(i))?'selected':''}" data-choice="${i}" ${s.mode!=='open'?'disabled':''}><span class="letter">${String.fromCharCode(65+i)}</span>${esc(opt)}</button>`).join('')}</div>`;
    } else if(q.type==='order'){
      header+='<p class="choice-caption">Chạm từng ô từ để xếp thành câu. Chạm một từ đã chọn để trả lại.</p>';
      header+=`<div class="word-built">${ui.tokens.length?ui.tokens.map((i,j)=>`<button data-remove-token="${j}" ${s.mode!=='open'?'disabled':''}>${esc(q.options[i])}</button>`).join(''):'<span class="hint">Câu trả lời của bé xuất hiện ở đây…</span>'}</div><div class="word-pool" style="margin-top:9px">${(ui.shuffled?.length?ui.shuffled:q.options.map((_,i)=>i)).map(i=>ui.tokens.includes(i)?'':`<button data-token="${i}" ${s.mode!=='open'?'disabled':''}>${esc(q.options[i])}</button>`).join('')}</div>`;
    } else {
      header+=`<div class="choice-caption" style="margin-top:9px">Hãy viết 1–2 câu trọn ý. Chỉ kiểm tra có nội dung và dấu chấm cuối câu (chưa tự nhận xét ý nghĩa bài viết).</div><textarea id="writingInput" class="text-answer" placeholder="Bé viết câu trả lời ở đây…" ${s.mode!=='open'?'disabled':''}>${esc(ui.typing)}</textarea>`;
    }return header;
  }
  function correctText(q){if(q.type==='mc')return String.fromCharCode(65+q.answer)+'. '+q.options[q.answer];if(q.type==='multi')return q.answer.map(i=>String.fromCharCode(65+i)+'. '+q.options[i]).join(' · ');if(q.type==='order')return q.answer;return q.answer;}
  function renderFeedback(){const f=ui.feedback;return`<div class="feedback ${f.ok?'':'bad'}"><strong>${f.ok?'🌟 Tuyệt lắm! Khách hài lòng!':'🌱 Mình cùng học lại nhé!'}</strong><p>${f.ok?`Bạn nhận ${fmt(f.reward)} xu và 1 sao!`:'Lần này khách chưa hài lòng: mất cơ hội nhận 1 sao, không bị trừ tiền.'}</p><div class="correctline"><b>Đáp án / câu gợi ý:</b> ${esc(f.answer)}<br/><b>Giải thích:</b> ${esc(f.explain)}</div></div><div class="task-action"><button class="primary" id="nextVisitor">${goalStats().served>=goalStats().total?'📋 Xem cuối ngày':'👋 Tiễn khách và tiếp tục'}</button></div>`;}
  function renderMini(){const g=goalStats();const pct=Math.max(0,Math.min(100,g.stars/g.required*100));const awards=Object.keys(s.awards||{}).filter(k=>s.awards[k]>0).length; $('miniPanel').innerHTML=`<h3>🌿 Nhật kí thư viện</h3><div class="mini-stat-grid"><div class="mini-stat"><span class="caption">Khách hài lòng</span><strong>⭐ ${g.stars}/${g.total}</strong></div><div class="mini-stat"><span class="caption">Huy hiệu mở khóa</span><strong>🏆 ${awards}</strong></div></div><p class="hint">Cần ít nhất <b>${g.required} khách hài lòng trong ${g.total} khách</b> để qua ngày (tỉ lệ tối thiểu 70%).</p><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div><div class="divider"></div><p class="hint"><b>Độ khó tích lũy:</b> Lớp ${s.grade} bao gồm kiến thức từ lớp 1 đến lớp ${s.grade}.</p><button class="secondary" id="miniUpgrade">🌷 Trang trí & nâng cấp thư viện</button>`;}
  function renderAll(){if(!s)return;renderHUD();renderZones();renderVisitor();renderMini();}
  function toast(title,msg){const box=document.createElement('div');box.className='toast';box.innerHTML=`<b>${esc(title)}</b>${esc(msg)}`;$('toastRack').appendChild(box);setTimeout(()=>box.remove(),5000);}
  function audioBeep(kind='correct'){if(!s?.sound||!s.effects)return;try{audioContext=audioContext||new(window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();let osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.setValueAtTime(kind==='wrong'?225:659,audioContext.currentTime);if(kind==='correct')osc.frequency.exponentialRampToValueAtTime(880,audioContext.currentTime+.12);gain.gain.setValueAtTime(.036,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.20);osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+.22);}catch(e){}}
  function syncAudio(){if(melodyTimer){clearInterval(melodyTimer);melodyTimer=null;}if(!s?.sound||!s.music)return;let step=0;const notes=[392,440,523,440,349,392,440,330];melodyTimer=setInterval(()=>{if(document.hidden||s.mode!=='open')return;try{if(!audioContext||audioContext.state!=='running')return;const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.value=notes[step++%notes.length];gain.gain.setValueAtTime(.007,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+.45);osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+.5);}catch(e){}},760);}
  function checkAwards(){ACHIEVEMENTS.forEach(a=>{let value=s.stats[a.stat]||0;let newTier=a.thresholds.filter(n=>value>=n).length,oldTier=s.awards[a.id]||0;if(newTier>oldTier){s.awards[a.id]=newTier;toast(`🏆 ${a.name} · ${TIER[newTier-1]}`,`Chúc mừng! Đã đạt mốc ${a.thresholds[newTier-1]}!`);audioBeep('correct');}});}
  function enterZone(id){if(!ZONES[id])return;ui.zone=id;s.zone=id;ui.active=null;clearAnswer();save();renderAll();}
  function clearAnswer(){ui.pick=null;ui.picks=[];ui.tokens=[];ui.shuffled=[];ui.typing='';ui.feedback=null;}
  function serve(id){if(s.mode!=='open'){toast('Khách đang chờ','Hãy mở cửa thư viện để trò chuyện.');return;}let v=s.dayData.visitors.find(x=>x.id===id&&!x.served);if(!v)return;ui.active=id;ui.zone=v.zone;clearAnswer();const q=bank.find(q=>q.id===v.qid);if(q.type==='order'){let indices=q.options.map((_,i)=>i);ui.shuffled=shuffle(indices);if(ui.shuffled.every((id,i)=>id===i))ui.shuffled.reverse();}renderAll();}
  function answer(){if(s.mode!=='open'||ui.feedback)return;const v=getActive();if(!v||v.served)return;const q=bank.find(x=>x.id===v.qid);let response='',ok=false;
    if(q.type==='mc'){if(ui.pick===null){toast('Chọn đáp án nhé','Bé hãy chọn một phương án trước.');return;}response=q.options[ui.pick];ok=ui.pick===q.answer;}
    if(q.type==='multi'){if(!ui.picks.length){toast('Chọn đáp án nhé','Hãy chọn tất cả phương án bé cho là đúng.');return;}response=ui.picks.map(i=>q.options[i]).join(' · ');ok=ui.picks.length===q.answer.length&&ui.picks.every(i=>q.answer.includes(i));}
    if(q.type==='order'){if(ui.tokens.length!==q.options.length){toast('Chưa xếp xong','Bé cần xếp đủ các ô từ.');return;}response=ui.tokens.map(i=>q.options[i]).join(' ');ok=response===q.answer;}
    if(q.type==='write'){response=ui.typing.trim();if(!response){toast('Viết câu trả lời nhé','Hãy nhập một hoặc hai câu.');return;}let dots=(response.match(/\./g)||[]).length;ok=response.endsWith('.')&&dots<=2&&response.length>=3;}
    const payment=ok?rewardFor(v):0;
    // Sách tại phòng đọc được cho mượn, không trừ tồn vì khách sẽ trả lại. Hàng bán ra mới trừ kho.
    if(ok&&v.itemId){let product=itemById(v.itemId);if(product&&product.qty>0)product.qty--;}
    v.served=true;v.correct=ok;v.reward=payment;v.response=response;if(ok){s.cash+=payment;s.totalEarned+=payment;s.dayData.revenue+=payment;s.stats.correct++;s.stats[v.zone]++;checkAwards();audioBeep('correct');}
    else{s.dayData.bad.push({name:v.name,zone:v.zone,service:v.service,question:q.question,response,answer:correctText(q),explain:q.explain});audioBeep('wrong');}
    ui.feedback={ok,reward:payment,answer:correctText(q),explain:q.explain};
    save();renderHUD();renderVisitor();renderMini();
  }
  function exitVisitor(){if(ui.feedback&&goalStats().served>=goalStats().total){ui.active=null;ui.feedback=null;endDay();return;}ui.active=null;clearAnswer();renderAll();}
  function recordExpense(title,amount){s.cash=Math.max(0,s.cash-amount);s.dayData.expenses.push({title,amount});}
  function endDay(){if(s.dayData.complete){showSummary();return;}const maintenance=15+2*s.day;const paid=Math.min(s.cash,maintenance);s.cash-=paid;s.debt+=(maintenance-paid);s.dayData.maintenance=paid;s.dayData.maintenanceUnpaid=maintenance-paid;s.dayData.expenses.push({title:'Chi phí duy trì thư viện',amount:paid});s.dayData.complete=true;
    const g=goalStats(),n=g.stars;s.dayData.passed=n>=g.required;if(n>=g.required){s.stats.daysWon++;if(n===g.total)s.stats.perfectDays++;checkAwards();}save();renderAll();showSummary();}
  function resetForDay(){resetMovement();const old=s.daySnapshot;if(!old){toast('Không thể khôi phục','Không tìm thấy bản lưu đầu ngày.');return;}s=clone(old);s.daySnapshot=null;initDay();ui.active=null;ui.feedback=null;ui.zone='reading';hideModal();renderAll();toast('Ngày mới, cơ hội mới!','Hãy thử lại để có ít nhất 7 sao.');}
  function nextDay(){if(!s.dayData.complete||!s.dayData.passed)return;resetMovement();s.day++;s.mode='open';initDay();ui.active=null;ui.zone='reading';clearAnswer();hideModal();renderAll();toast('🌼 Chào ngày mới!',`Bạn đã lên cấp Ngày ${s.day}. Hôm nay có ${goalStats().total} khách ghé chơi!`);}
  function modal(content,name='generic'){ui.modal=name;$('dialogBody').innerHTML=content;$('dialogOverlay').classList.remove('is-hidden');}
  function hideModal(){ui.modal=null;$('dialogOverlay').classList.add('is-hidden');$('dialogBody').innerHTML='';}
  function modalHeader(title){return`<div class="modal-heading"><h2>${title}</h2><button class="close-btn" data-close="1">✕</button></div>`;}
  function showTutorial(){modal(`${modalHeader('📖 Cách chơi Thư viện Mây Nhỏ')}<p class="description">Ngày đầu có 10 lượt khách. Sau khi nâng cấp thư viện, những ngày sau có thể đông khách hơn.</p><div class="tutorial-steps"><div><b>1. 🧒 Đặt tên & chọn lớp</b>Lớp 1–5. Khi chọn lớp cao, game vẫn ôn lại kiến thức lớp thấp hơn.</div><div><b>2. 💬 Gặp khách và trả lời</b>Chọn đáp án, chọn nhiều đáp án, ghép từ thành câu hoặc tự gõ câu trả lời.</div><div><b>3. ⭐ Tích sự hài lòng</b>Mỗi câu đúng nhận 1 sao và xu. Sai không bị trừ xu; chỉ mất 1 sao có thể nhận từ vị khách đó.</div><div><b>4. 🎯 Vượt ngày</b>Cần ít nhất 70% số khách hài lòng (ban đầu là 7/10 sao) để sang ngày tiếp theo. Cuối ngày có lời giải cho câu sai.</div><div><b>5. 📦 Kho & nâng cấp</b>Quản lí sách, đồ uống, đồ ăn, đồ lưu niệm. Giá nhập do nhà cung cấp quy định; bé chỉ sửa giá bán và tên.</div><div><b>6. ⏸️ Dừng khi cần</b>Đóng cửa hoặc tạm dừng: khách chờ, không mất tiền hay sao. Tiến độ được tự động lưu trên thiết bị.</div></div><p class="description"><b>Lưu ý:</b> Ở bài tự viết, phiên bản này chấm theo dấu chấm cuối câu, chưa chấm chính tả/ngữ nghĩa tự động. Trò chơi là bài tập biên soạn mới theo chủ điểm SGK, không thay thế SGK.</p><div class="modal-actions"><button class="primary" data-close="1">Mình đã hiểu! 🌼</button></div>`,'help');}
  function showSettings(){modal(`${modalHeader('⚙️ Cài đặt trò chơi')}<div class="settings-list"><label><input type="checkbox" id="configMusic" ${s.music?'checked':''}/> 🎵 Bật nhạc nền dịu nhẹ</label><label><input type="checkbox" id="configEffects" ${s.effects?'checked':''}/> 🔔 Bật âm thanh thao tác</label><label><input type="checkbox" id="configSound" ${s.sound?'checked':''}/> 🔊 Cho phép âm thanh</label></div><p class="description">Dữ liệu được lưu cục bộ trong trình duyệt này. Nếu xóa dữ liệu trình duyệt, tiến độ có thể mất. Hãy xuất tệp sao lưu định kỳ.</p><div class="modal-actions"><button class="secondary" id="exportSave">💾 Tải bản lưu</button><button class="ghost" id="importSave">📂 Nhập bản lưu</button></div><input type="file" id="fileRestore" accept="application/json,.json" class="is-hidden"/><div class="modal-actions"><button class="primary" id="saveSettings">Lưu cài đặt</button><button class="danger" id="newGameBtn">Bắt đầu lại từ đầu</button></div>`,'settings');}
  function showAchievements(){let html=`${modalHeader('🏆 Bộ sưu tập thành tích')}<p class="description">Mỗi danh hiệu có 5 cấp: Hạt giống, Mầm xanh, Hoa nở, Ngôi sao và Huyền thoại. Mỗi lần đạt mốc mới, bạn sẽ được chúc mừng!</p><div class="achievements-list">`;
    ACHIEVEMENTS.forEach(a=>{let tier=s.awards[a.id]||0,next=tier<5?a.thresholds[tier]:'Hoàn thành',value=s.stats[a.stat]||0;html+=`<div class="achievement-row"><div class="emoji">${a.icon}</div><div class="details"><strong>${esc(a.name)} · ${tier?TIER[tier-1]:'Chưa mở khóa'}</strong><small>Tiến độ: ${fmt(value)} / ${next==='Hoàn thành'?'✓':fmt(next)} · ${tier}/5 cấp</small><div class="progress-track" style="margin-top:7px"><div class="progress-fill" style="width:${Math.min(100,(value/(typeof next==='number'?next:value||1))*100)}%"></div></div></div></div>`;});
    html+='</div>';modal(html,'achievements');}
  function showUpgrades(){let html=`${modalHeader('🛠️ Nâng cấp & trang trí')}<p class="description">Mỗi lần nâng cấp tăng vẻ đẹp thư viện và tăng tiền nhận được khi phục vụ đúng ở khu vực tương ứng. Không ảnh hưởng câu hỏi, không tạo phép tính cho bé.</p><div class="upgrade-list">`;
    for(let [id,u]of Object.entries(UPGRADES)){let lv=s.upgrades[id]||0,cost=u.cost*(lv+1);html+=`<div class="upgrade-row"><div class="emoji">${u.icon}</div><div class="details"><strong>${u.name} · Cấp ${lv}/5</strong><small>${u.desc}</small></div><button class="secondary" data-upgrade="${id}" ${(s.cash<cost||lv>=5)?'disabled':''}>${lv>=5?'Tối đa':`🪙 ${fmt(cost)}`}</button></div>`;}
    html+=`</div><p class="description">🪙 Số dư: <b>${fmt(s.cash)}</b> xu. Chi phí nâng cấp sẽ ghi vào sổ chi của ngày.</p>`;modal(html,'upgrades');}
  function showInventory(){let html=`${modalHeader('📦 Kho của thư viện')}<p class="description">Nhà cung cấp đặt giá nhập cố định. Bé được tự đặt tên và giá bán, nhập hàng, hoặc xóa mặt hàng. Số lượng gần hết (2 trở xuống) sẽ được cảnh báo.</p><div class="table-scroll"><table class="stock-table"><thead><tr><th>Mặt hàng</th><th>Tồn</th><th>Giá nhập</th><th>Giá bán</th><th>Quản lí</th></tr></thead><tbody>`;
    for(let p of s.inventory){html+=`<tr data-item-row="${esc(p.id)}"><td>${p.emoji} <input class="item-name" name="name" aria-label="Tên mặt hàng" maxlength="45" value="${esc(p.name)}"/><small style="display:block;color:#a28a74">${esc(p.category)}</small></td><td class="${p.qty<=2?'qtylow':''}">${p.qty}${p.qty<=2?' ⚠':''}</td><td>🪙 ${fmt(p.cost)}</td><td><input name="price" type="number" min="1" max="100000" value="${p.price}" aria-label="Giá bán"/></td><td><button data-stock-save="${esc(p.id)}">💾 Lưu</button><button data-restock="${esc(p.id)}">＋5</button><button data-stock-delete="${esc(p.id)}">✕ Xóa</button></td></tr>`;}
    html+=`</tbody></table></div><p class="description">Mỗi lần nhập bổ sung 5 món, trò chơi tự tính chi phí theo giá nhà cung cấp. Bé không cần làm phép tính.</p><h3>＋ Thêm mặt hàng mới</h3><div class="warehouse-form"><label>Loại hàng<select id="newCategory"><option>Sách</option><option>Đồ uống</option><option>Đồ ăn</option><option>Lưu niệm</option></select></label><label>Tên mặt hàng<input id="newItemName" maxlength="45" placeholder="Ví dụ: Truyện cổ tích"/></label><label>Giá bán (xu)<input id="newPrice" type="number" min="1" max="100000" placeholder="Ví dụ: 35"/></label><button class="primary" id="addProduct">Thêm vào kho</button></div><p class="description">Thêm mặt hàng sẽ có tồn kho 0. Sau đó bé đặt đơn nhập từ nhà cung cấp.</p><div class="modal-actions"><button class="secondary" id="inventoryUpgrade">🛠️ Nâng cấp kho</button><button class="ghost" data-close="1">Đóng kho</button></div>`;
    modal(html,'inventory');}
  function showFinance(){let rows=s.dayData.expenses.map(x=>`<div class="ledger-row"><span>🔻 ${esc(x.title)}</span><b>−${fmt(x.amount)} xu</b></div>`).join('');modal(`${modalHeader('🧾 Sổ thu chi & phí duy trì')}<p class="description">Quầy thu ngân quản lí làm thẻ, trả sách, phí quá hạn, bồi thường sách mất và bán vật phẩm. Các hoạt động được lồng trong hội thoại phục vụ khách.</p><div class="ledger-row"><span>🟢 Tiền thu từ các hội thoại đúng</span><b>+${fmt(s.dayData.revenue)} xu</b></div>${rows||'<div class="hint">Chưa có khoản chi nào trong ngày.</div>'}<div class="ledger-row"><span>💰 Tiền đang có</span><b>${fmt(s.cash)} xu</b></div><div class="ledger-row"><span>🏡 Phí duy trì còn nợ</span><b>${fmt(s.debt)} xu</b></div><div class="modal-actions"><button class="secondary" id="payDebt" ${s.debt<=0||s.cash<=0?'disabled':''}>💵 Thanh toán khoản còn thiếu</button><button class="ghost" data-close="1">Đóng sổ</button></div>`,'finance');}
  function showSummary(){const passed=s.dayData.passed,stats=goalStats();let spending=s.dayData.expenses.reduce((sum,x)=>sum+x.amount,0);let html=`<div class="summary-head"><div class="summary-icon">${passed?'🎉':'🌱'}</div><span class="eyebrow">TỔNG KẾT NGÀY ${s.day}</span><h2>${passed?'Chúc mừng! Thư viện thật vui!':'Chưa đủ sao, thử thêm lần nữa nhé!'}</h2><p class="description">${passed?`Bạn đã đủ ${stats.required}/${stats.total} sao và mở khóa ngày tiếp theo.`:`Bạn cần ít nhất ${stats.required} khách hài lòng trên ${stats.total} khách. Hãy đọc phần chữa bài rồi chơi lại!`}</p></div><div class="summary-stats"><div>👥 Khách phục vụ<strong>${stats.total}/${stats.total}</strong></div><div>⭐ Hài lòng<strong>${stats.stars}/${stats.total}</strong></div><div>🪙 Thu trong ngày<strong>+${fmt(s.dayData.revenue)}</strong></div></div><h3>🧾 Chi tiết thu – chi</h3><div class="ledger-row"><span>Tiền từ câu trả lời đúng</span><b>+${fmt(s.dayData.revenue)} xu</b></div>`;
    s.dayData.expenses.forEach(x=>html+=`<div class="ledger-row"><span>${esc(x.title)}</span><b>−${fmt(x.amount)} xu</b></div>`);
    html+=`<div class="ledger-row"><strong>Tổng chi ngày</strong><b>−${fmt(spending)} xu</b></div><div class="ledger-row"><strong>Số dư hiện tại</strong><b>${fmt(s.cash)} xu</b></div>`;
    if(s.dayData.maintenanceUnpaid)html+=`<p class="description">⚠️ Thiếu ${fmt(s.dayData.maintenanceUnpaid)} xu phí duy trì. Khoản còn thiếu sẽ được ghi vào quầy thu ngân.</p>`;
    html+=`<h3 style="margin-top:20px">${s.dayData.bad.length?'📚 Khách chưa hài lòng – cùng chữa bài':'🌟 Tuyệt vời, không có câu sai!'}</h3>`;
    s.dayData.bad.forEach((x,i)=>html+=`<div class="incorrect-item"><strong>${i+1}. ${esc(x.name)} · ${esc(ZONES[x.zone].title)}</strong><div>Khách hỏi: ${esc(x.question)}</div><div>Bé đáp: ${esc(x.response)}</div><div><b>Đáp án đúng:</b> ${esc(x.answer)}</div><div><b>Giải thích:</b> ${esc(x.explain)}</div></div>`);
    html+=`<div class="modal-actions">${passed?'<button class="primary" id="nextDay">🌼 Sang ngày tiếp theo</button>':'<button class="primary" id="retryDay">🔄 Chơi lại ngày này</button>'}</div>`;
    modal(html,'summary');$('dialogBody').querySelectorAll('[data-close]').forEach(b=>b.remove());}
  function stockEvent(action,id){const p=itemById(id);if(!p)return;
    if(action==='stock-save'){const row=[...document.querySelectorAll('[data-item-row]')].find(x=>x.dataset.itemRow===id);let name=row?.querySelector('[name="name"]')?.value.trim(),price=Number(row?.querySelector('[name="price"]')?.value);if(!name||!Number.isInteger(price)||price<1||price>100000){toast('Kiểm tra lại','Tên không được rỗng, giá bán là số nguyên từ 1 đến 100.000 xu.');return;}p.name=name;p.price=price;save();toast('Đã lưu','Tên và giá bán đã được cập nhật.');showInventory();}
    if(action==='restock'){let cost=p.cost*5;if(s.cash<cost){toast('Chưa đủ xu để nhập hàng',`Cần ${fmt(cost)} xu cho 5 món. Hãy phục vụ khách để có thêm xu.`);return;}recordExpense(`Nhập thêm ${p.name}`,cost);p.qty+=5;s.stats.restocks++;checkAwards();save();renderAll();showInventory();toast('📦 Hàng đã về!',`Đã nhập thêm 5 ${p.name}. Đã chi ${fmt(cost)} xu.`);}
    if(action==='stock-delete'){if(!confirm(`Xóa "${p.name}" khỏi danh mục?`))return;s.inventory=s.inventory.filter(x=>x.id!==id);save();showInventory();renderAll();toast('Đã xóa mặt hàng','Mặt hàng không còn trong danh mục kho.');}
  }
  function addProduct(){let category=$('newCategory').value,name=$('newItemName').value.trim(),price=Number($('newPrice').value);if(!name||!Number.isInteger(price)||price<1||price>100000){toast('Chưa đủ thông tin','Nhập tên mặt hàng và giá bán hợp lệ.');return;}let id='custom_'+Date.now()+'_'+Math.floor(Math.random()*10000);s.inventory.push({id,name,category,cost:COST_BY_CATEGORY[category],price,qty:0,emoji:CATEGORY_EMOJI[category]});save();showInventory();renderAll();toast('Đã tạo mặt hàng',`Nhà cung cấp định giá nhập là ${COST_BY_CATEGORY[category]} xu/món.`);}
  function upgrade(id){let x=UPGRADES[id];if(!x)return;let level=s.upgrades[id];if(level>=5)return;let cost=x.cost*(level+1);if(s.cash<cost){toast('Chưa đủ xu','Phục vụ thêm khách để nâng cấp nhé!');return;}recordExpense(`Nâng cấp ${x.name} (cấp ${level+1})`,cost);s.upgrades[id]++;s.stats.upgrades++;checkAwards();save();renderAll();showUpgrades();toast('🛠️ Nâng cấp thành công!',`${x.name} lên cấp ${level+1}. Khách sẽ yêu thư viện hơn!`);audioBeep();}
  function exportSave(){const url=URL.createObjectURL(new Blob([JSON.stringify(s,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`thu-vien-may-nho-${s.name.replace(/[^a-zA-Z0-9À-ỹ]/g,'-')}-ngay-${s.day}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function onDialogClick(e){const t=e.target.closest('button');if(!t)return;
    if(t.dataset.close!==undefined){if(ui.modal!=='summary')hideModal();return;}
    if(t.dataset.upgrade){upgrade(t.dataset.upgrade);return;}
    for(let a of ['stockSave','restock','stockDelete'])if(t.dataset[a]){stockEvent(a.replace(/[A-Z]/g,c=>'-'+c.toLowerCase()),t.dataset[a]);return;}
    switch(t.id){case'inventoryUpgrade':showUpgrades();break;case'addProduct':addProduct();break;case'nextDay':nextDay();break;case'retryDay':resetForDay();break;case'saveSettings':s.music=$('configMusic').checked;s.effects=$('configEffects').checked;s.sound=$('configSound').checked;save();syncAudio();hideModal();renderHUD();toast('Đã lưu cài đặt','Bạn có thể tiếp tục chơi.');break;
      case'newGameBtn':if(confirm('Bắt đầu lại sẽ xóa tiến độ chơi hiện tại. Bạn chắc chắn chứ?')){try{localStorage.removeItem(STORAGE)}catch(e){}s=null;hideModal();$('appContent').classList.add('is-hidden');$('onboarding').classList.remove('is-hidden');$('continueHint').textContent='';}break;
      case'exportSave':exportSave();toast('Đã tạo tệp sao lưu','Hãy giữ tệp JSON để phục hồi khi cần.');break;
      case'importSave':$('fileRestore').click();break;
      case'payDebt':{let paid=Math.min(s.debt,s.cash);if(paid<=0)return;s.debt-=paid;recordExpense('Thanh toán phí duy trì còn thiếu',paid);save();showFinance();renderAll();toast('Đã thanh toán',`Đã trả ${fmt(paid)} xu.`);break;}
    }
  }
  function wireEvents(){ $('showHelp').onclick=showTutorial;$('startHelp').onclick=showTutorial;$('showAchievements').onclick=()=>{if(s)showAchievements();else showTutorial();};$('showSettings').onclick=()=>{if(s)showSettings();else showTutorial();};
    $('startGame').onclick=()=>{let name=$('playerName').value.trim()||'Bông',grade=Number($('startGrade').value);const old=restore();if(old){if(confirm('Đã có bản lưu trước. Chọn OK để tiếp tục bản cũ, Hủy để bắt đầu thư viện mới.')){resetMovement();s=old;if(!s.dayData||!s.dayData.visitors?.length)initDay();showGame();return;}}startFresh(name,grade,$('startMusic').checked,$('startEffects').checked);};
    $('modeBtn').onclick=()=>$('modeMenu').classList.toggle('is-hidden');$('modeMenu').addEventListener('click',e=>{let b=e.target.closest('[data-mode]');if(!b)return;s.mode=b.dataset.mode;$('modeMenu').classList.add('is-hidden');save();renderAll();syncAudio();toast({open:'🟢 Thư viện đã mở cửa!',paused:'⏸️ Đã tạm dừng',closed:'🔒 Đã đóng cửa'}[s.mode],s.mode==='open'?'Khách có thể tiếp tục trò chuyện.':'Khách sẽ chờ, không bị trừ tiền hay sao.');});
    $('gradeSelect').onchange=e=>{const grade=Number(e.target.value);const done=goalStats().served;s.grade=grade;if(done===0){s.dayData.visitors=makeVisitors();s.daySnapshot=null;s.daySnapshot=clone({...s,daySnapshot:null});ui.active=null;clearAnswer();toast('Đổi cấp độ học',`Các khách hôm nay sẽ hỏi nội dung từ lớp 1 đến lớp ${grade}.`);}else toast('Đã đổi cấp độ',`Bài tập từ lớp 1 đến ${grade} sẽ được áp dụng từ ngày tiếp theo.`);save();renderAll();};
    $('soundBtn').onclick=()=>{s.sound=!s.sound;save();renderHUD();syncAudio();if(s.sound)audioBeep();};
    $('zoneCards').addEventListener('click',e=>{const b=e.target.closest('[data-zone]');if(b)walkToZone(b.dataset.zone);});
    $('visitorPanel').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.serve){serve(Number(b.dataset.serve));return;}if(b.dataset.choice!==undefined){let index=Number(b.dataset.choice);const v=getActive(),q=bank.find(q=>q.id===v?.qid);if(q.type==='mc')ui.pick=index;else{if(ui.picks.includes(index))ui.picks=ui.picks.filter(i=>i!==index);else ui.picks.push(index);}renderVisitor();return;}
      if(b.dataset.token!==undefined){ui.tokens.push(Number(b.dataset.token));renderVisitor();return;}if(b.dataset.removeToken!==undefined){ui.tokens.splice(Number(b.dataset.removeToken),1);renderVisitor();return;}
      if(b.id==='submitAnswer'){answer();return;}if(b.id==='backVisitors'){ui.active=null;clearAnswer();renderVisitor();return;}if(b.id==='nextVisitor'){exitVisitor();return;}if(b.id==='inventoryBtn'||b.id==='cafeStockBtn'){showInventory();return;}if(b.id==='upgradeBtn'){showUpgrades();return;}if(b.id==='financeBtn'){showFinance();return;}
    });
    $('visitorPanel').addEventListener('input',e=>{if(e.target.id==='writingInput')ui.typing=e.target.value;});
    $('miniPanel').addEventListener('click',e=>{if(e.target.closest('#miniUpgrade'))showUpgrades();});
    $('dialogBody').addEventListener('click',onDialogClick);
    $('dialogBody').addEventListener('change',e=>{if(e.target.id!=='fileRestore')return;const f=e.target.files[0];if(!f)return;f.text().then(raw=>{let x=JSON.parse(raw);if(!validState(x))throw new Error('Bản lưu không hợp lệ');if(!confirm('Nhập bản lưu sẽ thay thế tiến độ đang chơi. Tiếp tục?'))return;s=x;resetMovement();ui.active=null;clearAnswer();if(!s.dayData?.visitors?.length)initDay();save();hideModal();renderAll();toast('Khôi phục thành công!',`Chào mừng ${s.name} trở lại.`);}).catch(()=>toast('Không thể nhập','Tệp bản lưu JSON không hợp lệ.'));});
    $('scene').addEventListener('click',e=>{const box=e.currentTarget.getBoundingClientRect();let x=(e.clientX-box.left)/box.width*480,y=(e.clientY-box.top)/box.height*280;if(y<35)return;const z=(y<151?(x<240?'reading':'cafe'):(x<240?'counter':'warehouse'));walkToZone(z);});
    // Điều khiển bằng bàn phím, dành cho máy tính.
    const usable=new Set(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright']);
    window.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target?.tagName||'')||!s)return;let k=e.key.toLowerCase();if(usable.has(k)){e.preventDefault();actor.keys.add(k);}else if(k==='e'||k===' '){e.preventDefault();interactNearby();}});
    window.addEventListener('keyup',e=>actor.keys.delete(e.key.toLowerCase()));
    window.addEventListener('blur',()=>actor.keys.clear());
    $('touchPad').addEventListener('pointerdown',e=>{const b=e.target.closest('[data-move]');if(!b)return;e.preventDefault();actor.keys.add(b.dataset.move);b.setPointerCapture?.(e.pointerId);});
    for(const ev of ['pointerup','pointercancel','lostpointercapture'])$('touchPad').addEventListener(ev,e=>{const b=e.target.closest('[data-move]');if(b)actor.keys.delete(b.dataset.move);});
    $('touchPad').addEventListener('click',e=>{if(e.target.closest('#touchTalk'))interactNearby();});
    $('dialogOverlay').addEventListener('click',e=>{if(e.target===e.currentTarget&&ui.modal!=='summary')hideModal();});
    window.addEventListener('keydown',e=>{if(e.key==='Escape'&&ui.modal!=='summary'&&!$('dialogOverlay').classList.contains('is-hidden'))hideModal();});
  }

  // 2.5D pixel art: rendered at a small native resolution, scaled with nearest-neighbour.
  const canvas=$('scene'),ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
  const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
  const poly=(pts,c)=>{ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);pts.slice(1).forEach(p=>ctx.lineTo(...p));ctx.closePath();ctx.fillStyle=c;ctx.fill();};
  const label=(text,x,y,c='#503c31',size=10)=>{ctx.font=`bold ${size}px monospace`;ctx.textAlign='center';ctx.fillStyle='#fff2da';ctx.fillText(text,x+1,y+1);ctx.fillStyle=c;ctx.fillText(text,x,y);};
  function drawPlant(x,y){rect(x-8,y+7,16,4,'#845846');rect(x-6,y,12,13,'#c98967');rect(x-10,y-12,20,11,'#5f9073');rect(x-5,y-18,10,15,'#7ead83');rect(x+2,y-8,8,12,'#8cb786');rect(x-2,y-20,5,5,'#abd293');}
  function drawShelf(x,y,books=9){rect(x+6,y+9,84,35,'#865a45');rect(x,y,86,37,'#ba8660');rect(x+4,y+5,78,27,'#e6c392');for(let r=0;r<2;r++){rect(x+7,y+15*r+18,72,4,'#905f47');for(let i=0;i<books;i++)rect(x+9+i*8,y+8+r*16,5,9+(i%3),['#88a98b','#db9c75','#8daec0','#cfbd76','#be8393'][i%5]);}rect(x+3,y+36,83,5,'#855d48');}
  function table(x,y,w=60,co='#c89068'){rect(x+4,y+17,w,8,'#946a4e');rect(x,y+8,w,14,co);rect(x,y+6,w,4,'#e7b387');rect(x+7,y+23,7,13,'#996849');rect(x+w-13,y+23,7,13,'#996849');}
  function person(x,y,i,t){let bob=Math.round(Math.sin(t/550+i*2)*2),skin=['#f3c7a1','#d9a57f','#edbb95'][i%3],shirt=['#cd8c83','#8bb1a0','#b6a0c5','#d5b36c'][i%4];rect(x-4,y+18+bob,18,4,'#70594466');rect(x-2,y+8+bob,5,12,'#594d4e');rect(x+7,y+8+bob,5,12,'#594d4e');rect(x-4,y+bob,18,13,shirt);rect(x+1,y-13+bob,11,12,skin);rect(x,y-16+bob,14,5,['#785246','#694c39','#bc8b5d','#564942'][i%4]);rect(x-1,y-13+bob,4,7,'#75564b');rect(x+3,y-7+bob,2,2,'#5e493d');rect(x+9,y-7+bob,2,2,'#5e493d');}
  function drawRoom(x,y,w,h,floor,wall,front){rect(x+5,y+7,w,h,front);rect(x,y,w,h,floor);rect(x,y,w,12,wall);rect(x,y+10,w,3,'#fdf0d1');for(let i=0;i<8;i++){let yy=y+20+i*12;rect(x+4,yy,w-8,1,'#ffffff20');}rect(x,y+h-7,w,7,front);}
  function art(time){
    const dt=motionLast?Math.min(Math.max(0,time-motionLast)/1000,.055):0;motionLast=time;
    if(s?.mode==='open')motionTime+=dt;
    stepActor(dt);
    frame=time||0;ctx.clearRect(0,0,480,280);rect(0,0,480,280,'#d0b897');rect(0,0,480,35,'#b27a63');for(let i=0;i<480;i+=20)rect(i,0,2,35,'#cc9877');rect(0,30,480,7,'#785a48');rect(10,38,216,106,'#ad8a71');rect(241,38,229,106,'#ad8a71');
    drawRoom(9,37,216,107,'#ddc9a3','#7c997e','#bba07f');drawRoom(240,37,231,107,'#e5c49e','#b38166','#c2a07b');drawRoom(9,151,216,119,'#edcdaa','#a58885','#bfa282');drawRoom(240,151,231,119,'#d7c2a3','#8d8da0','#b5a286');
    // graphic wall hanging and furniture
    rect(95,40,36,14,'#eac58e');rect(100,43,26,8,'#91b6ac');drawShelf(22,68,s?.upgrades.reading>2?10:8);drawShelf(131,65,8);table(95,98,61,'#be956e');rect(115,91,8,9,'#86b5ab');rect(116,87,5,6,'#f7e1b8');drawPlant(206,122);
    rect(262,43,104,20,'#8a644f');label('CA PHE & BANH',315,56,'#fff5da',10);rect(255,73,62,25,'#b78162');rect(250,89,75,13,'#8d5d46');rect(260,79,40,8,'#f5d9b4');rect(279,71,14,7,'#f5eee1');table(355,91,65,'#d6a376');rect(371,82,7,8,'#f4e9d6');rect(369,81,12,3,'#8b5b48');drawPlant(454,115);
    rect(17,160,194,17,'#c38e70');label('QUAY THU NGAN',111,173,'#fff6dd',11);table(27,203,110,'#c38a6e');rect(37,191,36,20,'#96705f');rect(43,194,22,12,'#b2d3bb');rect(89,197,23,10,'#fff3dd');rect(93,193,16,4,'#e5d0a6');drawShelf(157,200,6);
    rect(261,160,190,17,'#8986a2');label('KHO HANG',355,173,'#fff6db',11);for(let k=0;k<3;k++){let xx=257+k*67;rect(xx+5,195,56,57,'#987557');rect(xx,190,54,55,'#b38b66');rect(xx+5,194,43,14,'#ebd1a3');rect(xx+5,217,43,14,'#ebd1a3');rect(xx+17,196,14,4,'#b8a28f');rect(xx+17,218,14,4,'#b8a28f');rect(xx+24,190,4,54,'#916e59');}
    // Faux isometric warm floor tiles for depth.
    for(let z=0;z<4;z++){let zx=z%2?240:9,zy=z<2?37:151;poly([[zx+6,zy+20],[zx+20,zy+14],[zx+32,zy+20],[zx+18,zy+26]],'#ffffff21');}
    // Khách thật sự đi từ cửa vào đúng phòng; người chơi di chuyển độc lập.
    drawGuestSprites(dt);
    if(s)drawLibrarian();
    Object.entries(WALK_STOPS).forEach(([z,pos])=>{if((s?.upgrades[z]||0)>0){rect(pos.x-20,pos.y-30,8,8,'#f3e7a2');rect(pos.x-17,pos.y-33,2,2,'#fffbd8');}});
    // selected zone dashed highlights & zone names
    let regions={reading:[9,37,216,107],cafe:[240,37,231,107],counter:[9,151,216,119],warehouse:[240,151,231,119]};let a=regions[ui.zone];if(a&&s){ctx.strokeStyle='#fffcde';ctx.lineWidth=3;ctx.setLineDash([8,5]);ctx.strokeRect(a[0]+2,a[1]+2,a[2]-4,a[3]-4);ctx.setLineDash([]);}label('PHONG DOC',111,52,'#fff6dc');
    requestAnimationFrame(art);
  }
  function bootstrap(){wireEvents();requestAnimationFrame(art);const current=restore();if(current){$('playerName').value=current.name;$('startGrade').value=current.grade;$('startMusic').checked=current.music;$('startEffects').checked=current.effects;$('continueHint').textContent=`💾 Đã tìm thấy bản lưu của ${current.name} – Ngày ${current.day}. Khi bắt đầu, bạn có thể tiếp tục bản lưu cũ.`;}else{$('continueHint').textContent='💾 Game sẽ tự động lưu tiến độ trên thiết bị này.';}}
  bootstrap();
})();
