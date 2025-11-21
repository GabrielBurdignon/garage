package garage.manager.project.dto;

import java.time.LocalDate;

import garage.manager.project.enums.TipoServico;

public record ServicoDto(TipoServico tipo,
    String descricao,
    Double tamanhoCarro,
    String placaDoCarro,
    LocalDate dataDeEntregaDesejada,
    String emailCliente) {   
    
}