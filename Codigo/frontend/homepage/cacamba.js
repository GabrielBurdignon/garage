document.addEventListener("DOMContentLoaded", () => {
  const listaAndamento = document.getElementById("lista-servicos-andamento");
  const listaProntos = document.getElementById("lista-servicos-prontos");
  const badgeAndamento = document.getElementById("badge-andamento");
  const badgeProntos = document.getElementById("badge-prontos");
  
  function confirmarAcao(titulo, mensagem) {
  return new Promise(resolve => {
    const overlay = document.getElementById("modal-confirmacao");
    const textoTitulo = document.getElementById("modal-titulo");
    const textoMensagem = document.getElementById("modal-mensagem");
    const btnConfirmar = document.getElementById("modal-confirmar");
    const btnCancelar = document.getElementById("modal-cancelar");

    textoTitulo.textContent = titulo;
    textoMensagem.textContent = mensagem;

    overlay.classList.add("show");

    const limpar = () => {
      overlay.classList.remove("show");
      btnConfirmar.onclick = null;
      btnCancelar.onclick = null;
    };

    btnCancelar.onclick = () => {
      limpar();
      resolve(false);
    };

    btnConfirmar.onclick = () => {
      limpar();
      resolve(true);
    };
  });
}

  let paginaAndamento = 0;
  let paginaProntos = 0;
  const tamanhoPagina = 2;

  const servicoIcones = {
    POLIMENTO: "✨",
    MARTELINHO: "🔨",
    MANUTENCAO: "🔧",
    VITRIFICACAO: "💎"
  };

  function formatarData(dataString) {
    if (!dataString) return "Data não informada";
    const data = new Date(dataString + "T00:00:00");
    return data.toLocaleDateString("pt-BR");
  }

  async function carregarServicosAndamento(pagina = 0) {
    if (!listaAndamento) return;

    try {
      listaAndamento.innerHTML = '<li class="servico-item loading">Carregando...</li>';

      const url = `http://localhost:8080/api/v1/servico?pagina=${pagina}&tamanho=${tamanhoPagina}&orderBy=id&direcao=DESC`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.json();
      listaAndamento.innerHTML = "";

      if (!data.content || data.content.length === 0) {
        listaAndamento.innerHTML = '<li class="servico-item vazio">Nenhum serviço em andamento</li>';
        if (badgeAndamento) badgeAndamento.textContent = "0";
        return;
      }

      if (badgeAndamento) badgeAndamento.textContent = data.totalElements;

      data.content.forEach(servico => {
        const item = criarItemServico(servico, "andamento");
        listaAndamento.appendChild(item);
      });

      // Adiciona controles de paginação
      adicionarControlesPaginacao(listaAndamento.parentElement, data, "andamento");

    } catch (error) {
      console.error("Erro ao carregar serviços em andamento:", error);
      listaAndamento.innerHTML = `
        <li class="servico-item erro">
          <span class="erro-icon">⚠️</span>
          <span>Erro ao carregar serviços</span>
        </li>
      `;
      if (badgeAndamento) badgeAndamento.textContent = "!";
    }
  }

  async function carregarServicosProntos(pagina = 0) {
    if (!listaProntos) return;

    try {
      listaProntos.innerHTML = '<li class="servico-item loading">Carregando...</li>';

      const url = `http://localhost:8080/api/v1/servico/prontos?pagina=${pagina}&tamanho=${tamanhoPagina}&orderBy=id&direcao=DESC`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.json();
      listaProntos.innerHTML = "";

      if (!data.content || data.content.length === 0) {
        listaProntos.innerHTML = '<li class="servico-item vazio">Nenhum serviço pronto</li>';
        if (badgeProntos) badgeProntos.textContent = "0";
        return;
      }

      if (badgeProntos) badgeProntos.textContent = data.totalElements;

      data.content.forEach(servico => {
        const item = criarItemServico(servico, "pronto");
        listaProntos.appendChild(item);
      });
      adicionarControlesPaginacao(listaProntos.parentElement, data, "prontos");

    } catch (error) {
      console.error("Erro ao carregar serviços prontos:", error);
      listaProntos.innerHTML = `
        <li class="servico-item erro">
          <span class="erro-icon">⚠️</span>
          <span>Erro ao carregar serviços</span>
        </li>
      `;
      if (badgeProntos) badgeProntos.textContent = "!";
    }
  }

  function adicionarControlesPaginacao(container, data, tipo) {
    const controlesAntigos = container.querySelector(".paginacao-controles");
    if (controlesAntigos) controlesAntigos.remove();

    if (data.totalPages <= 1) return;

    const controles = document.createElement("div");
    controles.className = "paginacao-controles";

    const btnAnterior = document.createElement("button");
    btnAnterior.className = "btn-paginacao";
    btnAnterior.textContent = "← Anterior";
    btnAnterior.disabled = data.first;
    btnAnterior.onclick = () => {
      if (tipo === "andamento") {
        paginaAndamento = data.number - 1;
        carregarServicosAndamento(paginaAndamento);
      } else {
        paginaProntos = data.number - 1;
        carregarServicosProntos(paginaProntos);
      }
    };
    const info = document.createElement("span");
    info.className = "paginacao-info";
    info.textContent = `Página ${data.number + 1} de ${data.totalPages}`;

    const btnProximo = document.createElement("button");
    btnProximo.className = "btn-paginacao";
    btnProximo.textContent = "Próximo →";
    btnProximo.disabled = data.last;
    btnProximo.onclick = () => {
      if (tipo === "andamento") {
        paginaAndamento = data.number + 1;
        carregarServicosAndamento(paginaAndamento);
      } else {
        paginaProntos = data.number + 1;
        carregarServicosProntos(paginaProntos);
      }
    };

    controles.appendChild(btnAnterior);
    controles.appendChild(info);
    controles.appendChild(btnProximo);
    container.appendChild(controles);
  }

  function criarItemServico(servico, tipo) {
    const li = document.createElement("li");
    li.className = "servico-item";
    li.dataset.id = servico.id;
    li.dataset.tipo = tipo;

    const icone = servicoIcones[servico.tipo] || "📋";
    const dataEntrega = formatarData(servico.dataDeEntregaDesejada);
    const preco = servico.preco ? `R$ ${Number(servico.preco).toFixed(2)}` : "R$ 0,00";

    let html = `
      <div class="servico-header">
        <span class="servico-icone">${icone}</span>
        <div class="servico-info">
          <strong class="servico-tipo">${servico.tipo}</strong>
          <span class="servico-placa">${servico.placaCarro || "Sem placa"}</span>
        </div>
      </div>
      <div class="servico-detalhes">
        <span class="servico-descricao">${servico.descricao || "Sem descrição"}</span>
        <span class="servico-data">📅 ${dataEntrega}</span>
        <span class="servico-preco">${preco}</span>
      </div>
    `;

    if (tipo === "andamento") {
      html += `
        <div class="servico-acoes">
          <button class="btn-acao btn-finalizar" onclick="finalizarServico(${servico.id})">
            ✓ Finalizar
          </button>
        </div>
      `;
    }

    li.innerHTML = html;
    return li;
  }

  window.finalizarServico = async function(id) {
  const ok = await confirmarAcao(
    "Finalizar Serviço",
    "Deseja realmente marcar este serviço como PRONTO?"
  );
  if (!ok) return;

  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/servico/entregar/${id}`,
      { method: "POST", headers: { "Content-Type": "application/json" } }
    );

    if (!response.ok) throw new Error("Falha no servidor");
    const item = document.querySelector(`#lista-servicos-andamento li[data-id='${id}']`);
    if (item) {
      item.style.opacity = "0";
      item.style.transform = "translateX(-20px)";
      setTimeout(() => item.remove(), 250);
    }
    mostrarNotificacao("Serviço finalizado! ✓");
    badgeAndamento.textContent = Number(badgeAndamento.textContent) - 1;
    badgeProntos.textContent = Number(badgeProntos.textContent) + 1;

  } catch(e) {
    console.error(e);
    mostrarNotificacao("Erro ao finalizar", "error");
  }
};

  window.entregarServico = async function(id) {
    if (!confirm("Confirmar entrega deste serviço ao cliente?")) return;
    try {
      const response = await fetch(`http://localhost:8080/api/v1/servico/entregar/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error(`Erro: ${response.status}`);
      const item = listaProntos.querySelector(`li[data-id="${id}"]`);
      if (item) {
        item.style.opacity = "0";
        item.style.transform = "translateX(20px)";
        setTimeout(() => item.remove(), 300);
      }
      mostrarNotificacao("Serviço entregue com sucesso! 📦", "success");
      setTimeout(() => carregarServicosProntos(paginaProntos), 500);

    } catch (error) {
      console.error("Erro ao entregar serviço:", error);
      mostrarNotificacao("Erro ao entregar serviço", "error");
    }
  };

  function mostrarNotificacao(mensagem, tipo = "success") {
    const notif = document.createElement("div");
    notif.className = `notificacao ${tipo}`;
    notif.textContent = mensagem;
    document.body.appendChild(notif);

    setTimeout(() => notif.classList.add("show"), 10);
    setTimeout(() => {
      notif.classList.remove("show");
      setTimeout(() => notif.remove(), 300);
    }, 3000);
  }
  carregarServicosAndamento(paginaAndamento);
  carregarServicosProntos(paginaProntos);
});