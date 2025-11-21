package garage.manager.project.security;

import garage.manager.project.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DbUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        var u = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        return User.withUsername(u.getEmail())
                .password(u.getSenhaHash()) // já é BCRYPT
                .roles(u.getPapel().name()) // ADMIN ou USER
                .build();
        // Se quiser grant authorities customizadas, mapeie aqui.
    }
}
