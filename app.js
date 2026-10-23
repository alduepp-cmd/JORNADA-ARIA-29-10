const STORAGE_KEY = "jornada-aria-v1";
const SUPABASE_URL = "https://zawzmswxunriuzptggjn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable__-LF5x0tfCChEYmcSAXpGQ_fUUo78M7";
let supabaseClient = null;
let remoteReady = false;
let remoteSyncBusy = false;
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
    {id:"c9",category:"PLANOS DE SAAVEDRA",name:"Saavedra: vida de barrio",type:"Plano general",subject:"Calles / árboles / plaza / tren",description:"Calles, árboles, plaza, gente caminando, cielo abierto y tren pasando.",location:"Entorno de ARIA",duration:"5–8 segundos",notes:"Renders solo como anticipación breve."},
    {id:"c10",category:"PLANOS DE OBREROS",name:"Obrero trabajando en plano medio",type:"Plano medio",subject:"Obrero",description:"Mostrar al trabajador concentrado en una tarea real.",location:"Sector de trabajo",duration:"5–8 segundos",notes:"Registrar una toma abierta y otra más cerrada."},
    {id:"c11",category:"PLANOS DE OBREROS",name:"Herramientas en uso",type:"Plano detalle",subject:"Herramientas",description:"Martillo, destornillador, taladro y herramientas disponibles en acción.",location:"Sector de trabajo",duration:"3–5 segundos",notes:"Solo acciones reales y seguras."},
    {id:"c12",category:"PLANOS DE OBREROS",name:"Manos sobre el material",type:"Plano detalle",subject:"Manos / material",description:"Manos tocando, acomodando o trabajando el hormigón y otros materiales.",location:"Interior de obra",duration:"3–5 segundos",notes:"Buscar texturas y movimientos naturales."},
    {id:"c13",category:"PLANOS DE OBREROS",name:"Obrero en contexto de la estructura",type:"Plano general",subject:"Obrero",description:"Trabajador en medio de la estructura para mostrar escala y actividad.",location:"Interior de obra",duration:"5–8 segundos",notes:"Componer con líneas de la arquitectura."},
    {id:"c14",category:"PLANOS DE LA OBRA SOLA",name:"Hormigón y texturas",type:"Plano detalle",subject:"Hormigón",description:"Superficies, marcas, bordes y texturas del hormigón.",location:"Interior de obra",duration:"3–5 segundos",notes:"Variar ángulos y profundidad de campo."},
    {id:"c15",category:"PLANOS DE LA OBRA SOLA",name:"Hierros y armaduras",type:"Plano detalle",subject:"Hierros / estructura",description:"Hierros, varillas y armaduras de la construcción.",location:"Interior de obra",duration:"3–5 segundos",notes:"Buscar líneas gráficas y repetición."},
    {id:"c16",category:"PLANOS DE LA OBRA SOLA",name:"Polvo en contraluz",type:"Plano detalle",subject:"Polvo / luz",description:"Polvo suspendido iluminado por la luz natural.",location:"Interior de obra",duration:"3–5 segundos",notes:"Filmar a contraluz si las condiciones lo permiten."},
    {id:"c17",category:"PLANOS DE LA OBRA SOLA",name:"Reflejo del sol sobre una pared",type:"Plano detalle",subject:"Luz / pared",description:"Reflejo de sol y sombras moviéndose sobre la pared.",location:"Interior de obra",duration:"3–5 segundos",notes:"Toma fija, dejar respirar la imagen."},
    {id:"c18",category:"PLANOS DE LA OBRA SOLA",name:"Planta moviéndose con el viento",type:"Plano detalle",subject:"Planta",description:"Una planta o follaje moviéndose suavemente con el viento.",location:"Exterior / entorno",duration:"3–5 segundos",notes:"Movimiento orgánico, fondo limpio."},
    {id:"c19",category:"PLANOS DE LA OBRA SOLA",name:"Aberturas y líneas de la estructura",type:"Plano general",subject:"Arquitectura",description:"Encuadres limpios de columnas, aberturas y estructura sin personas.",location:"Interior de obra",duration:"5–8 segundos",notes:"Buscar simetrías y profundidad."},
    {id:"c20",category:"PLANOS DE FRAN",name:"Fran llega al acceso",type:"Plano medio",subject:"Fran",description:"Fran llega al acceso de ARIA y entra en la obra.",location:"Acceso",duration:"5–8 segundos",notes:"Registrar entrada completa y detalle de pasos."},
    {id:"c21",category:"PLANOS DE FRAN",name:"Fran observa la obra",type:"Plano medio",subject:"Fran",description:"Fran se detiene y observa el espacio en silencio.",location:"Interior de obra",duration:"5–8 segundos",notes:"Gestualidad natural, sin mirar a cámara."},
    {id:"c22",category:"PLANOS DE FRAN",name:"Fran entre columnas y hormigón",type:"Plano general",subject:"Fran",description:"Fran atraviesa el espacio rodeado por columnas y hormigón.",location:"Interior de obra",duration:"8–12 segundos",notes:"Dejar que el espacio domine el cuadro."},
    {id:"c23",category:"PLANOS DE FRAN",name:"Mano de Fran sobre la baranda",type:"Plano detalle",subject:"Fran / baranda",description:"La mano descansa y se desliza suavemente sobre una baranda o superficie disponible.",location:"Interior de obra",duration:"3–5 segundos",notes:"Priorizar una superficie segura."},
    {id:"c24",category:"PLANOS DE FRAN",name:"Fran mira hacia el exterior desde la obra",type:"Plano general",subject:"Fran / exterior",description:"Fran de espaldas o de perfil mira hacia afuera desde una abertura.",location:"Interior de obra",duration:"8–12 segundos",notes:"Dejar aire y sostener el plano."},
    {id:"c25",category:"PLANOS DE SAAVEDRA",name:"Tren pasando",type:"Plano general",subject:"Tren",description:"Registrar el tren en movimiento como parte del ritmo del barrio.",location:"Saavedra",duration:"5–8 segundos",notes:"Capturar ambiente y movimiento."},
    {id:"c26",category:"PLANOS DE SAAVEDRA",name:"Árboles y cielo abierto",type:"Plano general",subject:"Árboles / cielo",description:"Copas de árboles, hojas y cielo abierto.",location:"Saavedra",duration:"5–8 segundos",notes:"Buscar luz y movimiento del viento."},
    {id:"c27",category:"PLANOS DE SAAVEDRA",name:"Personas caminando",type:"Plano general",subject:"Gente",description:"Personas caminando por las calles del barrio.",location:"Saavedra",duration:"5–8 segundos",notes:"Capturar momentos naturales sin invadir."},
    {id:"c28",category:"PLANOS DE SAAVEDRA",name:"Plaza y espacios verdes",type:"Plano general",subject:"Plaza",description:"Planos de la plaza y sus espacios verdes.",location:"Saavedra",duration:"5–8 segundos",notes:"Mezclar plano general y detalles."},
    {id:"c29",category:"PLANOS DE SAAVEDRA",name:"Calles y movimiento del barrio",type:"Plano general",subject:"Calles / barrio",description:"Calles, veredas y movimiento cotidiano de Saavedra.",location:"Saavedra",duration:"5–8 segundos",notes:"Registrar variedad de encuadres."}
  ]},
  {id:"reel1",name:"REEL 1",subtitle:"REEL",description:"Hooks, desarrollo y cierres para testear.",plans:[],checklist:[{"id":"reel1-item1","label":"HOOK 1","text":"Con un anticipo del 30% podés ingresar a un proyecto en una de las mejores zonas de Buenos Aires.","done":false},{"id":"reel1-item2","label":"HOOK 2","text":"¿Estás buscando una oportunidad en Saavedra? Acompañame a recorrer este nuevo desarrollo.","done":false},{"id":"reel1-item3","label":"DESARROLLO 1","text":"ARIA es un proyecto en Saavedra, con unidades de 1 y 2 ambientes, espacios exteriores, amenities y una propuesta pensada para vivir, invertir y disfrutar. Un proyecto que ya completó su estructura y avanza hacia las próximas etapas de construcción. Con entrega en 2027.","done":false},{"id":"reel1-item4","label":"CIERRE 2","text":"¿Te interesa esta oportunidad? Consultanos por las unidades disponibles.","done":false},{"id":"reel1-item5","label":"CIERRE 3","text":"Ingresá en la mejor etapa del proyecto. Escribinos y recibí toda la información.","done":false},{"id":"reel1-item6","label":"HOOK 3","text":"¿Querés saber por qué esta es la mejor etapa para ingresar a un desarrollo?","done":false},{"id":"reel1-item7","label":"DESARROLLO 2 (HOOK 3)","text":"Porque todavía llegás a un precio de obra, bastante lejos de lo que va a valer terminado, pero ya podés ver que el proyecto es real y que la obra avanza. Llegás temprano, pero con la seguridad de que ARIA ya está tomando forma.","done":false}]},
  {id:"reel2",name:"REEL 2",subtitle:"REEL",description:"Hooks, desarrollo y cierres para testear.",plans:[],checklist:[{"id":"reel2-item1","label":"HOOK 1","text":"Arranca directo con el desarrollo.","done":false},{"id":"reel2-item2","label":"HOOK 2","text":"Si estás buscando dónde vivir en Buenos Aires, mirá esto.","done":false},{"id":"reel2-item3","label":"HOOK 3","text":"Esta va a ser tu vista todos los días.","done":false},{"id":"reel2-item4","label":"DESARROLLO","text":"Saavedra es calma, conectividad, verde, espacios para salir a caminar y todo lo que necesitás en tu día a día. En ese contexto, se implanta ARIA. Un proyecto de 1 y 2 ambientes, apto profesional, con amenities y unidades con grandes terrazas. Un lugar para vivir la ciudad, pero a tu manera. Contamos con financiación hasta la entrega del proyecto. Entrá desde 80.300 USD.","done":false},{"id":"reel2-item5","label":"CIERRE 1","text":"Esto es Saavedra. Esto es ARIA. Escribinos y conocé el proyecto.","done":false},{"id":"reel2-item6","label":"CIERRE 2","text":"¿Te mudarías a Saavedra? Escribinos y te contamos todo sobre ARIA.","done":false},{"id":"reel2-item7","label":"CIERRE 3","text":"Si querés vivir o invertir en una de las mejores zonas de Buenos Aires, consultá las unidades disponibles.","done":false}]},
  {id:"reel3",name:"REEL 3",subtitle:"REEL",description:"Hooks, desarrollo y cierres para testear.",plans:[],checklist:[{"id":"reel3-item1","label":"HOOK 1","text":"No especificado en el documento.","done":false},{"id":"reel3-item2","label":"HOOK 2","text":"¿Qué pasa cuando comprás un departamento mientras todavía está en construcción?","done":false},{"id":"reel3-item3","label":"HOOK 3","text":"Ya sé que viste muchos desarrollos, pero esta es una oportunidad que no te vas a querer perder.","done":false},{"id":"reel3-item4","label":"DESARROLLO","text":"Departamentos de 1 y 2 ambientes, grandes terrazas, amenities y una ubicación en Saavedra que tiene cada vez más movimiento. ¿Lo mejor? Podés comprar desde ahora, con anticipo + cuotas, y la entrega está prevista para 2027. No te cuelgues, que ya quedan pocas unidades.","done":false},{"id":"reel3-item5","label":"CIERRE 1","text":"Escribinos para más información.","done":false},{"id":"reel3-item6","label":"CIERRE 2","text":"ARIA, en Saavedra. Con entrega 2027. Escribinos y te contamos más.","done":false},{"id":"reel3-item7","label":"CIERRE 3","text":"¿Querés conocer las unidades disponibles? Escribinos.","done":false}]},
  {id:"reel4",name:"REEL 4",subtitle:"REEL",description:"Video POV desde la cámara; Aldu agrega los textos en edición.",plans:[],checklist:[{"id":"reel4-item1","label":"HOOK 1","text":"POV: me dejaron entrar a ARIA antes que esté terminado.","done":false},{"id":"reel4-item2","label":"HOOK 2","text":"POV: vine a ver qué están construyendo acá.","done":false},{"id":"reel4-item3","label":"HOOK 3","text":"POV: así se ve ARIA antes de ser ARIA.","done":false},{"id":"reel4-item4","label":"TEXTO / DESARROLLO","text":"Así se ve un departamento antes de convertirse en tu casa.","done":false}]}
];
let data = loadData();
let activeVideoId = data[0]?.id;
let activeCineCategory = "PLANOS DE OBREROS";
let activePage = "overview";
let toastTimer;
const $ = id => document.getElementById(id);
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function clone(value){ return JSON.parse(JSON.stringify(value)); }
function loadData(){
  try {
    const saved=localStorage.getItem(STORAGE_KEY);
    if(saved){
      const parsed=JSON.parse(saved);
      if(Array.isArray(parsed)&&parsed.length){
        return parsed.map(v=>{
          const defaults=seedData.find(s=>s.id===v.id);
          if(!defaults)return v;
          const known=new Set((v.plans||[]).map(p=>p.id));
          v.plans=v.plans||[];
          (defaults.plans||[]).forEach(p=>{if(!known.has(p.id))v.plans.push(clone(p));});
          if(defaults.checklist){
            const existing=v.checklist||[];
            v.checklist=defaults.checklist.map(def=>{
              const savedItem=existing.find(x=>x.id===def.id);
              return savedItem?{...savedItem,label:def.label,text:def.text}:{...clone(def)};
            });
          }
          return v;
        });
      }
    }
  } catch(e){}
  return clone(seedData);
}
function saveData(message="Cambios guardados en este dispositivo"){
  try { localStorage.setItem(STORAGE_KEY,JSON.stringify(data)); $("save-status").textContent=remoteReady?"Cambios sincronizados para el equipo":message; }
  catch(e){ $("save-status").textContent="No se pudo guardar en este navegador"; showToast("No se pudo guardar. Revisá el almacenamiento del navegador."); }
  if(remoteReady) syncChecklistToRemote();
  render();
}
function checklistRows(){
  return data.flatMap(v=>[
    ...(v.plans||[]).map(p=>({id:p.id,done:!!p.done,updated_at:new Date().toISOString()})),
    ...(v.checklist||[]).map(c=>({id:c.id,done:!!c.done,updated_at:new Date().toISOString()}))
  ]);
}
function applyRemoteRows(rows){
  const states=new Map((rows||[]).map(r=>[r.id,!!r.done]));
  data.forEach(v=>{
    (v.plans||[]).forEach(p=>{if(states.has(p.id))p.done=states.get(p.id);});
    (v.checklist||[]).forEach(c=>{if(states.has(c.id))c.done=states.get(c.id);});
  });
}
async function syncChecklistToRemote(){
  if(!supabaseClient||!remoteReady||remoteSyncBusy)return;
  remoteSyncBusy=true;
  try{
    const {error}=await supabaseClient.from("jornada_checklist").upsert(checklistRows(),{onConflict:"id"});
    if(error)throw error;
    $("save-status").textContent="Cambios sincronizados para el equipo";
  }catch(e){
    $("save-status").textContent="Guardado local · falta configurar permisos de sincronización";
    console.error("Supabase sync error:",e.message||e);
  }finally{remoteSyncBusy=false;}
}
async function initializeSharedChecklist(){
  if(!window.supabase||!window.supabase.createClient)return;
  supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
  $("save-status").textContent="Conectando guardado compartido…";
  try{
    const {data:remoteRows,error}=await supabaseClient.from("jornada_checklist").select("id,done");
    if(error)throw error;
    if(remoteRows&&remoteRows.length){
      applyRemoteRows(remoteRows);
    }else{
      const {error:seedError}=await supabaseClient.from("jornada_checklist").upsert(checklistRows(),{onConflict:"id"});
      if(seedError)throw seedError;
    }
    remoteReady=true;
    localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
    $("save-status").textContent="Checklist compartido activo";
    render();
    supabaseClient.channel("jornada-checklist-live")
      .on("postgres_changes",{event:"*",schema:"public",table:"jornada_checklist"},payload=>{
        const row=payload.new;
        if(!row||!row.id)return;
        data.forEach(v=>{
          (v.plans||[]).forEach(p=>{if(p.id===row.id)p.done=!!row.done;});
          (v.checklist||[]).forEach(c=>{if(c.id===row.id)c.done=!!row.done;});
        });
        localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
        $("save-status").textContent="Checklist compartido activo";
        render();
      }).subscribe();
  }catch(e){
    remoteReady=false;
    $("save-status").textContent="Guardado local · revisar configuración de Supabase";
    console.error("Supabase initialization error:",e.message||e);
  }
}
function showToast(message){ const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2300); }
function activeVideo(){ return data.find(v=>v.id===activeVideoId)||data[0]; }
function allPlans(){ return data.flatMap(v=>v.plans||[]); }
function render(){
  if(!data.length){data=clone(seedData);activeVideoId=data[0].id;}
  if(!data.some(v=>v.id===activeVideoId)) activeVideoId=data[0].id;
  renderNav(); if(activePage==="overview")renderOverviewPage();else if(activePage==="pending")renderPendingPage();else if(activePage==="schedule")renderSchedulePage();else if(activePage==="aldu")renderAlduPage();else renderContent(); renderProgress();
}
function renderIntroPage(){
  const content=`
    <div class="video-header intro-header">
      <div class="video-kicker">JORNADA ARIA · 29 OCTUBRE · SAAVEDRA</div>
      <h2>La idea de la jornada</h2>
      <p class="video-desc">Una jornada de producción para generar contenido audiovisual de ARIA, combinando una pieza cinematográfica que muestre la obra y su identidad con reels pensados para comunicar el proyecto desde distintos ángulos.</p>
    </div>
    <section class="intro-section">
      <div class="intro-number">01</div>
      <div><span class="intro-label">PIEZA PRINCIPAL</span><h3>Un video horizontal, estilo cine</h3><p>Una pieza audiovisual más sensorial y cinematográfica. Vamos a combinar planos de los obreros trabajando, detalles de la obra, Fran recorriendo el espacio y escenas del barrio de Saavedra. La idea es transmitir la materialidad, la escala y la transformación de ARIA, mostrando la obra real y anticipando lo que va a ser.</p></div>
    </section>
    <section class="intro-section">
      <div class="intro-number">02</div>
      <div><span class="intro-label">CONTENIDO PARA REDES</span><h3>Cuatro reels con distintas versiones</h3><p>Además, vamos a grabar cuatro reels verticales. Para algunos vamos a registrar diferentes hooks de entrada y cierres/CTAs, así después podemos probar distintas combinaciones en edición y elegir las versiones que mejor funcionen.</p>
      <ul class="intro-list"><li><strong>Reel 1:</strong> oportunidad de inversión y etapa de obra.</li><li><strong>Reel 2:</strong> Saavedra, estilo de vida y propuesta de ARIA.</li><li><strong>Reel 3:</strong> comprar durante la construcción y oportunidad de ingreso.</li><li><strong>Reel 4:</strong> recorrido POV por la obra, con textos agregados en edición.</li></ul></div>
    </section>
    <section class="intro-total">
      <div><span class="intro-label">ENTREGABLES BASE</span><h3>5 piezas principales</h3><p>1 video horizontal cinematográfico + 4 reels verticales.</p><small>Las variaciones de hooks y CTAs permiten armar versiones adicionales de los reels. La cantidad final de cortes dependerá de las combinaciones que se seleccionen en edición.</small></div>
      <div class="intro-total-count"><strong>5</strong><span>PIEZAS BASE</span></div>
    </section>
    <p class="footer-note">Esta web reúne el desglose de planos, las versiones de guion, los pendientes y el cronograma para seguir el rodaje en un solo lugar.</p>
  `;
  $("video-content").innerHTML=content;
}
function getPendingItems(){
  const items=[];
  data.forEach(v=>{
    (v.plans||[]).forEach(p=>{if(!p.done)items.push({kind:"plan",id:p.id,video:v.name,label:p.name,detail:p.category||p.type||"Plano"});});
    (v.checklist||[]).forEach(c=>{if(!c.done)items.push({kind:"check",id:c.id,video:v.name,label:c.label,detail:c.text});});
  });
  return items;
}
function getPendingCount(){return getPendingItems().length;}
function renderOverviewPage(){
  const content=`
    <div class="video-header overview-hero">
      <div class="video-kicker">JORNADA ARIA · 29 OCTUBRE</div>
      <h2>La idea de la jornada</h2>
      <p class="video-desc">Una jornada de producción para generar contenido audiovisual de ARIA, combinando una pieza cinematográfica horizontal con cuatro reels verticales pensados para redes.</p>
    </div>
    <section class="overview-section">
      <div class="overview-number">01</div>
      <div class="overview-copy">
        <div class="video-kicker">PIEZA PRINCIPAL · HORIZONTAL</div>
        <h3>Un video tipo cine</h3>
        <p>Construir una pieza audiovisual más sensorial y cinematográfica que muestre la obra en su estado actual, el trabajo de los obreros, la arquitectura y a Fran recorriendo el espacio. La idea es transmitir la materialidad, la luz, la escala y el proceso de construcción de ARIA.</p>
        <div class="overview-tags"><span>Formato horizontal</span><span>Estética cinematográfica</span><span>Obra + protagonista + barrio</span></div>
      </div>
    </section>
    <section class="overview-section">
      <div class="overview-number">02</div>
      <div class="overview-copy">
        <div class="video-kicker">CONTENIDO PARA REDES · VERTICAL</div>
        <h3>Cuatro reels con distintas versiones</h3>
        <p>Grabar cuatro piezas verticales para redes. En los reels con guion, vamos a registrar distintas versiones de hooks y CTAs para poder probar diferentes formas de abrir y cerrar cada video en edición.</p>
        <div class="overview-reels">
          <article><span>REEL 01</span><strong>Oportunidad de inversión</strong><small>Variaciones de hook, desarrollo y cierre.</small></article>
          <article><span>REEL 02</span><strong>Saavedra y estilo de vida</strong><small>Variaciones de hook y CTA para presentar el barrio y el proyecto.</small></article>
          <article><span>REEL 03</span><strong>Comprar en construcción</strong><small>Variaciones de hook y CTA alrededor de la oportunidad de ingresar en esta etapa.</small></article>
          <article><span>REEL 04</span><strong>POV de la obra</strong><small>Recorrido en vertical desde la mirada de quien entra a conocer ARIA antes de que esté terminado.</small></article>
        </div>
      </div>
    </section>
    <section class="overview-section overview-final">
      <div class="overview-number">03</div>
      <div class="overview-copy">
        <div class="video-kicker">OBJETIVO DE LA JORNADA</div>
        <h3>Dejar material para editar y testear</h3>
        <p>Además de cubrir los planos de la pieza cinematográfica, buscamos llevarnos opciones de apertura y cierre para los reels. Así podemos elegir en edición las combinaciones que mejor funcionen para cada objetivo.</p>
      </div>
    </section>
    <p class="footer-note">Usá las pestañas de la izquierda para consultar el desglose de planos, revisar los guiones, ver los horarios y marcar lo que ya se grabó.</p>`;
  $("video-content").innerHTML=content;
}
function renderPendingPage(){
  const pendingPlans=[];
  const pendingChecks=[];
  data.forEach(v=>{
    (v.plans||[]).filter(p=>!p.done).forEach(p=>pendingPlans.push({kind:"plan",id:p.id,video:v.name,videoId:v.id,label:p.name,detail:p.category||p.type||"Plano"}));
    (v.checklist||[]).filter(c=>!c.done).forEach(c=>pendingChecks.push({kind:"check",id:c.id,video:v.name,videoId:v.id,label:c.label,detail:c.text}));
  });
  const total=pendingPlans.length+pendingChecks.length;
  let content="<div class=\"video-header\"><div class=\"video-kicker\">CONTROL DE PRODUCCIÓN</div><h2>Lo que falta</h2><p class=\"video-desc\">Desglose de todo lo pendiente, organizado como en cada pestaña. Al marcar algo como grabado o listo, desaparece de esta lista.</p><div class=\"video-meta\"><span class=\"meta-chip\">"+total+" pendientes</span><span class=\"meta-chip\">"+pendingPlans.length+" planos</span><span class=\"meta-chip\">"+pendingChecks.length+" items de reels</span></div></div>";
  data.forEach(v=>{
    const vp=pendingPlans.filter(p=>p.videoId===v.id);
    const vc=pendingChecks.filter(c=>c.videoId===v.id);
    if(!vp.length&&!vc.length)return;
    content+="<section class=\"pending-video-section\"><div class=\"pending-video-heading\"><h3>"+esc(v.name)+"</h3><span>"+(vp.length+vc.length)+" pendientes</span></div>";
    if(vp.length){
      if(v.id==="cine"){
        const cats=["PLANOS DE OBREROS","PLANOS DE LA OBRA SOLA","PLANOS DE FRAN","PLANOS DE SAAVEDRA"];
        cats.forEach(cat=>{
          const group=vp.filter(p=>p.detail===cat);
          if(!group.length)return;
          content+="<div class=\"pending-group\"><h4>"+esc(cat)+" <small>"+group.length+"</small></h4><div class=\"pending-list\">"+group.map(item=>pendingItemMarkup(item)).join("")+"</div></div>";
        });
        const uncategorized=vp.filter(p=>!cats.includes(p.detail));
        if(uncategorized.length)content+="<div class=\"pending-group\"><h4>OTROS PLANOS</h4><div class=\"pending-list\">"+uncategorized.map(item=>pendingItemMarkup(item)).join("")+"</div></div>";
      } else {
        content+="<div class=\"pending-group\"><h4>PLANOS POR GRABAR <small>"+vp.length+"</small></h4><div class=\"pending-list\">"+vp.map(item=>pendingItemMarkup(item)).join("")+"</div></div>";
      }
    }
    if(vc.length)content+="<div class=\"pending-group\"><h4>GUION Y VERSIONES <small>"+vc.length+"</small></h4><div class=\"pending-list\">"+vc.map(item=>pendingItemMarkup(item)).join("")+"</div></div>";
    content+="</section>";
  });
  if(!total)content+="<div class=\"empty-state\"><strong>¡Todo listo!</strong><p>No quedan planos ni elementos pendientes por marcar.</p></div>";
  content+="<p class=\"footer-note\">Los cambios se guardan automáticamente en este navegador.</p>";
  $("video-content").innerHTML=content;
  document.querySelectorAll("[data-pending-kind]").forEach(input=>input.addEventListener("change",()=>{
    const id=input.dataset.pendingId;
    if(input.dataset.pendingKind==="plan"){const p=findPlan(id);if(p)p.done=input.checked;}
    else {data.forEach(v=>(v.checklist||[]).forEach(c=>{if(c.id===id)c.done=input.checked;}));}
    saveData();
  }));
}
function pendingItemMarkup(item){
  return "<label class=\"pending-item\"><input type=\"checkbox\" data-pending-kind=\""+item.kind+"\" data-pending-id=\""+esc(item.id)+"\"><span class=\"pending-copy\"><strong>"+esc(item.label)+"</strong>"+(item.kind==="plan"?"<small>"+esc(item.detail)+"</small>":"<small>"+esc(item.detail)+"</small>")+"</span></label>";
}
function renderAlduPage(){
  const editItems=[];
  data.forEach(v=>{
    (v.checklist||[]).forEach(c=>{
      if(/HOOK|CIERRE|CTA|TEXTO/i.test(c.label||"")){
        editItems.push({id:"edit-"+c.id,videoId:v.id,video:v.name,label:c.label,text:c.text,done:!!(data.find(x=>x.id==="aldu")?.checklist||[]).find(x=>x.id==="edit-"+c.id)?.done});
      }
    });
  });
  const done=editItems.filter(x=>x.done).length;
  let content=`<div class="video-header"><div class="video-kicker">POSTPRODUCCIÓN · USO PERSONAL</div><h2>Mi edición</h2><p class="video-desc">Checklist personal de Aldu para organizar la postproducción. Estos checks son independientes del rodaje y de los checklist de los reels.</p><div class="video-meta"><span class="meta-chip">${done}/${editItems.length} versiones listas</span><span class="meta-chip">${editItems.length-done} pendientes</span></div></div>`;
  data.forEach(v=>{
    const items=editItems.filter(x=>x.videoId===v.id);
    if(!items.length)return;
    content+=`<section class="aldu-section"><div class="checklist-heading"><h3>${esc(v.name)}</h3><span>${items.filter(x=>x.done).length}/${items.length} listos</span></div><div class="content-checklist">`;
    content+=items.map(item=>`<label class="content-item ${item.done?"checked":""}"><input type="checkbox" data-aldu-item="${esc(item.id)}" ${item.done?"checked":""}><span class="content-item-copy"><strong>${esc(v.name)} · ${esc(item.label)}</strong><span>${esc(item.text)}</span></span></label>`).join("");
    content+=`</div></section>`;
  });
  if(!editItems.length)content+=`<div class="empty-state"><strong>No hay versiones todavía</strong><p>Agregá hooks o cierres en las pestañas de los reels y van a aparecer acá.</p></div>`;
  content+=`<p class="footer-note">Este checklist es solo para tu postproducción y no modifica el estado de grabación de los otros videos.</p>`;
  $("video-content").innerHTML=content;
  document.querySelectorAll("[data-aldu-item]").forEach(input=>input.addEventListener("change",()=>{
    const id=input.dataset.alduItem;
    let aldu=data.find(v=>v.id==="aldu");
    if(!aldu){aldu={id:"aldu",name:"ALDU · MI EDICIÓN",subtitle:"POSTPRODUCCIÓN",description:"Checklist personal de edición.",plans:[],checklist:[]};data.push(aldu);}
    let task=aldu.checklist.find(x=>x.id===id);
    if(!task){const sourceId=id.replace(/^edit-/,"");let source=null;for(const v of data){source=(v.checklist||[]).find(c=>c.id===sourceId);if(source)break;}task={id,label:source?.label||"Versión",text:source?.text||"",done:false};aldu.checklist.push(task);}
    task.done=input.checked;
    saveData();
  }));
}
function renderSchedulePage(){
  const slots=[
    {time:"13:00",title:"Arranque · VIDEO 1 — CINE",desc:"Comenzar el rodaje del video cinematográfico.",duration:"1 hora",note:"Objetivo: terminar aproximadamente a las 14:00."},
    {time:"14:00",title:"Inserts en vertical",desc:"Grabar inserts en formato vertical para los reels.",duration:"En paralelo",note:"Se pueden grabar al mismo tiempo que VIDEO 1 si la producción lo permite."},
    {time:"14:30",title:"Fran hablando a cámara",desc:"Grabar a Fran hablando: hooks, desarrollos y cierres de los reels.",duration:"A continuación",note:"Tener los textos preparados y registrar cada versión por separado."}
  ];
  let content="<div class=\"video-header\"><div class=\"video-kicker\">JORNADA ARIA · 29 OCTUBRE</div><h2>Horarios</h2><p class=\"video-desc\">Cronograma base de la jornada de rodaje.</p></div><div class=\"schedule-list\">";
  content+=slots.map((s,i)=>"<article class=\"schedule-item\"><div class=\"schedule-time\">"+s.time+"</div><div class=\"schedule-marker\">"+(i+1)+"</div><div class=\"schedule-copy\"><h3>"+s.title+"</h3><p>"+s.desc+"</p><div class=\"schedule-meta\"><span>"+s.duration+"</span></div><small>"+s.note+"</small></div></article>").join("");
  content+="</div><p class=\"footer-note\">Horarios orientativos; los inserts pueden adelantarse o hacerse en paralelo con VIDEO 1.</p>";
  $("video-content").innerHTML=content;
}

