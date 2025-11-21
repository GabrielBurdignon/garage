package garage.manager.project.enums;

public enum TipoServico {
    POLIMENTO ("POLIMENTO"), 
    MARTELINHO ("MARTELINHO"), 
    MANUTENCAO ("MANUTENÇÃO"),
    VITRIFICACAO ("VITRIFICAÇÃO");

    private String tipoServico;

    TipoServico(String tipoServico) {
        this.tipoServico = tipoServico;
    }

    public String getTipoServico() {
        return this.tipoServico;
    }
}
