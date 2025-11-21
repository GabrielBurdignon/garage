package garage.manager.project.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record FuncionarioDto(
    String nome,
    String email,
    String senha,
    BigDecimal salario,
    String cpf,
    String telefone,
    String turno,
    String status,
    LocalDate dataAdmissao,
    String cargo
) {
}
