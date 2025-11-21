package garage.manager.project.exceptions;

public class FornecedorJaExisteException extends RuntimeException{
    public FornecedorJaExisteException(){
        super("O fornecedor ja existe");
    }
}
