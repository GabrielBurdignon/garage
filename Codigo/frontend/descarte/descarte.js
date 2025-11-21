document.addEventListener("DOMContentLoaded", () => {
  const listaDescarte = document.getElementById("listaDescarte");
  const barraProgresso = document.getElementById("barraProgresso");
  const btnSolicitar = document.getElementById("btnSolicitar");

  const capacidadeMaxima = 50;
  let produtos = [];

  /**
   * Carrega todos os produtos para descarte do backend
   */
  async function carregarDescartes() {
    try {
      listaDescarte.innerHTML = '<li style="text-align: center; padding: 20px;">Carregando...</li>';

      const response = await fetch("http://localhost:8080/api/v1/descarte", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      produtos = await response.json();
      atualizarLista();

    } catch (error) {
      console.error("Erro ao carregar descartes:", error);
      listaDescarte.innerHTML = `
        <li style="text-align: center; padding: 20px; color: var(--err);">
          ⚠️ Erro ao carregar produtos para descarte
        </li>
      `;
    }
  }

  /**
   * Adiciona um novo produto para descarte
   */
  async function adicionarDescarte(sku) {
    try {
      const response = await fetch("http://localhost:8080/api/v1/descarte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: sku })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || "Erro ao adicionar produto");
      }

      mostrarNotificacao("Produto adicionado para descarte! 🗑️", "success");
      await carregarDescartes();

    } catch (error) {
      console.error("Erro ao adicionar descarte:", error);
      mostrarNotificacao(error.message, "error");
    }
  }

  /**
   * Remove um produto da lista de descarte
   */
  async function removerDescarte(id) {
    if (!confirm("Deseja remover este produto da lista de descarte?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/v1/descarte/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("Erro ao remover produto");

      mostrarNotificacao("Produto removido! ✓", "success");
      await carregarDescartes();

    } catch (error) {
      console.error("Erro ao remover descarte:", error);
      mostrarNotificacao("Erro ao remover produto. Recarregando lista...", "error");
      await carregarDescartes();
    }
  }

  /**
   * Atualiza a lista de produtos na tela
   */
  function atualizarLista() {
  listaDescarte.innerHTML = "";

  if (!produtos || produtos.length === 0) {
    listaDescarte.innerHTML = `
      <li style="text-align: center; padding: 20px; color: var(--muted);">
        Nenhum produto para descarte
      </li>
    `;
    atualizarProgresso();
    return;
  }

  // Agrupar produtos por SKU
  const grupos = {};
  produtos.forEach(p => {
    const sku = p.peca?.sku || "N/A";
    if (!grupos[sku]) grupos[sku] = [];
    grupos[sku].push(p);
  });

  // Renderizar grupos
  Object.values(grupos).forEach(grupo => {
    const produtoBase = grupo[0];          // um exemplo do grupo
    const quantidade = grupo.length;       // quantos iguais existem
    const idParaRemover = produtoBase.id;  // usa o id real de UM deles

    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-weight: 600;">
          ${produtoBase.peca?.nome || "Produto"}
          
          <span style="color: var(--ac1); font-size: 13px;">
            (${quantidade}x)
          </span>
        </span>
        <span style="font-size: 13px; color: var(--muted);">
          SKU: ${produtoBase.peca?.sku || "N/A"} | 
          Peso: ${produtoBase.peca?.peso || 0}kg cada
        </span>
      </div>

      <button class="btn ghost botao-remover" data-id="${idParaRemover}">
        🗑️ Remover 1
      </button>
    `;

    listaDescarte.appendChild(li);
  });

  atualizarProgresso();
}


  /**
   * Atualiza a barra de progresso com base no peso total
   */
  function atualizarProgresso() {
    const pesoTotal = produtos.reduce((soma, p) => {
      return soma + (p.peca?.peso || 0);
    }, 0);

    const percentual = Math.min((pesoTotal / capacidadeMaxima) * 100, 100);
    barraProgresso.style.width = percentual + "%";
    
    // Muda a cor se estiver próximo da capacidade máxima
    if (percentual >= 80) {
      barraProgresso.style.background = "var(--err)";
    } else {
      barraProgresso.style.background = "linear-gradient(135deg, var(--ac1), var(--ac2))";
    }

    // Atualiza o hint com o peso atual
    const hint = document.querySelector(".hint");
    if (hint) {
      hint.textContent = `${pesoTotal.toFixed(1)}kg / ${capacidadeMaxima}kg utilizados`;
    }
  }

  /**
   * Evento de clique para remover produto
   */
  listaDescarte.addEventListener("click", (e) => {
    if (e.target.classList.contains("botao-remover")) {
      const id = e.target.getAttribute("data-id");
      removerDescarte(id);
    }
  });

  /**
   * Solicitar coleta (limpa todos os descartes)
   */
  btnSolicitar.addEventListener("click", async () => {
    if (produtos.length === 0) {
      mostrarNotificacao("Nenhum produto na caçamba para coleta", "error");
      return;
    }

    const pesoTotal = produtos.reduce((soma, p) => soma + (p.peca?.peso || 0), 0);
    
    if (!confirm(`Confirmar solicitação de coleta?\n\nTotal: ${pesoTotal.toFixed(1)}kg\nProdutos: ${produtos.length}`)) {
      return;
    }

    try {
      // Aqui você pode criar um endpoint específico para solicitar coleta
      // Por enquanto, vamos simular o sucesso
      mostrarNotificacao("Solicitação de coleta enviada com sucesso! 🚛", "success");
      
      // Limpa a lista após alguns segundos (simulando processamento)
      setTimeout(() => {
        produtos = [];
        atualizarLista();
      }, 1500);

    } catch (error) {
      console.error("Erro ao solicitar coleta:", error);
      mostrarNotificacao("Erro ao solicitar coleta", "error");
    }
  });

  /**
   * Mostra notificação temporária
   */
  function mostrarNotificacao(mensagem, tipo = "success") {
    const notif = document.createElement("div");
    notif.className = `notificacao ${tipo}`;
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${tipo === "success" ? "var(--ac1)" : "var(--err)"};
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      z-index: 9999;
      font-weight: 600;
      opacity: 0;
      transform: translateX(100px);
      transition: all 0.3s ease;
    `;
    notif.textContent = mensagem;
    document.body.appendChild(notif);

    setTimeout(() => {
      notif.style.opacity = "1";
      notif.style.transform = "translateX(0)";
    }, 10);

    setTimeout(() => {
      notif.style.opacity = "0";
      notif.style.transform = "translateX(100px)";
      setTimeout(() => notif.remove(), 300);
    }, 3000);
  }

  // Carrega a lista inicial
  carregarDescartes();

  // Atualiza a cada 30 segundos
  setInterval(carregarDescartes, 30000);
});
