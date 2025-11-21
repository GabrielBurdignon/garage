package garage.manager.project.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import garage.manager.project.dto.UsuarioSignupRequest;
import garage.manager.project.enums.Papel;
import garage.manager.project.model.Administrador;
import garage.manager.project.model.Usuario;
import garage.manager.project.repository.AdministradorRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdministradorService {

    private final AdministradorRepository administradorRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public Usuario cadastrar(UsuarioSignupRequest req, Papel papel) {
        this.administradorRepository.findByEmail(req.getEmail()).orElseThrow();
        var novoAdmin = new Administrador(req.getNome(), req.getEmail(), passwordEncoder.encode(req.getSenha()));
        return administradorRepository.save(novoAdmin);
    }

    public Usuario authenticate(String email, String senha){
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, senha)
        );
        return this.administradorRepository.findByEmail(email).orElseThrow();
    }

}