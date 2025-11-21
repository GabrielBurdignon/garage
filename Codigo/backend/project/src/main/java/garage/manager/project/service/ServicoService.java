package garage.manager.project.service;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import garage.manager.project.dto.ServicoDto;
import garage.manager.project.dto.responses.CriarServicoResponse;
import garage.manager.project.enums.StatusServico;
import garage.manager.project.enums.TipoServico;
import garage.manager.project.exceptions.DataDeEntregaSolicitadaInvalida;
import garage.manager.project.exceptions.ServicoNaoEncontradoException;
import garage.manager.project.model.Servico;
import garage.manager.project.repository.ClienteRepository;
import garage.manager.project.repository.ServicoRepository;
import garage.manager.project.utils.ValidarData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServicoService {

    private final ServicoRepository servicoRepository;
    private final EmailSenderService emailSenderService;
    private final ClienteRepository clienteRepository;

    @Transactional
    public CriarServicoResponse criarServico(ServicoDto dto) {
            if (dto.emailCliente() == null || dto.emailCliente().trim().isEmpty()) {
                throw new IllegalArgumentException("Email do cliente é obrigatório");
            }

            var clienteExists = this.clienteRepository.findByEmail(dto.emailCliente().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));
        if (!ValidarData.validarDataEntrega(dto.dataDeEntregaDesejada())) {
            throw new DataDeEntregaSolicitadaInvalida();
        }
        Servico servico = new Servico();
        servico.setTipo(dto.tipo());
        servico.setPreco(calcularPrecoServico(dto.tipo(), dto.tamanhoCarro()));
        servico.setDescricao(dto.descricao());
        servico.setTamanhoCarro(dto.tamanhoCarro());
        servico.setPlacaDoCarro(dto.placaDoCarro());
        servico.setTempo(Duration.ofDays(30));
        servico.setStatusServico(StatusServico.EM_ANDAMENTO);
        servico.setDataDeEntregaDesejada(dto.dataDeEntregaDesejada());
        servico.setCliente(clienteExists);
        
        this.servicoRepository.save(servico);
        this.emailSenderService.sendEmail(servico.getCliente().getEmail(), servico);
        return new CriarServicoResponse(
                servico.getPlacaDoCarro(),
                servico.getPreco(),
                servico.getTipo().name()
        );
    }

    public Page<Servico> listarTodosServicosEmAndamento(Integer page, Integer size, String orderby, String direction,StatusServico statusServico) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.Direction.valueOf(direction), orderby);
        Page<Servico> servicoEmAndamento = this.servicoRepository.findByStatusServico(statusServico, pageRequest);
        return servicoEmAndamento;
    }

    public Page<Servico> listarTodosServicosProntos(Integer page, Integer size, String orderBy, String direction, StatusServico statusServico){
        PageRequest pageRequest = PageRequest.of(page, size, Sort.Direction.valueOf(direction), orderBy);
        Page<Servico> servicosProntos = this.servicoRepository.findByStatusServico(statusServico, pageRequest);
        return servicosProntos;
    }

    public List<Servico> listarTodosServicosPeloTipo(String tipo) {
        return this.servicoRepository.findByTipo(TipoServico.valueOf(tipo.toUpperCase()));
    }

    @Transactional
    public void deletar(Long id) {
        this.servicoRepository.deleteById(id);
    }

    @Transactional
    public void entregarServico(Long id) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(ServicoNaoEncontradoException::new);
        servico.setStatusServico(StatusServico.PRONTO);
        this.servicoRepository.save(servico);
        this.emailSenderService.enviarEmailAoFinalizarServico(servico.getCliente().getEmail(), servico);
    }

    // MELHORAR ESSE CALCULO!!!
    private BigDecimal calcularPrecoServico(TipoServico tipoServico, Double tamanhoCarro) {
        if (tipoServico == TipoServico.POLIMENTO) {
            return BigDecimal.valueOf(tamanhoCarro * 5);
        }
        if (tipoServico == TipoServico.MARTELINHO) {
            return BigDecimal.valueOf(tamanhoCarro * 7);
        }
        if (tipoServico == TipoServico.MANUTENCAO) {
            return BigDecimal.valueOf(tamanhoCarro * 15);
        }
        if (tipoServico == TipoServico.VITRIFICACAO) {
            return BigDecimal.valueOf(tamanhoCarro * 12);
        }
        return BigDecimal.ZERO;
    }
}
