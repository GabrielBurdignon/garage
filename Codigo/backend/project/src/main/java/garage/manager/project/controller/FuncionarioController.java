package garage.manager.project.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import garage.manager.project.dto.FuncionarioDto;
import garage.manager.project.service.FuncionarioService;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "*")     
@RequestMapping("/api/v1/funcionarios")
@RequiredArgsConstructor
public class FuncionarioController {
    
    private final FuncionarioService funcionarioService;

    @PostMapping
    public ResponseEntity<?> criarFuncionario(@RequestBody FuncionarioDto funcionario) {
        try{
            this.funcionarioService.salvarFuncionario(funcionario);
            return ResponseEntity.ok().build();
        }catch(Exception e){
            return ResponseEntity.badRequest().body(Map.of(
                "erro",
                e.getMessage()
            ));
        }
    }

    @GetMapping
    public ResponseEntity<?> listarFuncionarios() {
        try{
            var funcionarios = this.funcionarioService.listarFuncionarios();
            return ResponseEntity.ok(funcionarios);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(Map.of(
                "erro",
                e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<?> deletarFuncionario(@PathVariable String email) {
        try{
            this.funcionarioService.deletarFuncionario(email);
            return ResponseEntity.ok().build();
        }catch(Exception e){
            return ResponseEntity.badRequest().body(Map.of(
                "erro",
                e.getMessage()
            ));
        }
    }
}