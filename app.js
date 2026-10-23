const STORAGE_KEY = "jornada-aria-v1";
const seedData = [
  {id:"cine", name:"VIDEO 1", subtitle:"CINE", description:"Pieza cinematográfica. Construir una narrativa entre la obra real, el protagonista y el futuro edificio.", plans:[
    {id:"c1",category:"PLANOS DE OBREROS",name:"Pasos de un obrero",type:"Plano detalle",subject:"Obrero",description:"Registrar los pasos sobre el hormigón y la textura del piso.",location:"Interior de obra",duration:"5–8 segundos",notes:"Grabar una toma fija y otra acompañando el movimiento."},
    {id:"c2",category:"PLANOS DE FRAN",name:"Pasos de Fran llegando a ARIA",type:"Plano detalle",subject:"Fran",description:"Fran entra en cuadro caminando hacia la obra.",location:"Acceso / obra",duration:"5–8 segundos",notes:"Mantener continuidad para poder alternarlo con los pasos del obrero."},
    {id:"c3",category:"PLANOS DE LA OBRA SOLA",name:"Luz entrando por una abertura",type:"Plano detalle",subject:"Luz / arquitectura",description:"Luz natural atravesando una abertura; buscar sombras y reflejos sobre el hormigón.",location:"Interior de obra",duration:"5–8 segundos",notes:"Exposición cuidada; movimiento muy lento o cámara fija."},
    {id:"c4",category:"PLANOS DE OBREROS",name:"Manos del obrero trabajando",type:"Primer plano",subject:"Obrero / herramientas",description:"Manos manipulando herramientas o trabajando el material.",location:"Sector de trabajo",duration:"5–8 segundos",notes:"Priorizar una acción real y segura."},
    {id:"c5",category:"PLANOS DE FRAN",name:"Fran caminando entre la estructura",type:"Plano general",subject:"Fran",description:"Vemos al protagonista en medio de la obra real, rodeado por la estructura.",location:"Interior de obra",duration:"8–12 segundos",notes:"Que la arquitectura tenga más peso visual que la persona."},
    {id:"c6",category:"PLANOS DE FRAN",name:"Primer plano de los ojos",type:"Primer plano",subject:"Fran",description:"Fran observa el espacio o mira hacia el exterior.",location:"Abertura / interior",duration:"3–5 segundos",notes:"Gestualidad mínima, sin posar."},
    {id:"c7",category:"PLANOS DE FRAN",name:"Fran mirando hacia afuera",type:"Plano general",subject:"Fran / exterior",description:"Fran o Cuqui parado dentro de la obra mirando hacia afuera.",location:"Interior de obra",duration:"8–12 segundos",notes:"Dejar aire en el encuadre y sostener la mirada."},
    {id:"c8",category:"PLANOS DE FRAN",name:"La cámara se aleja",type:"Travelling",subject:"Protagonista / arquitectura",description:"La cámara se aleja lentamente y revela la escala del ambiente.",location:"Interior de obra",duration:"8–12 segundos",notes:"Movimiento parejo, sin aceleraciones bruscas."},
    {id:"c9",category:"PLANOS DE SAAVEDRA",name:"Saavedra: vida de barrio",type:"Plano general",subject:"Calles / árboles / plaza / tren",description:"Calles, árboles, plaza, gente caminando, cielo abierto y tren pasando.",location:"Entorno de ARIA",duration:"5–8 segundos",notes:"Renders solo como anticipación breve."}
  ]},
  {id:"reel1",name:"REEL 1",subtitle:"REEL",description:"Agregá acá el concepto, hook y desglose de planos de este reel.",plans:[]},
  {id:"reel2",name:"REEL 2",subtitle:"REEL",description:"Agregá acá el concepto, hook y desglose de planos de este reel.",plans:[]},
  {id:"reel3",name:"REEL 3",subtitle:"REEL",description:"Agregá acá el concepto, hook y desglose de planos de este reel.",plans:[]},
  {id:"reel4",name:"REEL 4",subtitle:"REEL",description:"Agregá acá el concepto, hook y desglose de planos de este reel.",plans:[]}
];
let data = loadData();
let activeVideoId = data[0]?.id;
let activeCineCategory = "PLANOS DE OBREROS";
let toastTimer;
const $ = id => document.getElementById(id);
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function clone(value){ return JSON.parse(JSON.stringify(value)); }
function loadData(){
  try { const saved = localStorage.getItem(STORAGE_KEY); if(saved){const parsed=JSON.parse(saved); if(Array.isArray(parsed)&&parsed.length)return parsed;} } catch(e){}
  return clone(seedData);
}
function saveData(message="Cambios guardados en este dispositivo"){
  try { localStorage.setItem(STORAGE_KEY,JSON.stringify(data)); $("save-status").textContent=message; }
  catch(e){ $("save-status").textContent="No se pudo guardar en este navegador"; showToast("No se pudo guardar. Revisá el almacenamiento del navegador."); }
  render();
}
function showToast(message){ const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2300); }
function activeVideo(){ return data.find(v=>v.id===activeVideoId)||data[0]; }
function allPlans(){ return data.flatMap(v=>v.plans||[]); }
function render(){
  if(!data.length){data=clone(seedData);activeVideoId=data[0].id;}
  if(!data.some(v=>v.id===activeVideoId)) activeVideoId=data[0].id;
  renderNav(); renderContent(); renderProgress();
}
function renderNav(){
  const nav=$("video-nav");
  nav.innerHTML=data.map((v,i)=>{
    const plans=v.plans||[], done=plans.filter(p=>p.done).length, complete=plans.length>0&&done===plans.length;
    return `<button class="nav-item ${v.id===activeVideoId?"active":""}" data-video="${esc(v.id)}">
      <span class="nav-number">${String(i+1).padStart(2,"0")}</span>
      <span class="nav-copy"><strong>${esc(v.name)}</strong><small>${esc(v.subtitle||"VIDEO")} · ${done}/${plans.length} planos</small></span>
      <span class="nav-check">${complete?"✓":""}</span>
    </button>`;
  }).join("") + `<button id="add-video-nav" class="nav-item"><span class="nav-number">＋</span><span class="nav-copy"><strong>Agregar video</strong><small>Crear otra pestaña</small></span></button>`;
  nav.querySelectorAll("[data-video]").forEach(b=>b.addEventListener("click",()=>{activeVideoId=b.dataset.video;render();}));
  $("add-video-nav").addEventListener("click",()=>openVideoDialog());
}
function renderProgress(){
  const plans=allPlans(), done=plans.filter(p=>p.done).length;
  const completedVideos=data.filter(v=>v.plans?.length && v.plans.every(p=>p.done)).length;
  const percent=plans.length?Math.round(done/plans.length*100):0;
  $("progress-count").textContent=`${completedVideos} de ${data.length} videos completos · ${done}/${plans.length} planos`;
  $("progress-percent").textContent=percent+"%";
  $("progress-bar").style.width=percent+"%";
}
function renderContent(){
  const v=activeVideo(); if(!v)return;
  const allVideoPlans=v.plans||[];
  const isCine=v.id==="cine";
  const categories=["PLANOS DE OBREROS","PLANOS DE LA OBRA SOLA","PLANOS DE FRAN","PLANOS DE SAAVEDRA"];
  const plans=isCine?allVideoPlans.filter(p=>(p.category||inferCategory(p))===activeCineCategory):allVideoPlans;
  $("video-content").innerHTML=`
    <div class="video-header">
      <div class="video-header-top">
        <div><div class="video-kicker">${esc(v.subtitle||"VIDEO")} · JORNADA ARIA</div><h2>${esc(v.name)}</h2><p class="video-desc">${esc(v.description||"Sumá una descripción para organizar el rodaje.")}</p></div>
        <div class="header-actions"><button id="edit-video" class="secondary-button">Editar video</button><button id="delete-video" class="secondary-button">Eliminar</button></div>
      </div>
      <div class="video-meta"><span class="meta-chip">${plans.length} planos</span><span class="meta-chip">${plans.filter(p=>p.done).length} grabados</span><span class="meta-chip">${plans.length&&plans.every(p=>p.done)?"Completo":"En producción"}</span></div>
    </div>
    ${isCine?`<div class="subtabs" role="tablist" aria-label="Categorías de planos">${categories.map((c,i)=>`<button class="subtab ${c===activeCineCategory?"active":""}" role="tab" aria-selected="${c===activeCineCategory}" data-category="${esc(c)}"><span>${String(i+1).padStart(2,"0")}</span>${esc(c)}<small>${allVideoPlans.filter(p=>(p.category||inferCategory(p))===c).length} planos</small></button>`).join("")}</div>`:""}
    <div class="shot-toolbar"><h3>${isCine?esc(activeCineCategory):"Desglose de planos"}</h3><span>Marcá ✓ cuando esté grabado</span></div>
    <div class="shot-list">${plans.length?plans.map((p,i)=>shotCard(p,i)).join(""):`<div class="empty-state"><strong>Todavía no hay planos</strong><p>Agregá el primer plano para empezar a organizar este video.</p></div>`}</div>
    <div class="bottom-add"><button id="add-plan" class="add-wide">＋ Agregar un plano</button></div>
    <p class="footer-note">Los cambios se guardan automáticamente en este navegador.</p>`;
  $("edit-video").addEventListener("click",()=>openVideoDialog(v));
  $("delete-video").addEventListener("click",()=>deleteVideo(v.id));
  $("add-plan").addEventListener("click",()=>openPlanDialog());
  document.querySelectorAll("[data-category]").forEach(b=>b.addEventListener("click",()=>{activeCineCategory=b.dataset.category;render();}));
  document.querySelectorAll("[data-done]").forEach(b=>b.addEventListener("click",()=>toggleDone(b.dataset.done)));
  document.querySelectorAll("[data-edit-plan]").forEach(b=>b.addEventListener("click",()=>openPlanDialog(findPlan(b.dataset.editPlan))));
  document.querySelectorAll("[data-delete-plan]").forEach(b=>b.addEventListener("click",()=>deletePlan(b.dataset.deletePlan)));
}
function shotCard(p,i){
  return `<article class="shot-card ${p.done?"done":""}">
    <div class="shot-index">${p.done?"✓":String(i+1).padStart(2,"0")}</div>
    <div class="shot-main"><div class="shot-topline"><h4>${esc(p.name)}</h4><span class="type-pill">${esc(p.type||"Sin tipo")}</span></div>
      ${p.description?`<p>${esc(p.description)}</p>`:""}
      <div class="shot-details">${p.subject?`<span>◉ ${esc(p.subject)}</span>`:""}${p.location?`<span>⌖ ${esc(p.location)}</span>`:""}${p.duration?`<span>◷ ${esc(p.duration)}</span>`:""}</div>
      ${p.notes?`<div class="shot-notes"><strong>NOTAS</strong> · ${esc(p.notes)}</div>`:""}
    </div>
    <div class="shot-actions"><button class="check-button" data-done="${esc(p.id)}" title="${p.done?"Marcar pendiente":"Marcar grabado"}" aria-label="${p.done?"Marcar pendiente":"Marcar grabado"}">${p.done?"✓":"○"}</button><button class="small-button" data-edit-plan="${esc(p.id)}">Editar</button><button class="small-button" data-delete-plan="${esc(p.id)}" aria-label="Eliminar plano">×</button></div>
  </article>`;
}
function inferCategory(p){
  const text=`${p.name||""} ${p.subject||""} ${p.description||""}`.toLowerCase();
  if(/saavedra|plaza|tren|calle|barrio|árbol|arbol|pájaro|pajaro|gente caminando/.test(text))return "PLANOS DE SAAVEDRA";
  if(/fran|cuqui|protagonista/.test(text))return "PLANOS DE FRAN";
  if(/obrero|herramienta|martillo|taladro|tornillo|guantes|casco/.test(text))return "PLANOS DE OBREROS";
  return "PLANOS DE LA OBRA SOLA";
}
function findPlan(id){for(const v of data){const p=v.plans.find(p=>p.id===id);if(p)return p;}return null;}
function toggleDone(id){const p=findPlan(id);if(p){p.done=!p.done;saveData();showToast(p.done?"Plano marcado como grabado":"Plano marcado como pendiente");}}
function openPlanDialog(plan=null){
  $("plan-form").reset(); $("plan-id").value=plan?.id||"";
  $("dialog-title").textContent=plan?"Editar plano":"Agregar plano";
  $("plan-name").value=plan?.name||"";$("plan-type").value=plan?.type||"Plano detalle";
  $("plan-subject").value=plan?.subject||"";$("plan-description").value=plan?.description||"";$("plan-category").value=plan?.category||activeCineCategory;
  $("plan-location").value=plan?.location||"";$("plan-duration").value=plan?.duration||"5–8 segundos";
  $("plan-notes").value=plan?.notes||"";$("plan-dialog").showModal();
}
function closePlanDialog(){ $("plan-dialog").close(); }
$("close-dialog").addEventListener("click",closePlanDialog);$("cancel-dialog").addEventListener("click",closePlanDialog);
$("plan-form").addEventListener("submit",e=>{
  e.preventDefault();const id=$("plan-id").value||("p"+Date.now().toString(36)+Math.random().toString(36).slice(2,6));
  const existing=findPlan(id);
  const plan={id,category:activeVideo().id==="cine"?$("plan-category").value:"",name:$("plan-name").value.trim(),type:$("plan-type").value,subject:$("plan-subject").value.trim(),description:$("plan-description").value.trim(),location:$("plan-location").value.trim(),duration:$("plan-duration").value,notes:$("plan-notes").value.trim(),done:existing?.done||false};
  const v=activeVideo();if(existing){Object.assign(existing,plan);}else{v.plans.push(plan);if(v.id==="cine")activeCineCategory=plan.category||activeCineCategory;}
  closePlanDialog();saveData();showToast(existing?"Plano actualizado":"Plano agregado");
});
function deletePlan(id){
  const p=findPlan(id);if(!p||!confirm(`¿Eliminar el plano “${p.name}”? Esta acción no se puede deshacer.`))return;
  data.forEach(v=>v.plans=v.plans.filter(x=>x.id!==id));saveData();showToast("Plano eliminado");
}
function openVideoDialog(video=null){
  $("video-form").reset();$("video-id").value=video?.id||"";
  $("video-dialog-title").textContent=video?"Editar video":"Agregar video";
  $("video-name").value=video?.name||"";$("video-description").value=video?.description||"";
  $("video-dialog").showModal();
}
function closeVideoDialog(){$("video-dialog").close();}
$("close-video-dialog").addEventListener("click",closeVideoDialog);$("cancel-video-dialog").addEventListener("click",closeVideoDialog);
$("video-form").addEventListener("submit",e=>{
  e.preventDefault();const id=$("video-id").value;
  const name=$("video-name").value.trim(),description=$("video-description").value.trim();
  if(id){const v=data.find(v=>v.id===id);if(v){v.name=name;v.description=description;}}
  else{const newId="video"+Date.now().toString(36);data.push({id:newId,name,subtitle:"VIDEO",description,plans:[]});activeVideoId=newId;}
  closeVideoDialog();saveData();showToast(id?"Video actualizado":"Video agregado");
});
function deleteVideo(id){
  const v=data.find(v=>v.id===id);if(!v)return;
  if(data.length===1){showToast("Tiene que quedar al menos un video");return;}
  if(!confirm(`¿Eliminar “${v.name}” y todos sus planos? Esta acción no se puede deshacer.`))return;
  data=data.filter(x=>x.id!==id);if(activeVideoId===id)activeVideoId=data[0].id;saveData();showToast("Video eliminado");
}
$("reset-button").addEventListener("click",()=>{
  if(confirm("Esto reemplazará todos los videos y planos actuales por los datos iniciales. ¿Querés continuar?")){
    data=clone(seedData);activeVideoId=data[0].id;saveData();showToast("Datos iniciales restaurados");
  }
});
render();
