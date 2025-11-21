package garage.manager.project.controller;

import garage.manager.project.dto.responses.LoginResponse;
import garage.manager.project.dto.responses.SignupResponse;
import garage.manager.project.dto.FuncionarioDto;
import garage.manager.project.dto.LoginRequest;
import garage.manager.project.dto.UsuarioSignupRequest;
import garage.manager.project.enums.Papel;
import garage.manager.project.model.Usuario;
import garage.manager.project.service.FuncionarioService;
import garage.manager.project.service.JwtService;
import garage.manager.project.service.AdministradorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AdministradorService usuarioService;
  private final FuncionarioService funcionarioService;
  private final JwtService jwtService;

  @PostMapping("/signup")
  public ResponseEntity<?> signup(@Valid @RequestBody UsuarioSignupRequest req) {
    Usuario saved = usuarioService.cadastrar(req, Papel.USER);
    return ResponseEntity.status(201).body(
        new SignupResponse(
            saved.getId(),
            saved.getNome(),
            saved.getEmail(),
            saved.getPapel().name()));
  }

  @PostMapping("/signup/funcionario")
  public ResponseEntity<?> signupWithRole(@Valid @RequestBody FuncionarioDto funcionarioDto) {
    try {
      this.funcionarioService.salvarFuncionario(funcionarioDto);
      return ResponseEntity.status(201).build();
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of(
          "erro",
          e.getMessage()
      ));
    }
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody @Valid LoginRequest loginRequest) {
    try{
      Usuario usuario = this.usuarioService.authenticate(loginRequest.email(), loginRequest.senha());
      String token = jwtService.generateToken(usuario);
      LoginResponse response = new LoginResponse(token, jwtService.getExpirationTime());
      return ResponseEntity.ok(response);
    }catch(Exception e){
      return ResponseEntity.status(401).body(Map.of(
          "erro",
          e.getMessage()
      ));
    }
  }
}
