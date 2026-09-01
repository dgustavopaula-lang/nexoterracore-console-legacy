const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const state = {
  view: "painel",
  imoveis: [],
  selectedProperty: null,
  cp: {
    organizacao: "—",
    apiKeys: 0,
    scopes: "—",
    rateLimit: "—",
    consumo: 0,
    consumo24h: 0
  }
};

const titles = {
  "painel":"Painel",
  "imoveis":"Imóveis",
  "fazendas":"Fazendas",
  "armazens":"Armazéns e Silos",
  "proprietarios":"Proprietários",
  "patrimonio":"Patrimônio",
  "matriculas":"Matrículas",
  "alugueis":"Aluguéis",
  "financeiro":"Financeiro",
  "control-plane":"Control Plane",
  "geo":"Geo-referência",
  "arquitetura":"Arquitetura / API",
  "banco":"Banco de Dados",
  "logs":"Logs / VS Code",
  "picpay":"PicPay",
  "usuarios":"Usuários & Permissões",
  "seguranca":"Segurança",
  "backup":"Backup"
};

async function api(url){
  const res = await fetch(url);
  if(!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function loadInitialData(){
  try {
    const health = await api("/api/health");
    $("#dbStatus").textContent = `db: ${health.database} · ${health.status}`;
  } catch {
    $("#dbStatus").textContent = "db: modo estático local";
  }

  try {
    state.imoveis = await api("/api/imoveis");
  } catch {
    try {
      state.imoveis = await api("./data/imoveis.json");
    } catch {
      state.imoveis = [];
    }
  }

  try {
    const cp = await api("/api/control-plane");
    state.cp = {
      organizacao: cp.organizacao || state.cp.organizacao,
      apiKeys: cp.apiKeys ?? state.cp.apiKeys,
      scopes: cp.scopes || state.cp.scopes,
      rateLimit: cp.rateLimit || state.cp.rateLimit,
      consumo: cp.consumo ?? state.cp.consumo,
      consumo24h: cp.consumo24h ?? state.cp.consumo24h
    };
  } catch {}

  syncSidebarCp();
  render();
}

function syncSidebarCp(){
  $("#cpOrgSide").textContent = state.cp.organizacao;
  $("#cpKeysSide").textContent = state.cp.apiKeys;
  $("#cp24Side").textContent = state.cp.consumo24h;
}

function setView(view){
  state.view = view;
  $$(".nav-item[data-view]").forEach(el => el.classList.toggle("active", el.dataset.view === view));
  $("#breadcrumb").textContent = view;
  $("#pageTitle").textContent = titles[view] || view;
  $("#primaryBtn").textContent = view === "imoveis" ? "Novo imóvel" : "Novo registro";
  render();
}

function panelShell(kicker, title, text, side=""){
  return `
    <div class="page">
      <section class="hero">
        <div>
          <span class="kicker">${kicker}</span>
          <h2>${title}</h2>
          <p>${text}</p>
        </div>
        ${side}
      </section>
    </div>`;
}

function renderPainel(){
  const total = state.imoveis.length;
  return `
    <div class="page">
      <section class="hero">
        <div>
          <span class="kicker">Core operacional</span>
          <h2>NexoTerraCore Console</h2>
          <p>Um console técnico para patrimônio, agro, georreferenciamento, APIs e governança.</p>
        </div>
        <div class="hero-side">
          <div class="hero-chip"><span>Ambiente</span><strong>PRODUÇÃO</strong></div>
          <div class="hero-chip"><span>Banco</span><strong>A CONECTAR</strong></div>
        </div>
      </section>

      <section class="cards">
        <article class="card accent"><span class="label">Imóveis</span><strong class="value">${total}</strong><span class="meta">registros</span></article>
        <article class="card"><span class="label">Fazendas</span><strong class="value">0</strong><span class="meta">cadastros</span></article>
        <article class="card"><span class="label">Armazenagem</span><strong class="value">0</strong><span class="meta">toneladas</span></article>
        <article class="card"><span class="label">API 24h</span><strong class="value">${state.cp.consumo24h}</strong><span class="meta">requisições</span></article>
      </section>

      <section class="panel">
        <div class="panel-head">
          <div><span class="kicker">Últimos registros</span><h3>Ativos em destaque</h3></div>
          <div class="tools"><button class="action-btn" data-view-jump="imoveis">Ver imóveis</button></div>
        </div>
        <div class="table-wrap">${propertyTable(state.imoveis.slice(0,5))}</div>
      </section>
    </div>`;
}

function propertyTable(items){
  if(!items.length) return `<div class="empty">Nenhum imóvel cadastrado.</div>`;
  return `
    <table>
      <thead><tr><th>Imóvel</th><th>Tipo</th><th>Local</th><th>Área</th><th>Matrícula</th><th>Status</th><th>Ação</th></tr></thead>
      <tbody>
        ${items.map(i => `
          <tr>
            <td><strong>${i.nome}</strong></td>
            <td>${i.tipo}</td>
            <td>${i.cidade} / ${i.uf}</td>
            <td>${Number(i.area || 0).toLocaleString("pt-BR")} m²</td>
            <td><code>${i.matricula || "—"}</code></td>
            <td><span class="status"><i></i>${i.status}</span></td>
            <td><button class="action-btn" data-property="${i.id}">Abrir</button></td>
          </tr>`).join("")}
      </tbody>
    </table>`;
}

function renderImoveis(){
  if(state.selectedProperty){
    const i = state.imoveis.find(x => String(x.id) === String(state.selectedProperty));
    if(i) return renderPropertyDetail(i);
    state.selectedProperty = null;
  }

  return `
    <div class="page">
      <section class="hero">
        <div>
          <span class="kicker">Patrimônio / ativos</span>
          <h2>Imóveis</h2>
          <p>Área de trabalho para cadastro, documentos, fotos, georreferenciamento, avaliação, histórico e integração com a API.</p>
        </div>
        <div class="hero-side">
          <div class="hero-chip"><span>Total</span><strong>${state.imoveis.length}</strong></div>
        </div>
      </section>

      <section class="cards">
        <article class="card accent"><span class="label">Ativos</span><strong class="value">${state.imoveis.filter(x=>x.status==="Ativo").length}</strong><span class="meta">imóveis</span></article>
        <article class="card"><span class="label">Em análise</span><strong class="value">${state.imoveis.filter(x=>x.status==="Em análise").length}</strong><span class="meta">imóveis</span></article>
        <article class="card"><span class="label">Documentos</span><strong class="value">0</strong><span class="meta">pendências</span></article>
        <article class="card"><span class="label">Geo</span><strong class="value">0</strong><span class="meta">pontos conectados</span></article>
      </section>

      <section class="panel">
        <div class="panel-head">
          <div><span class="kicker">Cadastro</span><h3>Lista de imóveis</h3></div>
          <div class="tools">
            <button class="action-btn" id="exportBtn">Exportar JSON</button>
            <button class="action-btn" id="openNewBtn">Novo imóvel</button>
          </div>
        </div>
        <div class="table-wrap">${propertyTable(state.imoveis)}</div>
      </section>
    </div>`;
}

function renderPropertyDetail(i){
  return `
    <div class="page">
      <section class="hero">
        <div>
          <span class="kicker">Imóvel / ficha técnica</span>
          <h2>${i.nome}</h2>
          <p>${i.tipo} · ${i.cidade}/${i.uf} · ${Number(i.area || 0).toLocaleString("pt-BR")} m²</p>
        </div>
        <div class="hero-side">
          <div class="hero-chip"><span>Status</span><strong>${String(i.status).toUpperCase()}</strong></div>
          <div class="hero-chip"><span>Matrícula</span><strong>${i.matricula || "—"}</strong></div>
        </div>
      </section>

      <div class="property-layout">
        <section class="panel" style="margin-top:0">
          <div class="tabs">
            <button class="tab active">Resumo</button>
            <button class="tab">Documentos</button>
            <button class="tab">Fotos</button>
            <button class="tab">Geo</button>
            <button class="tab">Avaliação</button>
            <button class="tab">Histórico</button>
          </div>
          <div class="detail-grid">
            <div class="field"><span>Nome</span><strong>${i.nome}</strong></div>
            <div class="field"><span>Tipo</span><strong>${i.tipo}</strong></div>
            <div class="field"><span>Cidade / UF</span><strong>${i.cidade} / ${i.uf}</strong></div>
            <div class="field"><span>Área</span><strong>${Number(i.area || 0).toLocaleString("pt-BR")} m²</strong></div>
            <div class="field"><span>Matrícula</span><strong>${i.matricula || "—"}</strong></div>
            <div class="field"><span>Valor</span><strong>R$ ${Number(i.valor || 0).toLocaleString("pt-BR",{minimumFractionDigits:2})}</strong></div>
          </div>
        </section>

        <aside class="side-stack">
          <section class="panel" style="margin-top:0">
            <div class="panel-head"><div><span class="kicker">Mídia</span><h3>Imagem principal</h3></div></div>
            <div class="note"><div class="photo-box">Área reservada para foto do imóvel.<br>Adicionar depois sem alterar a arquitetura.</div></div>
          </section>
          <section class="panel" style="margin-top:0">
            <div class="panel-head"><div><span class="kicker">Ações</span><h3>Próximas etapas</h3></div></div>
            <div class="note">
              1. Validar dados reais.<br>
              2. Conectar API.<br>
              3. Vincular documentos.<br>
              4. Vincular georreferenciamento.<br>
              5. Publicar página de venda quando aprovado.
            </div>
          </section>
          <button class="btn ghost" id="backProperties">Voltar para imóveis</button>
        </aside>
      </div>
    </div>`;
}

function renderControlPlane(){
  return `
    <div class="page">
      <section class="hero">
        <div>
          <span class="kicker">API Control Plane</span>
          <h2>Governança do Core</h2>
          <p>Identidade, segurança, scopes, consumo e integração da organização.</p>
        </div>
        <div class="hero-side"><div class="hero-chip"><span>Organização</span><strong>${state.cp.organizacao}</strong></div></div>
      </section>
      <section class="cards">
        <article class="card"><span class="label">API Keys</span><strong class="value">${state.cp.apiKeys}</strong><span class="meta">ativas</span></article>
        <article class="card"><span class="label">Scopes</span><strong class="value" style="font-size:16px">${state.cp.scopes}</strong><span class="meta">permissões</span></article>
        <article class="card"><span class="label">Rate limit</span><strong class="value" style="font-size:18px">${state.cp.rateLimit}</strong><span class="meta">janela</span></article>
        <article class="card accent"><span class="label">Consumo 24h</span><strong class="value">${state.cp.consumo24h}</strong><span class="meta">requests</span></article>
      </section>
      <section class="panel">
        <div class="panel-head"><div><span class="kicker">Fluxo</span><h3>Arquitetura de autenticação</h3></div></div>
        <div class="codebox"><pre>HUMANO     → senha → sessão
SISTEMA    → API Key → scopes → organização

API Key ≠ sessão ≠ token de IA ≠ quota ≠ crédito

NexoTerraCore → Auth → Scope → Rate Limit → Metering → APIs de domínio → PostgreSQL</pre></div>
      </section>
    </div>`;
}

function renderApi(){
  return `
    <div class="page">
      <section class="hero">
        <div><span class="kicker">Engenharia</span><h2>Arquitetura / API</h2><p>Mapa visual para estudar os endpoints do Core sem alterar o backend real.</p></div>
      </section>
      <section class="panel">
        <div class="panel-head"><div><span class="kicker">Endpoints</span><h3>Contrato da API</h3></div></div>
        <div class="api-list">
          <div class="api-row"><span class="method">GET</span><code>/api/health</code><span class="status">futuro</span></div>
          <div class="api-row"><span class="method">GET</span><code>/api/control-plane</code><span class="status">futuro</span></div>
          <div class="api-row"><span class="method">GET</span><code>/api/imoveis</code><span class="status">futuro</span></div>
          <div class="api-row"><span class="method">POST</span><code>/api/imoveis</code><span class="status">futuro</span></div>
        </div>
      </section>
    </div>`;
}

function renderGeneric(){
  const title = titles[state.view] || state.view;
  return `
    <div class="page">
      <section class="hero">
        <div><span class="kicker">Módulo</span><h2>${title}</h2><p>Estrutura reservada para evolução controlada.</p></div>
      </section>
      <section class="panel"><div class="empty">Módulo ${title} pronto para receber dados e ações em uma próxima etapa.</div></section>
    </div>`;
}

function render(){
  const content = $("#pageContent");
  if(state.view === "painel") content.innerHTML = renderPainel();
  else if(state.view === "imoveis") content.innerHTML = renderImoveis();
  else if(state.view === "control-plane") content.innerHTML = renderControlPlane();
  else if(state.view === "arquitetura") content.innerHTML = renderApi();
  else content.innerHTML = renderGeneric();

  bindDynamic();
}

function bindDynamic(){
  $$("[data-view-jump]").forEach(btn => btn.addEventListener("click",()=>setView(btn.dataset.viewJump)));
  $$("[data-property]").forEach(btn => btn.addEventListener("click",()=>{
    state.selectedProperty = btn.dataset.property;
    state.view = "imoveis";
    $("#pageTitle").textContent = "Imóveis";
    $("#breadcrumb").textContent = "imoveis";
    render();
  }));
  const back = $("#backProperties");
  if(back) back.addEventListener("click",()=>{state.selectedProperty=null;render();});
  const open = $("#openNewBtn");
  if(open) open.addEventListener("click",()=>$("#recordDialog").showModal());
  const exportBtn = $("#exportBtn");
  if(exportBtn) exportBtn.addEventListener("click",exportData);
}

function exportData(){
  const blob = new Blob([JSON.stringify(state.imoveis,null,2)],{type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "imoveis-console-next.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

$("#sidebarToggle").addEventListener("click",()=>{
  $("#sidebar").classList.toggle("collapsed");
  $("#sidebarToggle").innerHTML = $("#sidebar").classList.contains("collapsed")
    ? '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>'
    : '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>';
});

$$(".nav-item[data-view]").forEach(btn => btn.addEventListener("click",()=>{
  state.selectedProperty = null;
  setView(btn.dataset.view);
}));

$("#primaryBtn").addEventListener("click",()=>{
  if(state.view === "imoveis") $("#recordDialog").showModal();
  else alert("Ação reservada para a próxima etapa.");
});

$("#refreshBtn").addEventListener("click",loadInitialData);

$("#recordForm").addEventListener("submit",(e)=>{
  const submitter = e.submitter;
  if(!submitter || submitter.value !== "default") return;
  e.preventDefault();

  const fd = new FormData(e.currentTarget);
  const novo = {
    id: Date.now(),
    nome: fd.get("nome"),
    tipo: fd.get("tipo"),
    cidade: fd.get("cidade") || "—",
    uf: (fd.get("uf") || "—").toUpperCase(),
    area: Number(fd.get("area") || 0),
    status: fd.get("status"),
    matricula: "LOCAL-" + String(Date.now()).slice(-6),
    valor: 0
  };

  state.imoveis.unshift(novo);
  localStorage.setItem("ntc_console_next_imoveis", JSON.stringify(state.imoveis));
  $("#recordDialog").close();
  e.currentTarget.reset();
  state.view = "imoveis";
  render();
});

const localSaved = localStorage.getItem("ntc_console_next_imoveis");
if(localSaved){
  try { state.imoveis = JSON.parse(localSaved); } catch {}
}

// Gate de acesso simples (client-side). Não substitui autenticação real.
// Para trocar a senha: gere um novo hash com
//   python3 -c "import hashlib; print(hashlib.sha256('SUA_SENHA'.encode()).hexdigest())"
// e substitua GATE_HASH abaixo.
const GATE_HASH = "6e0e0d6621658cdc0d840671f5127a486f36f868e535a9cd48ce2250c0eb9a71";
const GATE_KEY = "ntc_console_next_unlocked";

async function sha256Hex(text){
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,"0")).join("");
}

function unlockApp(){
  $("#gateScreen").remove();
  $("#appRoot").hidden = false;
  loadInitialData();
}

if(sessionStorage.getItem(GATE_KEY) === "1"){
  unlockApp();
} else {
  $("#gateForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const pass = $("#gatePassword").value;
    if(await sha256Hex(pass) === GATE_HASH){
      sessionStorage.setItem(GATE_KEY, "1");
      unlockApp();
    } else {
      $("#gateError").hidden = false;
      $("#gatePassword").value = "";
      $("#gatePassword").focus();
    }
  });
}