function renderNav(){
  const nav=$("video-nav");
  nav.innerHTML=`<button class="nav-item ${activePage==="overview"?"active":""}" data-page="overview"><span class="nav-number">A</span><span class="nav-copy"><strong>Idea de la jornada</strong><small>Objetivo y contenido</small></span></button><button class="nav-item ${activePage==="aldu"?"active":""}" data-page="aldu"><span class="nav-number">✂</span><span class="nav-copy"><strong>Aldu · Mi edición</strong><small>Versiones por editar</small></span></button><button class="nav-item ${activePage==="pending"?"active":""}" data-page="pending"><span class="nav-number">✓</span><span class="nav-copy"><strong>Lo que falta</strong><small>Pendientes por completar</small></span><span class="nav-check">${getPendingCount()}</span></button><button class="nav-item ${activePage==="schedule"?"active":""}" data-page="schedule"><span class="nav-number">◷</span><span class="nav-copy"><strong>Horarios</strong><small>Plan del rodaje</small></span></button>` + data.map((v,i)=>{
    const plans=v.plans||[], done=plans.filter(p=>p.done).length, complete=plans.length>0&&done===plans.length;
    return `<button class="nav-item ${activePage==="videos"&&v.id===activeVideoId?"active":""}" data-video="${esc(v.id)}">
      <span class="nav-number">${String(i+1).padStart(2,"0")}</span>
      <span class="nav-copy"><strong>${esc(v.name)}</strong><small>${esc(v.subtitle||"VIDEO")} · ${done}/${plans.length} planos</small></span>
      <span class="nav-check">${complete?"✓":""}</span>
    </button>`;
  }).join("") + `<button id="add-video-nav" class="nav-item"><span class="nav-number">＋</span><span class="nav-copy"><strong>Agregar video</strong><small>Crear otra pestaña</small></span></button>`;
  nav.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>{activePage=b.dataset.page;render();}));
  nav.querySelectorAll("[data-video]").forEach(b=>b.addEventListener("click",()=>{activePage="videos";activeVideoId=b.dataset.video;render();}));
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
  const checklist=v.checklist||[];
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
    ${!isCine&&checklist.length?`<section class="checklist-section"><div class="checklist-heading"><h3>Guion y versiones para testear</h3><span>${checklist.filter(x=>x.done).length}/${checklist.length} completados</span></div><div class="content-checklist">${checklist.map(item=>`<label class="content-item ${item.done?"checked":""}"><input type="checkbox" data-check-item="${esc(item.id)}" ${item.done?"checked":""}><span class="content-item-copy"><strong>${esc(item.label)}</strong><span>${esc(item.text)}</span></span></label>`).join("")}</div></section>`:""}
    <div class="shot-toolbar"><h3>${isCine?esc(activeCineCategory):"Desglose de planos"}</h3><span>Marcá ✓ cuando esté grabado</span></div>
    <div class="shot-list">${plans.length?plans.map((p,i)=>shotCard(p,i)).join(""):`<div class="empty-state"><strong>Todavía no hay planos</strong><p>Agregá el primer plano para empezar a organizar este video.</p></div>`}</div>
    <div class="bottom-add"><button id="add-plan" class="add-wide">＋ Agregar un plano</button></div>
    <p class="footer-note">Los cambios se guardan automáticamente en este navegador.</p>`;
  $("edit-video").addEventListener("click",()=>openVideoDialog(v));
  $("delete-video").addEventListener("click",()=>deleteVideo(v.id));
  $("add-plan").addEventListener("click",()=>openPlanDialog());
  document.querySelectorAll("[data-check-item]").forEach(input=>input.addEventListener("change",()=>{const item=(activeVideo().checklist||[]).find(x=>x.id===input.dataset.checkItem);if(item){item.done=input.checked;saveData();}}));
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
initializeSharedChecklist();
