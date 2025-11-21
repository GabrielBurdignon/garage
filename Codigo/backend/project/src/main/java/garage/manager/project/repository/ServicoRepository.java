package garage.manager.project.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import garage.manager.project.enums.StatusServico;
import garage.manager.project.enums.TipoServico;
import garage.manager.project.model.Servico;

@Repository
public interface ServicoRepository extends JpaRepository<Servico, Long> {

    List<Servico> findByTipo(TipoServico tipo);
    Page<Servico> findByStatusServico(StatusServico statusServico, PageRequest pageRequest);
    List<Servico> findByDataDeEntregaDesejadaOrderByDataDeEntregaDesejadaAsc(LocalDate dataDeEntregaDesejada);
}
