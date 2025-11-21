package garage.manager.project.service;

import java.util.List;

import org.springframework.stereotype.Service;

import garage.manager.project.dto.FornecedorDto;
import garage.manager.project.enums.TipoMaterial;
import garage.manager.project.exceptions.FornecedorJaExisteException;
import garage.manager.project.exceptions.FornecedorNaoExisteException;
import garage.manager.project.model.Fornecedor;
import garage.manager.project.repository.FornecedorRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FornecedorService {
    
    public final FornecedorRepository repository;

    public void criar(FornecedorDto dto){
        var fornecedorExiste = this.repository.findByCnpj(dto.cnpj());
        if(fornecedorExiste.isPresent()) throw new FornecedorJaExisteException();
        var fornecedor = Fornecedor.builder()
                            .nome(dto.nome())
                            .email(dto.email())
                            .cnpj(dto.cnpj())
                            .endereco(dto.endereco())
                            .tipoMaterial(TipoMaterial.valueOf(dto.tipoMaterial().toUpperCase()))
                            .build();
        this.repository.save(fornecedor);
    }

    public List<Fornecedor> listarTodos(){
        return this.repository.findAll();
    }

    public FornecedorDto listarFornecedor(String cnpj){
        var fornecedor = this.repository.findByCnpj(cnpj);
        if(fornecedor.isEmpty()) throw new FornecedorNaoExisteException();
        return new FornecedorDto(
            fornecedor.get().getNome(),
            fornecedor.get().getCnpj(),
            fornecedor.get().getEmail(), 
            fornecedor.get().getEndereco(),
            fornecedor.get().getTipoMaterial().toString()
        );
    }

    public void atualizar(FornecedorDto dto){
        var fornecedorOptional = this.repository.findByCnpj(dto.cnpj());
        if (fornecedorOptional.isEmpty()) {
            throw new FornecedorNaoExisteException();
        }
        var fornecedor = fornecedorOptional.get();
        fornecedor.setNome(dto.nome());
        fornecedor.setEmail(dto.email());
        fornecedor.setEndereco(dto.endereco());
        fornecedor.setTipoMaterial(TipoMaterial.valueOf(dto.tipoMaterial()));
        this.repository.save(fornecedor);

    }

    public void deletar(Long id){
        this.repository.deleteById(id);
    }
}
