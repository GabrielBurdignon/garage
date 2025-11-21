package garage.manager.project.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import garage.manager.project.model.Descarte;

@Repository
public interface DescarteRepository extends JpaRepository<Descarte, Long>{
}
