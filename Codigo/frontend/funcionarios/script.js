// ====== CONFIGURAÇÃO DA API ======
const API_BASE_URL = 'http://localhost:8080/api/v1/funcionarios';

// ====== NAVEGAÇÃO ======
function voltarDashboard() {
  window.location.href = '../dashboard/dashboard.html';
}

// ====== MÁSCARAS DE FORMATAÇÃO ======
function aplicarMascaras() {
  const cpf = document.getElementById('cpf');
  const tel = document.getElementById('telefone');
  const sal = document.getElementById('salario');

  if (cpf) {
    cpf.addEventListener('input', () => {
      let v = cpf.value.replace(/\D/g, '').slice(0, 11);
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      cpf.value = v;
    });
  }

  if (tel) {
    tel.addEventListener('input', () => {
      let v = tel.value.replace(/\D/g, '').slice(0, 11);
      v = v.replace(/(\d{2})(\d)/, '($1) $2');
      v = v.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
      tel.value = v;
    });
  }

  if (sal) {
    sal.addEventListener('blur', () => {
      let n = sal.value.replace(/\./g, '').replace(',', '.');
      const val = Number(n);
      if (!isNaN(val)) sal.value = val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    });
  }
}

// ====== TOAST DE NOTIFICAÇÃO ======
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
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

async function salvarFuncionario() {
  const form = document.getElementById('formFuncionario');

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  try {
    showLoading(true);

    // Remove formatação do CPF e telefone para enviar ao backend
    const cpfLimpo = document.getElementById('cpf').value.replace(/\D/g, '');
    const telefoneLimpo = document.getElementById('telefone').value.replace(/\D/g, '');

    // Remove formatação do salário
    const salarioStr = document.getElementById('salario').value;
    const salarioLimpo = salarioStr.replace(/[R$\s.]/g, '').replace(',', '.');

    const funcionarioData = {
      nome: document.getElementById('nome').value.trim(),
      email: document.getElementById('email').value.trim(),
      cpf: cpfLimpo,
      telefone: telefoneLimpo,
      cargo: document.getElementById('cargo').value,
      salario: parseFloat(salarioLimpo) || 0,
      dataAdmissao: document.getElementById('admissao').value,
      turno: document.getElementById('turno').value,
      status: document.getElementById('status').value,
      endereco: document.getElementById('endereco').value.trim(),
      observacoes: document.getElementById('obs').value.trim(),
      senha: document.getElementById('senha').value.trim()
    };

    console.log('Enviando dados:', funcionarioData);

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(funcionarioData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.erro || `Erro ${response.status}: ${response.statusText}`);
    }

    abrirModal(
      'success',
      'Funcionário cadastrado',
      'O cadastro foi realizado com sucesso!'
    );

    limpar();

    // setTimeout(() => {
    //   window.location.href = '../lista_funcionario/lista.html';
    // }, 1500);

  } catch (error) {
    console.error('Erro ao salvar funcionário:', error);
    showToast(error.message || 'Erro ao salvar funcionário', 'error');
  } finally {
    showLoading(false);
  }
}

// Listar Funcionários
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

    const funcionarios = await response.json();
    console.log('Funcionários recebidos:', funcionarios);
    console.log('Quantidade de funcionários:', funcionarios.length);

    renderizarTabelaFuncionarios(funcionarios);

  } catch (error) {
    console.error('Erro ao listar funcionários:', error);
    showToast('Erro ao carregar funcionários: ' + error.message, 'error');

    // Renderizar estado de erro na tabela
    const tbody = document.querySelector('#tabelaFuncionarios tbody');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 50px; color: var(--err);">
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

// Deletar Funcionário
async function deletarFuncionario(email) {
  if (!confirm(`Tem certeza que deseja excluir o funcionário com e-mail: ${email}?`)) {
    return;
  }

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
    listarFuncionarios();

  } catch (error) {
    console.error('Erro ao deletar funcionário:', error);
    showToast(error.message || 'Erro ao excluir funcionário', 'error');
  } finally {
    showLoading(false);
  }
}

