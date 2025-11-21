// URL base do backend
const API_URL = "http://localhost:8080/pecas";

// Elemento tbody onde as peças serão listadas
const listaPecas = document.getElementById("lista-pecas");

// Função para carregar todas as peças
async function carregarPecas() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao buscar peças");

    const pecas = await response.json();

    pecas.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

    listaPecas.innerHTML = "";

    pecas.forEach(peca => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${peca.nome}</td>
        <td class="quantidade">${peca.quantidade}</td>
        <td>${peca.estoqueMinimo}</td>
        <td>${peca.sku}</td>
        <td class="acoes">
          <button class="btn-acao btn-mais" data-id="${peca.id}">+ Estoque</button>
          <button class="btn-acao btn-menos" data-id="${peca.id}">- Estoque</button>
          <button class="btn-acao btn-editar" data-id=${peca.id}">Editar</button>
        </td>
      `;
      listaPecas.appendChild(tr);
      const btnmenos = tr.querySelector(".btn-menos");
      btnmenos.addEventListener('click', () => adicionarDescarte(peca.sku));
    });

    ligarEventos();

  } catch (error) {
    console.error("Erro ao carregar peças:", error);
    alert("❌ Não foi possível carregar a lista de peças.");
  }
}

function mostrarNotificacao(msg, tipo) {
  Toastify({
    text: msg,
    duration: 3000,
    gravity: "top",
    position: "right",
  }).showToast();
}

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
      

    } catch (error) {
      console.error("Erro ao adicionar descarte:", error);
      mostrarNotificacao(error.message, "error");
    }
  }

// Função para atualizar quantidade no backend
async function atualizarQuantidade(id, novaQuantidade) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar peça");
    const peca = await response.json();

    // Atualiza quantidade
    peca.quantidade = novaQuantidade;

    // Envia atualização
    const updateResponse = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(peca),
    });

    if (!updateResponse.ok) throw new Error("Erro ao atualizar peça");

    carregarPecas();

  } catch (error) {
    console.error("Erro ao atualizar quantidade:", error);
    alert("❌ Não foi possível atualizar a quantidade.");
  }
}

// Função para ligar eventos aos botões
function ligarEventos() {
  const btnMais = document.querySelectorAll(".btn-mais");
  const btnMenos = document.querySelectorAll(".btn-menos");

  btnMais.forEach(btn => {
    btn.addEventListener("click", () => {
      const tr = btn.closest("tr");
      const qtdAtual = parseInt(tr.querySelector(".quantidade").textContent);
      atualizarQuantidade(btn.dataset.id, qtdAtual + 1);
    });
  });

  btnMenos.forEach(btn => {
    btn.addEventListener("click", () => {
      const tr = btn.closest("tr");
      const qtdAtual = parseInt(tr.querySelector(".quantidade").textContent);
      if (qtdAtual > 0) {
        atualizarQuantidade(btn.dataset.id, qtdAtual - 1);
      } else {
        alert("⚠️ Estoque não pode ser menor que zero!");
      }
    });
  });
}

// Carrega peças ao iniciar
document.addEventListener("DOMContentLoaded", carregarPecas);
