package garage.manager.project.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import garage.manager.project.enums.Papel;
import garage.manager.project.enums.StatusFuncionario;
import garage.manager.project.enums.TurnoFuncionario;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "tb_funcionarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Funcionario extends Usuario {

    @Column(name = "turno", nullable = false)
    private TurnoFuncionario turno;

    @Column(name = "status", nullable = false)
    private StatusFuncionario status;

    @Column(name = "salario", nullable = false)
    private BigDecimal salario;

    @Column(name = "cpf", nullable = false)
    private String cpf;

    @Column(name = "telefone", nullable = false)
    private String telefone;

    // @Column(name="senha", nullable = false)
    // private String senha;

    @Column(name = "cargo", nullable = false)
    private String cargo;

    @Column(name = "data_de_admissao", nullable = false)
    private LocalDate dataDeAdmissao;

    public Funcionario(Papel papel,String nome, String email, String senha, TurnoFuncionario turno, StatusFuncionario status, BigDecimal salario, String cpf, String telefone, LocalDate dataDeAdmissao) {
        super(nome, email, senha, papel);
        this.turno = turno;
        this.status = status;
        this.salario = salario;
        this.cpf = cpf;
        this.telefone = telefone;
        this.dataDeAdmissao = dataDeAdmissao;
    }
}
