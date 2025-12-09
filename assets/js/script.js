function initViewer(panoImage, hotspots){
  const viewer = pannellum.viewer('panorama', {
    "type": "equirectangular",
    "panorama": panoImage,
    "autoLoad": true,
    "hotSpots": hotspots
  });
  window.CAMPUS360_VIEWER = viewer;
}

function hotspotRenderer(hotSpotDiv, args){
  hotSpotDiv.classList.add('custom-hotspot');
  hotSpotDiv.style.width = '28px';
  hotSpotDiv.style.height = '28px';
  hotSpotDiv.style.borderRadius = '8px';
  hotSpotDiv.style.background = 'rgba(255,255,255,0.9)';
  hotSpotDiv.style.display = 'flex';
  hotSpotDiv.style.alignItems = 'center';
  hotSpotDiv.style.justifyContent = 'center';
  hotSpotDiv.style.cursor = 'pointer';
  hotSpotDiv.innerHTML = args.icon || 'i';
  hotSpotDiv.addEventListener('click', function(e){
    e.stopPropagation();
    openInfoModal(args);
  });
}

function openInfoModal(args){
  const backdrop = document.getElementById('modal-backdrop');
  const title = document.getElementById('modal-title');
  const text = document.getElementById('modal-text');
  const videoBtn = document.getElementById('modal-video-btn');
  title.innerText = args.title || 'Informação';
  text.innerText = args.text || '';
  const videoPath = args.video || '';
  if(videoPath){
    fetch(videoPath, {method: 'HEAD'}).then(r => {
      if(r.ok){ videoBtn.disabled = false; videoBtn.dataset.video = videoPath; }
      else { videoBtn.disabled = true; videoBtn.dataset.video = ''; }
    }).catch(err => { videoBtn.disabled = true; videoBtn.dataset.video = ''; });
  } else {
    videoBtn.disabled = true; videoBtn.dataset.video = '';
  }
  backdrop.style.display = 'flex';
}

function closeModal(){ document.getElementById('modal-backdrop').style.display = 'none'; }

function playVideoFull(videoPath){
  const overlay = document.getElementById('video-overlay');
  const videoEl = document.getElementById('overlay-video');
  videoEl.src = videoPath;
  overlay.style.display = 'flex';
  videoEl.play().catch(()=>{});
  if(videoEl.requestFullscreen) videoEl.requestFullscreen().catch(()=>{});
}

function closeVideo(){
  const overlay = document.getElementById('video-overlay');
  const videoEl = document.getElementById('overlay-video');
  try{ if(document.fullscreenElement) document.exitFullscreen().catch(()=>{}); }catch(e){}
  videoEl.pause();
  videoEl.src = '';
  overlay.style.display = 'none';
}

function bindModalButtons(){
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-video-btn').addEventListener('click', function(){
    const v = this.dataset.video;
    if(v) playVideoFull(v);
  });
  document.getElementById('video-close').addEventListener('click', closeVideo);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ closeVideo(); closeModal(); } });
}

document.addEventListener('DOMContentLoaded', function(){ bindModalButtons(); });