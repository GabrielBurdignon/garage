package garage.manager.project.service;

import java.util.List;

import org.springframework.stereotype.Service;

import garage.manager.project.dto.DescarteDto;
import garage.manager.project.model.Descarte;
import garage.manager.project.repository.DescarteRepository;
import garage.manager.project.repository.PecaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class DescarteService {
    
    private final DescarteRepository descarteRepository;
    private final PecaRepository pecaRepository;

    @Transactional
    public void descartar(DescarteDto descarteDto){
        var pecaExists = this.pecaRepository.findBySku(descarteDto.sku());
        if(pecaExists.isEmpty()){
            throw new RuntimeException("ERRO: Peça não existe");
        }
        var descarte = Descarte.builder()
            .peca(pecaExists.get())
            .build();

        this.descarteRepository.save(descarte);
    }

    public List<Descarte> listarTodos(){
        return this.descarteRepository.findAll();
    }

    @Transactional
    public void deletar(Long id){
        this.descarteRepository.deleteById(id);
    }
}
