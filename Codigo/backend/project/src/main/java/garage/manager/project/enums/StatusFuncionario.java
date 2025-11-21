package garage.manager.project.enums;

public enum StatusFuncionario {
    ATIVO ("ATIVO"),
    INATIVO ("INATIVO"),
    FERIAS ("FERIAS");

    private String status;

    StatusFuncionario(String status){
        this.status = status;
    }

    public String getstatus(){
        return this.status;
    }
}
