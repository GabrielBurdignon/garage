package garage.manager.project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import garage.manager.project.model.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long>{
    @Query("SELECT c FROM Usuario c WHERE c.email = ?1 AND TYPE(c) = Cliente")
    Optional<Cliente> findByEmail(@Param("email") String email);
}
