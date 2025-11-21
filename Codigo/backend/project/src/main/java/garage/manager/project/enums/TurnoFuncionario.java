package garage.manager.project.enums;

public enum TurnoFuncionario {
    MANHA ("MANHÃ"),
    TARDE ("TARDE"),
    NOITE ("NOITE");

    private String turno;

    TurnoFuncionario(String turno){
        this.turno = turno;
    }

    public String getTurno(){
        return this.turno;
    }
}
