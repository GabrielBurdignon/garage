package garage.manager.project.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import garage.manager.project.dto.ServicoDto;
import garage.manager.project.dto.responses.CriarServicoResponse;
import garage.manager.project.enums.StatusServico;
import garage.manager.project.exceptions.ServicoNaoEncontradoException;
import garage.manager.project.model.Servico;
import garage.manager.project.service.ServicoService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/servico")
public class ServicoController {
    private final ServicoService servicoService;

    public ServicoController(ServicoService servicoService) {
        this.servicoService = servicoService;
    }

    @PostMapping
    public ResponseEntity<CriarServicoResponse> criarServico(@RequestBody ServicoDto dto) {
        return ResponseEntity.ok(servicoService.criarServico(dto));
    }

    @PostMapping("/entregar/{id}")
    public ResponseEntity<?> entregarServico(@PathVariable Long id) {
        try {
            servicoService.entregarServico(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<Page<Servico>> listarTodosServicos(@RequestParam(value = "pagina") Integer pagina,
            @RequestParam(value = "tamanho") Integer tamanho,
            @RequestParam(value = "orderBy", defaultValue = "nome") String orderBy,
            @RequestParam(value = "direcao", defaultValue = "ASC") String direcao) {
        StatusServico statusServico = StatusServico.EM_ANDAMENTO;
        var servicos = servicoService.listarTodosServicosEmAndamento(pagina, tamanho, orderBy, direcao, statusServico);
        return ResponseEntity.ok().body(servicos);
    }

    @GetMapping("/prontos")
    public ResponseEntity<Page<Servico>> listarTodosServicosProntos(@RequestParam(value = "pagina") Integer pagina,
            @RequestParam(value = "tamanho") Integer tamanho,
            @RequestParam(value = "orderBy", defaultValue = "nome") String orderBy,
            @RequestParam(value = "direcao", defaultValue = "ASC") String direcao) {
        StatusServico statusServico = StatusServico.PRONTO;
        var servicos = servicoService.listarTodosServicosEmAndamento(pagina, tamanho, orderBy, direcao, statusServico);
        return ResponseEntity.ok().body(servicos);
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Servico>> listarTodosServicosPeloTipo(@PathVariable String tipo) {
        var servicos = servicoService.listarTodosServicosPeloTipo(tipo);
        return ResponseEntity.ok().body(servicos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        servicoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}