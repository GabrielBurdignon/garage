// ====== CONFIGURAÇÃO DA API ======
const API_BASE_URL = 'http://localhost:8080/api/v1/funcionarios';

// ====== ESTADO DA APLICAÇÃO ======
const pageSize = 5;
let page = 1;
let editingId = null;
let selected = new Set();
let funcionarios = [];

// ====== NAVEGAÇÃO ======
function voltarDashboard() {
  window.location.href = '../dashboard/dashboard.html';
}

// ====== HELPERS ======
function formatDateBR(iso) {
  if (!iso) return '-';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('pt-BR');
}

function formatarCPF(cpf) {
  if (!cpf) return '';
  const limpo = cpf.replace(/\D/g, '');
  return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarTelefone(telefone) {
  if (!telefone) return '';
  const limpo = telefone.replace(/\D/g, '');
  if (limpo.length === 11) {
    return limpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (limpo.length === 10) {
    return limpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return limpo;
}

// ====== TOAST DE NOTIFICAÇÃO ======
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  const colors = {
    success: 'linear-gradient(135deg, rgba(22,163,74,.16), rgba(16,185,129,.12))',
    error: 'linear-gradient(135deg, rgba(239,68,68,.16), rgba(239,68,68,.12))',
    warning: 'linear-gradient(135deg, rgba(245,158,11,.16), rgba(245,158,11,.12))',
    info: 'linear-gradient(135deg, rgba(59,130,246,.16), rgba(59,130,246,.12))'
  };
  
  const borderColors = {
    success: 'rgba(22,163,74,.35)',
    error: 'rgba(239,68,68,.35)',
    warning: 'rgba(245,158,11,.35)',
    info: 'rgba(59,130,246,.35)'
  };
  
  toast.textContent = `${icons[type]} ${message}`;
  toast.style.background = colors[type];
  toast.style.borderColor = borderColors[type];
  toast.classList.add('show');
  
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ====== LOADING OVERLAY ======
function showLoading(show = true) {
  let overlay = document.getElementById('loadingOverlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(11,15,13,0.85);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      ">
        <div style="
          background: linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.06));
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,.14);
          padding: 35px 45px;
          border-radius: 18px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(2,6,23,.6);
        ">
          <div style="
            width: 45px;
            height: 45px;
            border: 3px solid rgba(255,255,255,.1);
            border-top: 3px solid #10b981;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 18px;
          "></div>
          <p style="margin: 0; color: #e5e7eb; font-weight: 500; font-size: 15px;">Processando...</p>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    document.body.appendChild(overlay);
  }
  
  overlay.style.display = show ? 'block' : 'none';
}

// ====== FILTROS ======
function filtered() {
  const busca = document.getElementById('busca');
  const filtroStatus = document.getElementById('filtroStatus');
  
  const q = busca ? (busca.value || '').toLowerCase() : '';
  const fs = filtroStatus ? filtroStatus.value : 'todos';
  
  return funcionarios.filter(f => {
    const matchQ = [f.nome, f.email, f.cargo].some(v => (v || '').toLowerCase().includes(q));
    const matchS = fs === 'todos' ? true : f.status === fs;
    return matchQ && matchS;
  });
}

