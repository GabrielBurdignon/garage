const modal = document.getElementById("modalCadastro");
const btnNovo = document.getElementById("btnNovoFornecedor");
const fecharModal = document.getElementById("fecharModal");
const form = document.getElementById("formFornecedor");
const lista = document.getElementById("fornecedoresLista");

const modalConfirmacao = document.getElementById("modalConfirmacao");
const fecharConfirmacao = document.getElementById("fecharConfirmacao");
const okConfirmacao = document.getElementById("okConfirmacao");

const API_URL = "http://localhost:8080/api/v1/fornecedor";

btnNovo.onclick = () => modal.classList.add("show");
fecharModal.onclick = () => modal.classList.remove("show");
modal.onclick = e => { if (e.target === modal) modal.classList.remove("show"); }

fecharConfirmacao.onclick = () => modalConfirmacao.classList.remove("show");
okConfirmacao.onclick = () => modalConfirmacao.classList.remove("show");
modalConfirmacao.onclick = e => { if (e.target === modalConfirmacao) modalConfirmacao.classList.remove("show"); }

async function carregarFornecedores() {
    lista.innerHTML = "";
    const res = await fetch(API_URL);
    if (res.ok) {
        const fornecedores = await res.json();
        fornecedores.forEach(f => adicionarLinha(f));
    }
}

function adicionarLinha(fornecedor) {
    const row = document.createElement("tr");
    row.dataset.id = fornecedor.id;
    row.innerHTML = `
        <td>${fornecedor.nome}</td>
        <td>${fornecedor.tipoMaterial}</td>
        <td>${fornecedor.email}</td>
        <td>
            <div class="actions">
                <button class="btn ghost btnEditar">Editar</button>
                <button class="btn btnExcluir" style="border-color: var(--err); color: var(--err);">Excluir</button>
            </div>
        </td>
    `;
    lista.appendChild(row);

    row.querySelector(".btnExcluir").onclick = () => deletarFornecedor(fornecedor.id, row);
    row.querySelector(".btnEditar").onclick = () => editarFornecedor(fornecedor);
}

form.onsubmit = async e => {
    e.preventDefault();
    const dto = {
        nome: form.nome.value,
        cnpj: form.cnpj.value,
        email: form.email.value,
        tipoMaterial: form.tipoMaterial.value,
        endereco: form.endereco.value
    };
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto)
    });
    if (res.ok) {
        modal.classList.remove("show");
        mostrarConfirmacao();
        form.reset();
        carregarFornecedores();
    } else {
        const err = await res.json();
        alert(err.erro);
    }
};

async function deletarFornecedor(id, row) {
    if (!confirm("Deseja realmente excluir este fornecedor?")) return;
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) row.remove();
    else {
        const err = await res.json();
        alert(err.erro);
    }
}

function editarFornecedor(fornecedor) {
    form.nome.value = fornecedor.nome;
    form.cnpj.value = fornecedor.cnpj;
    form.email.value = fornecedor.email;
    form.tipoMaterial.value = fornecedor.tipoMaterial;
    form.endereco.value = fornecedor.endereco;

    modal.classList.add("show");

    form.onsubmit = null;
    form.onsubmit = async e => {
        e.preventDefault();
        const dto = {
            id: fornecedor.id,
            nome: form.nome.value,
            cnpj: form.cnpj.value,
            email: form.email.value,
            tipoMaterial: form.tipoMaterial.value, 
            endereco: form.endereco.value
        };

        const res = await fetch(`${API_URL}/${fornecedor.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto)
        });

        if (res.ok) {
            modal.classList.remove("show");
            mostrarConfirmacao();
            form.reset();
            carregarFornecedores();
            form.onsubmit = enviarNovoFornecedor;
        } else {
            const err = await res.json();
            alert(err.erro);
        }
    };
}


function enviarNovoFornecedor(e) {
    e.preventDefault();
    form.onsubmit = async e => {
        e.preventDefault();
        const dto = {
            nome: form.nome.value,
            cnpj: form.cnpj.value,
            email: form.email.value,
            tipoMaterial: form.tipoMaterial.value,
            endereco: form.endereco.value
        };
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto)
        });
        if (res.ok) {
            modal.classList.remove("show");
            mostrarConfirmacao();
            form.reset();
            carregarFornecedores();
        } else {
            const err = await res.json();
            alert(err.erro);
        }
    };
}

function mostrarConfirmacao() {
    modalConfirmacao.classList.add("show");
}

function voltarDashboard() {
    window.location.href = "/pmg-es-2025-2-ti4-3170100-garagemanager/Codigo/frontend/dashboard/dashboard.html";
}

carregarFornecedores();
