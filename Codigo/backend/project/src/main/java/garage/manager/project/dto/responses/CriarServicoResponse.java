package garage.manager.project.dto.responses;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CriarServicoResponse {
    private String placa;
    private BigDecimal preco;
    private String servico;
}