// ====== API - LISTAR FUNCIONÁRIOS ======
async function listarFuncionarios() {
  console.log('Iniciando listagem de funcionários...');
  
  try {
    showLoading(true);
    
    console.log('Fazendo requisição para:', API_BASE_URL);
    
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('Status da resposta:', response.status);
    
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
    
    funcionarios = await response.json();
    console.log('Funcionários recebidos:', funcionarios);
    console.log('Quantidade de funcionários:', funcionarios.length);
    
    render();
    
  } catch (error) {
    console.error('Erro ao listar funcionários:', error);
    showToast('Erro ao carregar funcionários: ' + error.message, 'error');
    
    // Renderizar estado de erro
    const tbody = document.getElementById('tbody');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 50px; color: var(--err);">
            <div style="font-size: 48px; margin-bottom: 16px;">❌</div>
            <p style="margin: 0; font-size: 16px;">Erro ao carregar funcionários</p>
            <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.7;">${error.message}</p>
            <button class="btn primary" onclick="listarFuncionarios()" style="margin-top: 16px;">
              🔄 Tentar novamente
            </button>
          </td>
        </tr>
      `;
    }
  } finally {
    showLoading(false);
  }
}

// ====== API - DELETAR FUNCIONÁRIO ======
async function deletarFuncionarioAPI(email) {
  try {
    showLoading(true);
    
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(email)}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.erro || `Erro ${response.status}: ${response.statusText}`);
    }
    
    showToast('Funcionário excluído com sucesso!', 'success');
    
    // Recarregar lista
    await listarFuncionarios();
    
  } catch (error) {
    console.error('Erro ao deletar funcionário:', error);
    showToast(error.message || 'Erro ao excluir funcionário', 'error');
  } finally {
    showLoading(false);
  }
}

// ====== RENDER DA TABELA ======
function render() {
  const data = filtered();
  const total = data.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  
  if (page > pages) page = pages;
  if (page < 1) page = 1;
  
  const start = (page - 1) * pageSize;
  const slice = data.slice(start, start + pageSize);
  
  const tbody = document.getElementById('tbody');
  
  if (!tbody) {
    console.error('Elemento tbody não encontrado');
    return;
  }
  
  if (slice.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 50px; color: var(--muted);">
          <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;">📋</div>
          <p style="margin: 0; font-size: 16px;">Nenhum funcionário encontrado</p>
          <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.7;">
            ${total === 0 ? 'Comece cadastrando um novo funcionário' : 'Tente ajustar os filtros'}
          </p>
        </td>
      </tr>
    `;
  } else {
    tbody.innerHTML = slice.map(f => {
      const checked = selected.has(f.email) ? 'checked' : '';
      const badge = f.status === 'ativo' ? 'ok' : (f.status === 'ferias' ? 'warn' : 'muted');
      
      return `
        <tr>
          <td><input type="checkbox" ${checked} onclick="toggleSelect('${f.email}')"></td>
          <td>${f.nome || '-'}</td>
          <td>${f.email || '-'}</td>
          <td>${f.cargo || '-'}</td>
          <td><span class="badge ${badge}">${f.status || '-'}</span></td>
          <td>${formatDateBR(f.dataAdmissao)}</td>
          <td>
            <div class="actions">
              <button class="btn" onclick="editar('${f.email}')">Editar</button>
              <button class="btn" onclick="inativar('${f.email}')">${f.status === 'ativo' ? 'Inativar' : 'Reativar'}</button>
              <button class="btn danger" onclick="excluir('${f.email}')">Excluir</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }
  
  // Atualizar contadores
  const countEl = document.getElementById('count');
  const pageInfoEl = document.getElementById('pageInfo');
  
  if (countEl) countEl.textContent = `${total} resultado(s)`;
  if (pageInfoEl) pageInfoEl.textContent = `Página ${page} de ${pages}`;
}

// ====== PAGINAÇÃO ======
function nextPage() {
  page++;
  render();
}

function prevPage() {
  page--;
  render();
}

// ====== SELEÇÃO ======
function toggleSelect(email) {
  if (selected.has(email)) {
    selected.delete(email);
  } else {
    selected.add(email);
  }
}

function toggleAll(master) {
  selected.clear();
  if (master.checked) {
    filtered().forEach(f => selected.add(f.email));
  }
  render();
}

// ====== MODAIS ======
function abrirModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.classList.add('show');
}

function fecharModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.classList.remove('show');
}

function confirmar(msg, onYes) {
  const m = document.getElementById('confirm');
  if (!m) {
    if (window.confirm(msg)) {
      onYes && onYes();
    }
    return;
  }
  
  const msgEl = document.getElementById('confirmMsg');
  if (msgEl) msgEl.textContent = msg;
  
  const yes = document.getElementById('confirmYes');
  if (yes) {
    yes.onclick = () => {
      m.classList.remove('show');
      onYes && onYes();
    };
  }
  
  m.classList.add('show');
}

function fecharConfirm() {
  const confirm = document.getElementById('confirm');
  if (confirm) confirm.classList.remove('show');
}

// ====== CRUD ======
function abrirNovo() {
  window.location.href = '../funcionarios/funcionarios.html';
}

function editar(email) {
  // Redirecionar para página de edição ou abrir modal
  window.location.href = `./editar-funcionario.html?email=${encodeURIComponent(email)}`;
}

function inativar(email) {
  const f = funcionarios.find(x => x.email === email);
  if (!f) return;
  
  const novo = f.status === 'ativo' ? 'inativo' : 'ativo';
  confirmar(`Deseja alterar o status de ${f.nome} para "${novo}"?`, async () => {
    // TODO: Implementar endpoint PATCH no backend
    showToast('Funcionalidade em desenvolvimento', 'warning');
  });
}

function excluir(email) {
  const f = funcionarios.find(x => x.email === email);
  if (!f) return;
  
  confirmar(`Excluir definitivamente ${f.nome}?`, () => {
    deletarFuncionarioAPI(email);
  });
}

// ====== EXPORT CSV ======
function exportarCSV() {
  const rows = [['Nome', 'E-mail', 'Cargo', 'Status', 'Admissão']];
  
  filtered().forEach(f => {
    rows.push([
      f.nome,
      f.email,
      f.cargo || '',
      f.status,
      formatDateBR(f.dataAdmissao)
    ]);
  });
  
  const csv = rows.map(r => r.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'funcionarios.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ====== INICIALIZAÇÃO ======
document.addEventListener('DOMContentLoaded', () => {
  console.log('Página de listagem carregada');
  
  // Carregar funcionários
  listarFuncionarios();
  
  // Event listeners para filtros
  const busca = document.getElementById('busca');
  const filtroStatus = document.getElementById('filtroStatus');
  
  if (busca) {
    busca.addEventListener('input', () => {
      page = 1;
      render();
    });
  }
  
  if (filtroStatus) {
    filtroStatus.addEventListener('change', () => {
      page = 1;
      render();
    });
  }
});