package garage.manager.project.service;

import java.util.List;

import org.springframework.stereotype.Service;

import garage.manager.project.config.PasswordEncoderConfiguration;
import garage.manager.project.dto.UsuarioSignupRequest;
import garage.manager.project.model.Cliente;
import garage.manager.project.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClienteService {
    private final ClienteRepository clienteRepository;
    private final PasswordEncoderConfiguration passwordEncoderConfiguration;

    public void criarCliente(UsuarioSignupRequest request){
        var clienteExists = this.clienteRepository.findByEmail(request.getEmail());
        if (clienteExists.isPresent()) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }
        var hash = passwordEncoderConfiguration.passwordEncoder().encode(request.getSenha());
        var cliente = new Cliente(request.getNome(), request.getEmail(), hash);
        this.clienteRepository.save(cliente);
    }

    public List<Cliente> listarClientes() {
        return this.clienteRepository.findAll();
    }
}
