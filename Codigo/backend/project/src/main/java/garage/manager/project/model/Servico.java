package garage.manager.project.model;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;

import garage.manager.project.enums.StatusServico;
import garage.manager.project.enums.TipoServico;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_servicos")
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "servico_seq")
    @SequenceGenerator(name = "servico_seq", sequenceName = "servico_id_seq", allocationSize = 1)
    private Long id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoServico tipo;

    @Column(nullable = false)
    private BigDecimal preco;

    @Column(nullable = false, length = 255)
    private String descricao;

    @Column(nullable = false)
    private Double tamanhoCarro;

    @Column(nullable = false)
    private Duration tempo;

    @Column(nullable = false)
    private LocalDate dataDeEntregaDesejada;

    @Column(nullable = false)
    private String placaDoCarro;

    @Enumerated(EnumType.STRING)
    private StatusServico statusServico;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = true)
    private Usuario cliente;
}
