package garage.manager.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


import garage.manager.project.repository.UsuarioRepository;

@Configuration
public class ApplicationConfig {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoderConfiguration passwordEncoderConfiguration;

    public ApplicationConfig(UsuarioRepository usuarioRepository,
                             PasswordEncoderConfiguration passwordEncoderConfiguration) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoderConfiguration = passwordEncoderConfiguration;
    }

    @Bean
    UserDetailsService userDetailsService() {
        return username -> this.usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(this.passwordEncoderConfiguration.passwordEncoder());

        return authProvider;
    }
}
