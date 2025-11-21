package garage.manager.project.exceptions;

public class FornecedorNaoExisteException extends RuntimeException{
    public FornecedorNaoExisteException(){
        super("O fornecedor nao existe");
    }
}
