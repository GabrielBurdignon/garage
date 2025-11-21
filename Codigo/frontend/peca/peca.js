// Formata campos de preço em moeda brasileira
function formatarMoeda(input) {
  let valor = input.value.replace(/\D/g, "");
  valor = (valor / 100).toFixed(2) + "";
  valor = valor.replace(".", ",");
  valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  input.value = "R$ " + valor;
}

document.addEventListener("DOMContentLoaded", () => {
  const precoCusto = document.getElementById("precoCusto");
  const precoVenda = document.getElementById("precoVenda");

  [precoCusto, precoVenda].forEach(input => {
    input.addEventListener("input", () => formatarMoeda(input));
    input.addEventListener("blur", () => {
      if (input.value === "" || input.value === "R$ ") {
        input.value = "R$ 0,00";
      }
    });
  });
});

// Selecionando Elementos
const inputsMap = {
  nomePeca: document.querySelector("#nomePeca"),
  sku: document.querySelector("#sku"),
  categoria: document.querySelector("#categoria"),
  fornecedor: document.querySelector("#fornecedor"),
  localizacao: document.querySelector("#localizacao"),
  quantidade: document.querySelector("#quantidade"),
  estoqueMin: document.querySelector("#estoqueMin"),
  precoCusto: document.querySelector("#precoCusto"),
  precoVenda: document.querySelector("#precoVenda"),
  codigoBarras: document.querySelector("#codigoBarras"),
  observacoes: document.querySelector("#observacoes"),
  peso: document.querySelector("#peso"),
};

// Itens da revisão
const revisaoItems = {
  nomePeca: document.querySelector(".revisao li:nth-child(1)"),
  sku: document.querySelector(".revisao li:nth-child(2)"),
  tipo: document.querySelector(".revisao li:nth-child(3)"),
  quantidade: document.querySelector(".revisao li:nth-child(4)"),
  estoqueMin: document.querySelector(".revisao li:nth-child(5)"),
  localizacao: document.querySelector(".revisao li:nth-child(6)"),
  fornecedor: document.querySelector(".revisao li:nth-child(7)"),
  precoCusto: document.querySelector(".revisao li:nth-child(8)"),
  precoVenda: document.querySelector(".revisao li:nth-child(9)"),
};

// Atualiza revisão
function atualizarRevisao() {
  revisaoItems.nomePeca.innerHTML = `<strong>Nome:</strong> ${inputsMap.nomePeca.value || "—"}`;
  revisaoItems.sku.innerHTML = `<strong>SKU:</strong> ${inputsMap.sku.value || "—"}`;
  revisaoItems.quantidade.innerHTML = `<strong>Qtd.:</strong> ${inputsMap.quantidade.value || 0}`;
  revisaoItems.estoqueMin.innerHTML = `<strong>Mínimo:</strong> ${inputsMap.estoqueMin.value || 0}`;
  revisaoItems.localizacao.innerHTML = `<strong>Localização:</strong> ${inputsMap.localizacao.value || "—"}`;
  revisaoItems.fornecedor.innerHTML = `<strong>Fornecedor:</strong> ${inputsMap.fornecedor.value || "—"}`;
  revisaoItems.precoCusto.innerHTML = `<strong>Preço custo:</strong> ${inputsMap.precoCusto.value || "—"}`;
  revisaoItems.precoVenda.innerHTML = `<strong>Preço venda:</strong> ${inputsMap.precoVenda.value || "—"}`;
}

Object.values(inputsMap).forEach(input => {
  input.addEventListener("input", atualizarRevisao);
});

const botoesTipo = document.querySelectorAll(".opcoes-tipo button");
let tipoSelecionado = "—";

// Funções auxiliares para trocar cor dos ícones
function toWhiteSrc(src) {
  if (!src) return src;
  if (src.includes("-verde")) return src.replace("-verde", "-branco");
  return src;
}
function toGreenSrc(src) {
  if (!src) return src;
  if (src.includes("-branco")) return src.replace("-branco", "-verde");
  if (src.includes("-verde")) return src;
  return src.replace(/(\.[a-zA-Z]+)$/, "-verde$1");
}

