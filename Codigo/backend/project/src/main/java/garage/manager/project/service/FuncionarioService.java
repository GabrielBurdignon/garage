package garage.manager.project.service;

import java.util.List;

import org.springframework.stereotype.Service;

import garage.manager.project.config.PasswordEncoderConfiguration;
import garage.manager.project.dto.FuncionarioDto;
import garage.manager.project.enums.Papel;
import garage.manager.project.enums.StatusFuncionario;
import garage.manager.project.enums.TurnoFuncionario;
import garage.manager.project.model.Funcionario;
import garage.manager.project.repository.FuncionarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FuncionarioService {
    
    private final FuncionarioRepository funcionarioRepository;
    private final PasswordEncoderConfiguration passwordEncoderConfiguration;
    private final EmailSenderService emailSenderService;


    public void salvarFuncionario(FuncionarioDto funcionario) {
        var funcionarioExists = funcionarioRepository.findByEmail(funcionario.email());
        if(funcionarioExists.isPresent()) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }
        var novoFuncionario = new Funcionario();
        novoFuncionario.setPapel(Papel.FUNCIONARIO);
        novoFuncionario.setNome(funcionario.nome());
        novoFuncionario.setEmail(funcionario.email());
        novoFuncionario.setSenhaHash(passwordEncoderConfiguration.passwordEncoder().encode(funcionario.senha()));
        novoFuncionario.setTurno(TurnoFuncionario.valueOf(funcionario.turno().toUpperCase()));
        novoFuncionario.setStatus(StatusFuncionario.valueOf(funcionario.status().toUpperCase()));
        novoFuncionario.setSalario(funcionario.salario());
        novoFuncionario.setCpf(funcionario.cpf());
        novoFuncionario.setTelefone(funcionario.telefone());
        novoFuncionario.setDataDeAdmissao(funcionario.dataAdmissao());
        novoFuncionario.setCargo(funcionario.cargo());
        this.funcionarioRepository.save(novoFuncionario);
        this.emailSenderService.enviarEmailSenhaFuncionario(novoFuncionario.getEmail(), novoFuncionario, funcionario.senha());
    }

    public List<Funcionario> listarFuncionarios() {
        return this.funcionarioRepository.findAll();
    }

    public void deletarFuncionario(String email) {
        var funcionario = funcionarioRepository.findByEmail(email);
        if(funcionario.isEmpty()) {
            throw new IllegalArgumentException("Funcionário não encontrado");
        }
        funcionarioRepository.delete(funcionario.get());
    }
}
