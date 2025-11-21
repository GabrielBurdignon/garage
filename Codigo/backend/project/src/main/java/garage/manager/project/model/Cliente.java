package garage.manager.project.model;

import garage.manager.project.enums.Papel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("CLIENTE")
@NoArgsConstructor
public class Cliente extends Usuario {
    public Cliente(String nome, String email, String senha) {
        super(nome, email, senha, Papel.USER);
    }
}