botoesTipo.forEach(btn => {
  const img = btn.querySelector("img");
  if (!img) return;
  const raw = img.getAttribute("src");
  const white = toWhiteSrc(raw);
  const green = toGreenSrc(white);
  img.dataset.white = white;
  img.dataset.green = green;
  img.src = white; // garante estado inicial branco
});

// Reset todos botões para branco
function resetTipoButtons() {
  botoesTipo.forEach(b => {
    b.classList.remove("ativo");
    const img = b.querySelector("img");
    if (img && img.dataset.white) img.src = img.dataset.white;
  });
}

// Clique em botão de tipo
botoesTipo.forEach(btn => {
  btn.addEventListener("click", () => {
    resetTipoButtons();
    btn.classList.add("ativo");
    const img = btn.querySelector("img");
    if (img && img.dataset.green) img.src = img.dataset.green;
    tipoSelecionado = btn.innerText;
    revisaoItems.tipo.innerHTML = `<strong>Tipo:</strong> ${tipoSelecionado}`;
  });
});

// Limpar
const btnLimpar = document.querySelector(".btn-limpar");

btnLimpar.addEventListener("click", () => {
  // Zera todos os campos
  Object.values(inputsMap).forEach(input => {
    if (input.tagName === "TEXTAREA" || input.type === "text" || input.type === "number") {
      input.value = "";
    }
  });

  // Reseta tipo + ícones
  tipoSelecionado = "—";
  resetTipoButtons();

  // Atualiza revisão zerada
  atualizarRevisao();
  revisaoItems.tipo.innerHTML = `<strong>Tipo:</strong> —`;
});

// Valida botão salvar
const btnSalvar = document.querySelector(".btn-principal");

btnSalvar.addEventListener("click", async (e) => {
  e.preventDefault();

  // Campos obrigatórios
  const faltando = [];

  if (!inputsMap.nomePeca.value.trim()) {
    faltando.push("Nome da Peça");
  }
  if (tipoSelecionado === "—") {
    faltando.push("Tipo");
  }
  if (!inputsMap.quantidade.value.trim()) {
    faltando.push("Quantidade");
  }
  if (!inputsMap.estoqueMin.value.trim()) {
    faltando.push("Estoque Mínimo");
  }

  if (faltando.length > 0) {
    alert("⚠️ Preencha os seguintes campos obrigatórios:\n- " + faltando.join("\n- "));
    return;
  }

  // Monta objeto com os dados da peça
  const peca = {
    nome: inputsMap.nomePeca.value.trim(),
    sku: inputsMap.sku.value.trim(),
    categoria: inputsMap.categoria.value.trim(),
    fornecedor: inputsMap.fornecedor.value.trim(),
    localizacao: inputsMap.localizacao.value.trim(),
    tipo: tipoSelecionado,
    quantidade: parseInt(inputsMap.quantidade.value) || 0,
    estoqueMinimo: parseInt(inputsMap.estoqueMin.value) || 0,
    precoCusto: inputsMap.precoCusto.value.replace(/\D/g, "") / 100 || 0,
    precoVenda: inputsMap.precoVenda.value.replace(/\D/g, "") / 100 || 0,
    codigoBarras: inputsMap.codigoBarras.value.trim(),
    observacoes: inputsMap.observacoes.value.trim(),
    peso: inputsMap.peso.value.trim()
  };

  try {
    const response = await fetch("http://localhost:8080/pecas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(peca),
    });

    if (!response.ok) {
      throw new Error("Erro ao salvar peça");
    }

    const data = await response.json();
    console.log("Peça salva:", data);
    alert("✅ Peça salva com sucesso!");

    // Limpa formulário depois de salvar
    btnLimpar.click();
    window.location.href = "listaPeca.html";
  } 
  catch (error) {
    console.error("Erro:", error);
    alert("❌ Não foi possível salvar a peça.");
  }
});

// Inicializa revisão na carga
atualizarRevisao();
