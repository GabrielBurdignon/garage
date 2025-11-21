package garage.manager.project.enums;

public enum TipoMaterial {
    PECAS ("PEÇAS"),
    FERRAMENTAS ("FERRAMENTAS"),
    LUBRIFICANTES ("LUBRIFICANTES"),
    PNEUS ("PNEUS");

    private String tipoMaterial;

    TipoMaterial(String tipoMaterial){
        this.tipoMaterial = tipoMaterial;
    }

    public String getTipoMaterial(){
        return this.tipoMaterial;
    }
}
