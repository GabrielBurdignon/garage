package garage.manager.project.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import garage.manager.project.dto.DescarteDto;
import garage.manager.project.model.Descarte;
import garage.manager.project.service.DescarteService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/v1/descarte")
@RequiredArgsConstructor
public class DescarteController {

    private final DescarteService descarteService;

    @PostMapping
    public ResponseEntity<?> descartar(@RequestBody DescarteDto descarteDto) {
        try {
            this.descarteService.descartar(descarteDto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Descarte>> listarTodos(){
        var descartes = this.descarteService.listarTodos();
        return ResponseEntity.ok(descartes);        
    }   

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id){
        try {
            this.descarteService.deletar(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}