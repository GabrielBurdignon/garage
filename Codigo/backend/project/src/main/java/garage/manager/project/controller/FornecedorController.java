package garage.manager.project.controller;

import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import garage.manager.project.dto.FornecedorDto;
import garage.manager.project.exceptions.FornecedorJaExisteException;
import garage.manager.project.exceptions.FornecedorNaoExisteException;
import garage.manager.project.service.FornecedorService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/fornecedor")
@RequiredArgsConstructor
public class FornecedorController {
    
    private final FornecedorService service;

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody FornecedorDto dto){
        try {
            this.service.criar(dto);
            return ResponseEntity.ok().body(Map.of("message", "Fornecedor criado com sucesso"));
        } catch (FornecedorJaExisteException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "erro",
                e.getMessage()
            ));
        }
    }

    @GetMapping
    public ResponseEntity<?> listarTodos(){
        try {
            var lista = this.service.listarTodos();
            return ResponseEntity.ok(lista);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "erro",
                e.getMessage()
            ));
        }
    }

    @GetMapping("/{cnpj}")
    public ResponseEntity<?> listarFornecedor(@PathVariable String cnpj){
        try {
            var fornecedor = this.service.listarFornecedor(cnpj);
            return ResponseEntity.ok(fornecedor);
        } catch (FornecedorNaoExisteException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "erro",
                e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody FornecedorDto dto){
        try {
            this.service.atualizar(dto);
            return ResponseEntity.ok().build();
        } catch (FornecedorNaoExisteException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "erro",
                e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id){
        try {
            this.service.deletar(id);
            return ResponseEntity.ok().build();
        } catch (FornecedorNaoExisteException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "erro",
                e.getMessage()
            ));
        }
    }
}
