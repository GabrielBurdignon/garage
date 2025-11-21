package garage.manager.project.exceptions;

public class DataDeEntregaSolicitadaInvalida extends RuntimeException{
    public DataDeEntregaSolicitadaInvalida() {
        super("Data de entrega solicitada inválida. Deve ser a partir de hoje daqui 20 dias");
    }
}
