package garage.manager.project.model;

import org.hibernate.validator.constraints.br.CNPJ;

import garage.manager.project.enums.TipoMaterial;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "tb_fornecedor")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Fornecedor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String nome;

    @Column(unique = true, nullable = false, length = 200)
    private String email;

    @CNPJ
    private String cnpj;

    @Column(nullable = true, length = 100)
    private String endereco;

    @Column(nullable = false)
    private TipoMaterial tipoMaterial;
}
