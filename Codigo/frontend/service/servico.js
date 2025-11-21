document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formServico");
  const inputServico = document.getElementById("servico");
  const fotoCarroContainer = document.getElementById("fotoCarroContainer");
  const msgElement = document.querySelector(".msg");

  const modalOverlay = document.getElementById("modalOverlay");
  const modalIcon = document.getElementById("modalIcon");
  const modalTitle = document.getElementById("modalTitle");
  const modalSubtitle = document.getElementById("modalSubtitle");
  const modalContent = document.getElementById("modalContent");
  const modalClose = document.getElementById("modalClose");
  const modalAction = document.getElementById("modalAction");

  if (modalOverlay) modalOverlay.classList.remove("show");
  if (msgElement) msgElement.classList.remove("visivel");

  const botoesByData = Array.from(document.querySelectorAll('#formServico button[data-value]'));
  const botoesOpcao = Array.from(document.querySelectorAll('#formServico .opcao-servico'));
  const radiosTipo = Array.from(document.querySelectorAll('#formServico input[type="radio"][name="tipo"]'));

  let botoesServico = botoesByData.length ? botoesByData : (botoesOpcao.length ? botoesOpcao : []);
  const usingRadios = !botoesServico.length && radiosTipo.length > 0;

  const tipoServicoMap = {
    polimento: "POLIMENTO",
    martelinho: "MARTELINHO",
    manutencao: "MANUTENCAO",
    manuteração: "MANUTENCAO",
    vitrificacao: "VITRIFICACAO",
    vitrificação: "VITRIFICACAO"
  };

  const tamanhoMap = { Pequeno: 1.0, Médio: 1.5, Medio: 1.5, Grande: 2.0 };

  function showModal(type, title, subtitle, content) {
    if (!modalOverlay) {
      if (msgElement) {
        msgElement.textContent = title + (subtitle ? " — " + subtitle : "");
        msgElement.classList.add("visivel");
      } else {
        alert(title + (subtitle ? "\n" + subtitle : ""));
      }
      return;
    }
    if (modalIcon) {
      modalIcon.className = "modal-icon " + (type || "");
      if (type === 'success') modalIcon.textContent = '✅';
      else if (type === 'error') modalIcon.textContent = '❌';
      else if (type === 'warning') modalIcon.textContent = '⚠️';
    }
    if (modalTitle) modalTitle.textContent = title || "";
    if (modalSubtitle) modalSubtitle.textContent = subtitle || "";
    if (modalContent) modalContent.innerHTML = content || "";
    modalOverlay.classList.add("show");
  }
  
  function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove("show");
    if (msgElement) msgElement.classList.remove("visivel");
  }

  function resetForm() {
    if (!form) return;
    form.reset();
    (botoesServico || []).forEach(b => {
      b.classList.remove("selecionado", "primary");
      b.classList.add("ghost");
    });
    if (usingRadios) radiosTipo.forEach(r => r.checked = false);
    if (inputServico) inputServico.value = "";
    if (fotoCarroContainer) fotoCarroContainer.style.display = "none";
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalAction) modalAction.addEventListener("click", () => { closeModal(); resetForm(); });
  if (modalOverlay) modalOverlay.addEventListener("click", e => { if (e.target === modalOverlay) closeModal(); });

  function marcarSelecionadoPorValor(valor) {
    (botoesServico || []).forEach(b => b.classList.remove("selecionado", "primary"));
    if (usingRadios) {
      radiosTipo.forEach(r => r.checked = (r.value || "").toLowerCase() === (valor || "").toLowerCase());
    } else {
      let encontrado = (botoesServico || []).find(b => {
        const v = (b.dataset && b.dataset.value) ? b.dataset.value.toLowerCase() : "";
        if (v && v === valor.toLowerCase()) return true;
        const txt = (b.textContent || "").trim().toLowerCase();
        return txt.includes(valor.toLowerCase());
      });
      if (encontrado) {
        encontrado.classList.add("selecionado", "primary");
        encontrado.classList.remove("ghost");
      }
    }
    if (inputServico) inputServico.value = (valor || "").toLowerCase();
  }

  if (botoesServico.length) {
    botoesServico.forEach(btn => {
      btn.addEventListener("click", () => {
        botoesServico.forEach(b => { b.classList.remove("selecionado", "primary"); b.classList.add("ghost"); });
        btn.classList.remove("ghost"); btn.classList.add("selecionado", "primary");
        let valor = (btn.dataset && btn.dataset.value) ? btn.dataset.value.trim().toLowerCase() : (btn.getAttribute('data-value') || '').trim().toLowerCase();
        if (!valor) {
          valor = (btn.textContent || "").trim().toLowerCase();
        }
        if (inputServico) inputServico.value = valor;
        if (fotoCarroContainer) {
          fotoCarroContainer.style.display = (valor === "martelinho" || valor === "manutencao" || valor === "manutenção") ? "block" : "none";
        }
      });
    });
  } else if (usingRadios) {
    radiosTipo.forEach(radio => {
      radio.addEventListener('change', () => {
        const valor = (radio.value || "").trim().toLowerCase();
        if (inputServico) inputServico.value = valor;
        if (fotoCarroContainer) {
          fotoCarroContainer.style.display = (valor === "martelinho" || valor === "manutencao" || valor === "manutenção") ? "block" : "none";
        }
      });
    });
  }

  if (msgElement) {
    msgElement.classList.remove("visivel");
    msgElement.style.display = 'none';
  }
  if (modalOverlay) modalOverlay.classList.remove('show');

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tipoSelecionadoValor = (inputServico && inputServico.value) ? inputServico.value.trim().toLowerCase() : "";
    if (!tipoSelecionadoValor) {
      showModal(
        "error",
        "Erro de Validação",
        "Preencha todos os campos obrigatórios",
        '<div class="modal-info-item"><span class="modal-info-label">Campo obrigatório</span><span class="modal-info-value">Selecione um tipo de serviço</span></div>'
      );
      return;
    }

    const tamanhoSelecionado = (document.getElementById("tamanho") || {}).value || "";
    const data = (document.getElementById("data") || {}).value || "";
    const modelo = (document.getElementById("modelo") || {}).value || "";
    const cor = (document.getElementById("cor") || {}).value || "";
    const email = (document.getElementById("email") || {}).value || "";

    if (!email) {
      showModal(
        "error",
        "Email Obrigatório",
        "O email do cliente é necessário",
        '<div class="modal-info-item"><span class="modal-info-label">Campo obrigatório</span><span class="modal-info-value">Informe o email do cliente</span></div>'
      );
      return;
    }

    const placaInput = document.getElementById("placa");
    const placaDoCarro = (placaInput ? placaInput.value : "").toUpperCase().trim();
    if (!placaDoCarro) {
      showModal(
        "error",
        "Placa Obrigatória",
        "A placa do carro é necessária",
        '<div class="modal-info-item"><span class="modal-info-label">Campo obrigatório</span><span class="modal-info-value">Informe a placa do carro</span></div>'
      );
      return;
    }

    if (!data) {
      showModal(
        "error",
        "Data Obrigatória",
        "A data de entrega é necessária",
        '<div class="modal-info-item"><span class="modal-info-label">Campo obrigatório</span><span class="modal-info-value">Informe a data de entrega</span></div>'
      );
      return;
    }

    const tipoSelecionado = tipoServicoMap[tipoSelecionadoValor] || tipoServicoMap[tipoSelecionadoValor.replace('ã','a')] || "POLIMENTO";
    const servicoDto = {
      tipo: tipoSelecionado,
      descricao: `${modelo || ''} - ${cor || ''}`.trim(),
      tamanhoCarro: tamanhoMap[tamanhoSelecionado] ?? 1.0,
      placaDoCarro,
      dataDeEntregaDesejada: data,
      emailCliente: email
    };

    const btnSubmit = form.querySelector('button[type="submit"]');
    const originalText = btnSubmit ? btnSubmit.innerHTML : 'Salvar';
    if (btnSubmit) {
      btnSubmit.innerHTML = '<span class="loading"></span> Criando...';
      btnSubmit.disabled = true;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/servico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(servicoDto)
      });

      const contentType = (response.headers.get("content-type") || "").toLowerCase();
      const payload = contentType.includes("application/json") ? await response.json() : await response.text();

      if (!response.ok) {
        const msg = (payload && payload.message) || (typeof payload === "string" ? payload : "") || response.statusText;
        showModal(
          "error",
          `Erro ao Criar Serviço`,
          msg,
          `<div class="modal-info-item"><span class="modal-info-label">Mensagem</span><span class="modal-info-value">${msg}</span></div>`
        );
        return;
      }

      const contentHtml = `
        <div class="modal-info-item"><span class="modal-info-label">Placa</span><span class="modal-info-value">${(payload && payload.placaCarro) || placaDoCarro}</span></div>
        <div class="modal-info-item"><span class="modal-info-label">Tipo de Serviço</span><span class="modal-info-value">${(payload && payload.tipo) || tipoSelecionado}</span></div>
        <div class="modal-info-item"><span class="modal-info-label">Descrição</span><span class="modal-info-value">${servicoDto.descricao}</span></div>
        <div class="modal-info-item"><span class="modal-info-label">Preço</span><span class="modal-info-value price">R$ ${payload && payload.preco ? (Number(payload.preco).toFixed(2)) : '0.00'}</span></div>
      `;
      showModal("success", "Serviço Criado com Sucesso! 🎉", "O cliente receberá um email de confirmação", contentHtml);

    } catch (error) {
      console.error("Erro na requisição:", error);
      showModal("error", "Erro de Conexão", "Não foi possível conectar ao servidor",
        `<div class="modal-info-item"><span class="modal-info-label">Erro</span><span class="modal-info-value">${error && error.message ? error.message : 'Erro desconhecido'}</span></div>`
      );
    } finally {
      if (btnSubmit) {
        btnSubmit.innerHTML = originalText;
        btnSubmit.disabled = false;
      }
    }
  });

  const btnFinalizar = document.querySelector('.btn-finalizar') || 
                       document.querySelector('button[data-action="finalizar"]') ||
                       document.querySelector('#btnFinalizar');

  const modalConfirmacao = createConfirmModal();
  document.body.appendChild(modalConfirmacao);

  if (btnFinalizar) {
    const newBtnFinalizar = btnFinalizar.cloneNode(true);
    btnFinalizar.parentNode.replaceChild(newBtnFinalizar, btnFinalizar);
    newBtnFinalizar.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showConfirmModal();
    }, { once: false });
  }

  function createConfirmModal() {
    const modal = document.createElement('div');
    modal.id = 'modalConfirmacao';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <div class="modal-icon warning">⚠️</div>
          <h3>Confirmar Finalização</h3>
          <p>Tem certeza que deseja finalizar este serviço?</p>
        </div>
        <div class="modal-body">
          <div class="modal-info">
            <p>Esta ação não poderá ser desfeita. O serviço será marcado como concluído.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button id="btnCancelarFinalizacao" class="btn ghost">Cancelar</button>
          <button id="btnConfirmarFinalizacao" class="btn primary">Confirmar Finalização</button>
        </div>
      </div>
    `;
    return modal;
  }

  function showConfirmModal() {
    const modal = document.getElementById('modalConfirmacao');
    if (modal) {
      modal.classList.add('show');
      setupConfirmModalListeners();
    }
  }

  function closeConfirmModal() {
    const modal = document.getElementById('modalConfirmacao');
    if (modal) {
      modal.classList.remove('show');
    }
  }

  function setupConfirmModalListeners() {
    const btnCancelar = document.getElementById('btnCancelarFinalizacao');
    const btnConfirmar = document.getElementById('btnConfirmarFinalizacao');
    const modal = document.getElementById('modalConfirmacao');

    const newBtnCancelar = btnCancelar.cloneNode(true);
    const newBtnConfirmar = btnConfirmar.cloneNode(true);
    btnCancelar.parentNode.replaceChild(newBtnCancelar, btnCancelar);
    btnConfirmar.parentNode.replaceChild(newBtnConfirmar, btnConfirmar);

    newBtnCancelar.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeConfirmModal();
    });

    newBtnConfirmar.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      newBtnConfirmar.disabled = true;
      await finalizarServico();
    });

    const newModal = modal.cloneNode(true);
    modal.parentNode.replaceChild(newModal, modal);
    newModal.addEventListener('click', (e) => {
      if (e.target === newModal) {
        closeConfirmModal();
      }
    });
  }

  async function finalizarServico() {
    const btnConfirmar = document.getElementById('btnConfirmarFinalizacao');
    const originalText = btnConfirmar ? btnConfirmar.innerHTML : 'Confirmar Finalização';
    
    try {
      if (btnConfirmar) {
        btnConfirmar.innerHTML = '<span class="loading"></span> Finalizando...';
        btnConfirmar.disabled = true;
      }

      const servicoId = getServicoId();
      
      if (!servicoId) {
        throw new Error('ID do serviço não encontrado');
      }

      const response = await fetch(`http://localhost:8080/api/v1/servico/${servicoId}/finalizar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao finalizar serviço');
      }

      const data = await response.json();

      closeConfirmModal();

      showModal(
        'success',
        'Serviço Finalizado! ✅',
        'O serviço foi finalizado com sucesso',
        `
          <div class="modal-info-item">
            <span class="modal-info-label">Status</span>
            <span class="modal-info-value">Finalizado</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-info-label">Serviço</span>
            <span class="modal-info-value">${data.tipo || 'N/A'}</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-info-label">Placa</span>
            <span class="modal-info-value">${data.placaCarro || 'N/A'}</span>
          </div>
        `
      );

      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Erro ao finalizar serviço:', error);
      closeConfirmModal();
      showModal(
        'error',
        'Erro ao Finalizar',
        error.message || 'Não foi possível finalizar o serviço',
        `
          <div class="modal-info-item">
            <span class="modal-info-label">Erro</span>
            <span class="modal-info-value">${error.message}</span>
          </div>
        `
      );
    } finally {
      if (btnConfirmar) {
        btnConfirmar.innerHTML = originalText;
        btnConfirmar.disabled = false;
      }
    }
  }

  function getServicoId() {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    if (!id) {
      const btn = document.querySelector('.btn-finalizar') || 
                  document.querySelector('button[data-action="finalizar"]') ||
                  document.querySelector('#btnFinalizar');
      if (btn) {
        id = btn.dataset.servicoId || 
             btn.getAttribute('data-id') || 
             btn.getAttribute('data-servico-id');
      }
    }
    if (!id) {
      const inputId = document.getElementById('servicoId') || 
                      document.querySelector('input[name="servicoId"]') ||
                      document.querySelector('input[name="id"]');
      id = inputId ? inputId.value : null;
    }
    if (!id) {
      const btn = document.querySelector('.btn-finalizar');
      if (btn) {
        const card = btn.closest('[data-servico-id]') || btn.closest('[data-id]');
        if (card) {
          id = card.dataset.servicoId || card.dataset.id;
        }
      }
    }
    return id;
  }

});