 // Rotas configuráveis para suas telas já criadas
    const ROUTES = {
      tela1: '/pmg-es-2025-2-ti4-3170100-garagemanager/Codigo/frontend/peca/peca.html',       // ajuste aqui o caminho real
      tela2: '/pmg-es-2025-2-ti4-3170100-garagemanager/Codigo/frontend/funcionarios/funcionarios.html',    // ajuste aqui o caminho real
      tela3: '/pmg-es-2025-2-ti4-3170100-garagemanager/Codigo/frontend/service/servico.html',     // ajuste aqui o caminho real
      tela4: '/pmg-es-2025-2-ti4-3170100-garagemanager/Codigo/frontend/lista_funcionario/lista.html',
      tela5: '/pmg-es-2025-2-ti4-3170100-garagemanager/Codigo/frontend/fornecedor/fornecedor.html'
    };

    function go(path){ if(path){ window.location.href = path; } else { alert('Defina a rota no objeto ROUTES.'); } }

    // Navegação dos atalhos
    document.addEventListener('DOMContentLoaded', ()=>{
      document.querySelectorAll('.tile[data-route]').forEach(el=>{
        el.addEventListener('click', ()=>{ go(ROUTES[el.dataset.route]); })
      })
    });

    // Sidebar mobile
    function toggleSidebar(){ document.getElementById('sidebar').classList.toggle('open') }
    function irCadastroProduto(e){ e && e.preventDefault(); alert('Ir para Cadastrar Produto'); /* window.location.href = '/cadastro-produto.html' */ }
    function sair(e){ e && e.preventDefault(); alert('Saindo...'); /* window.location.href = '/login.html' */ }
    function novoPedido(){ alert('Abrir modal: Novo pedido') }
    function novoCliente(){ alert('Abrir modal: Novo cliente') }
    function gerarRelatorio(){ alert('Gerando relatório...') }

    // Exportação simples para CSV
    function exportarCSV(){
      const rows = [['Nº Pedido','Cliente','Status','Valor','Data']];
      document.querySelectorAll('#tbody tr').forEach(tr=>{
        const cols = Array.from(tr.children).map(td=>td.textContent.trim());
        rows.push(cols);
      });
      const csv = rows.map(r=>r.map(v=>`"${v.replaceAll('"','""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'movimentacoes.csv'; a.click();
      URL.revokeObjectURL(url);
    }