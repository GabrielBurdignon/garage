package garage.manager.project.exceptions;

public class ServicoNaoEncontradoException extends RuntimeException{
    public ServicoNaoEncontradoException() {
        super("Serviço não foi encontrado");
    }
}
