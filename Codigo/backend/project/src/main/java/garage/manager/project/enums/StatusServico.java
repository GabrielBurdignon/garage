package garage.manager.project.enums;

public enum StatusServico {
    PRONTO ("PRONTO"),
    EM_ANDAMENTO ("EM ANDAMENTO"),
    CANCELADO ("CANCELADO");

    private String statusServico;

    StatusServico(String statusServico){
        this.statusServico = statusServico;
    }

    public String getStatusServico(){
        return this.statusServico;
    }
}
