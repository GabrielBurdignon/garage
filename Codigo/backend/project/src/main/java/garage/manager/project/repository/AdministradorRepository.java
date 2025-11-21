package garage.manager.project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import garage.manager.project.model.Administrador;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Long>{
    Optional<Administrador> findByEmail(String email);
}
