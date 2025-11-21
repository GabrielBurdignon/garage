package garage.manager.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import garage.manager.project.dto.FuncionarioDto;
import garage.manager.project.model.Cliente;
import garage.manager.project.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM Usuario u WHERE u.papel = 'FUNCIONARIO'")
    List<FuncionarioDto> findFuncionarios();

    @Query("SELECT u FROM Usuario u WHERE u.email = :email AND u.papel = 'USER'")
    Optional<Cliente> findClienteByEmail(String email);
}
