package garage.manager.project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import garage.manager.project.model.Peca;

public interface PecaRepository extends JpaRepository<Peca, Long> {
    Optional<Peca> findBySku(String sku);
}
