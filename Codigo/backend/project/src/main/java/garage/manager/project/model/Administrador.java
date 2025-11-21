package garage.manager.project.model;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "tb_administradores")
@Getter
@Setter
public class Administrador extends Usuario {
    public Administrador(String nome, String email, String senha) {
        super(nome, email, senha, garage.manager.project.enums.Papel.ADMIN);
    }
}
