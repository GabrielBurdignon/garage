package garage.manager.project.service;

import garage.manager.project.model.Peca;
import garage.manager.project.repository.PecaRepository;
import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PecaService {

    private final PecaRepository pecaRepository;

    public PecaService(PecaRepository pecaRepository) {
        this.pecaRepository = pecaRepository;
    }

    public List<Peca> listarTodas() {
        return pecaRepository.findAll();
    }

    public Peca buscarPorId(Long id) {
        return pecaRepository.findById(id).orElseThrow(() -> new RuntimeException("Peça não encontrada!"));
    }

    public Peca salvar(Peca peca) {
        return pecaRepository.save(peca);
    }

    public Peca atualizar(Long id, Peca pecaAtualizada) {
        Peca peca = buscarPorId(id);
        peca.setNome(pecaAtualizada.getNome());
        peca.setSku(pecaAtualizada.getSku());
        peca.setCategoria(pecaAtualizada.getCategoria());
        peca.setFornecedor(pecaAtualizada.getFornecedor());
        peca.setLocalizacao(pecaAtualizada.getLocalizacao());
        peca.setTipo(pecaAtualizada.getTipo());
        peca.setQuantidade(pecaAtualizada.getQuantidade());
        peca.setEstoqueMinimo(pecaAtualizada.getEstoqueMinimo());
        peca.setPrecoCusto(pecaAtualizada.getPrecoCusto());
        peca.setPrecoVenda(pecaAtualizada.getPrecoVenda());
        peca.setCodigoBarras(pecaAtualizada.getCodigoBarras());
        peca.setObservacoes(pecaAtualizada.getObservacoes());
        peca.setPeso(pecaAtualizada.getPeso());
        return pecaRepository.save(peca);
    }

    @Transactional
    public void deletar(Long id) {
        pecaRepository.deleteById(id);
    }
}
