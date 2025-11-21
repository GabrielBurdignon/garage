package garage.manager.project.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UsuarioSignupRequest {

    @NotBlank @Size(min = 3, max = 120)
    private String nome;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6, max = 100)
    private String senha;
}