// ====== RENDERIZAÇÃO DA TABELA ======
function renderizarTabelaFuncionarios(funcionarios) {
  console.log('Renderizando tabela com funcionários:', funcionarios);

  const tbody = document.querySelector('#tabelaFuncionarios tbody');

  if (!tbody) {
    console.error('Elemento tbody não encontrado no DOM');
    return;
  }

  console.log('Elemento tbody encontrado');

  if (!funcionarios || funcionarios.length === 0) {
    console.log('Nenhum funcionário para exibir');
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 50px; color: var(--muted);">
          <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;">📋</div>
          <p style="margin: 0; font-size: 16px;">Nenhum funcionário cadastrado</p>
          <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.7;">Clique em "Novo Funcionário" para começar</p>
        </td>
      </tr>
    `;
    return;
  }

  console.log(`Renderizando ${funcionarios.length} funcionários`);

  tbody.innerHTML = funcionarios.map((func, index) => {
    console.log(`Renderizando funcionário ${index + 1}:`, func);

    const statusClass = func.status === 'ativo' ? 'badge-success' :
      func.status === 'ferias' ? 'badge-warning' : 'badge-danger';

    const dataAdmissao = func.dataAdmissao ?
      new Date(func.dataAdmissao).toLocaleDateString('pt-BR') : '-';

    const salarioFormatado = func.salario ?
      func.salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';

    return `
      <tr>
        <td>${func.nome || '-'}</td>
        <td>${func.email || '-'}</td>
        <td>${formatarCPF(func.cpf) || '-'}</td>
        <td>${formatarTelefone(func.telefone) || '-'}</td>
        <td>${func.cargo || '-'}</td>
        <td>${salarioFormatado}</td>
        <td><span class="badge ${statusClass}">${func.status || '-'}</span></td>
        <td style="text-align: center;">
          <button class="btn-icon" onclick="editarFuncionario('${func.email}')" title="Editar">
            ✏️
          </button>
          <button class="btn-icon danger" onclick="deletarFuncionario('${func.email}')" title="Excluir">
            🗑️
          </button>
        </td>
      </tr>
    `;
  }).join('');

  console.log('Tabela renderizada com sucesso');
}

// ====== FORMATAÇÃO ======
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

// ====== OUTRAS FUNÇÕES ======
function editarFuncionario(email) {
  // Implementar edição
  window.location.href = `./editar-funcionario.html?email=${encodeURIComponent(email)}`;
}

function enviar(e) {
  e.preventDefault();
  salvarFuncionario();
}

function limpar() {
  document.getElementById('formFuncionario').reset();
}

// ====== INICIALIZAÇÃO ======
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado, iniciando sistema...');

  // Aplicar máscaras se os campos existirem
  aplicarMascaras();

  // Se estiver na página de listagem, carregar funcionários
  const tabela = document.getElementById('tabelaFuncionarios');
  if (tabela) {
    console.log('Tabela encontrada, carregando funcionários...');
    listarFuncionarios();
  }

  // Configurar data de admissão padrão (hoje)
  const inputAdmissao = document.getElementById('admissao');
  if (inputAdmissao && !inputAdmissao.value) {
    const hoje = new Date().toISOString().split('T')[0];
    inputAdmissao.value = hoje;
    console.log('Data de admissão configurada:', hoje);
  }
});

function abrirModal(tipo, titulo, mensagem) {
  const modal = document.getElementById('modal');
  const icon = document.getElementById('modalIcon');
  const texto = document.getElementById('modalTexto');
  const h3 = document.getElementById('modalTitulo');

  if (tipo === 'success') {
    icon.textContent = '✅';
    h3.textContent = titulo || 'Sucesso';
  } else {
    icon.textContent = '❌';
    h3.textContent = titulo || 'Erro';
  }

  texto.textContent = mensagem;
  modal.style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}
