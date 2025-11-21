package garage.manager.project.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import garage.manager.project.model.Funcionario;
import garage.manager.project.model.Servico;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailSenderService {

    private final JavaMailSender javaMailSender;

    @Async
    public void sendEmail(String to, Servico servico) {
        String subject = "Confirmação de Agendamento de Serviço - Garage Manager";
        String body = this.htmlEmailAgendamento(servico);
        var message = javaMailSender.createMimeMessage();
        try {
            var helper = new org.springframework.mail.javamail.MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            javaMailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar e-mail", e);
        }
    }

    @Async
    public void enviarEmailSenhaFuncionario(String to, Funcionario funcionario, String senha) {
        String subject = "Sua Conta foi criada - Garage Manager";
        String body = this.htmlEmailSenhaFuncionario(funcionario.getNome(), funcionario.getEmail(), senha);
        var message = javaMailSender.createMimeMessage();
        try {
            var helper = new org.springframework.mail.javamail.MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            javaMailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar e-mail", e);
        }
    }

    @Async
    public void enviarEmailAoFinalizarServico(String to, Servico servico) {
        String subject = "Confirmação de Termino de Serviço - Garage Manager";
        String body = this.htmlEmailEntregaServico(servico);
        var message = javaMailSender.createMimeMessage();
        try {
            var helper = new org.springframework.mail.javamail.MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            javaMailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar e-mail", e);
        }
    }

    private String htmlEmailAgendamento(Servico servico) {
        String tipo = servico.getTipo().toString();
        String data = servico.getDataDeEntregaDesejada().toString();

        return """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirmação de Agendamento</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
                    <table role="presentation" style="width: 100%; background-color: #f4f4f4; padding: 20px 0;">
                        <tr>
                            <td align="center">
                                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                                                🚗 Garage Manager
                                            </h1>
                                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                                                Confirmação de Agendamento
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Content -->
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                                Prezado(a),
                                            </p>

                                            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 4px;">
                                                <p style="margin: 0 0 15px 0; color: #28a745; font-size: 18px; font-weight: 600;">
                                                    ✓ Agendamento Confirmado!
                                                </p>
                                                <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                                    Seu serviço foi agendado com sucesso e está sendo processado por nossa equipe.
                                                </p>
                                            </div>

                                            <!-- Service Details -->
                                            <table role="presentation" style="width: 100%; margin: 25px 0;">
                                                <tr>
                                                    <td style="padding: 15px; background-color: #f8f9fa; border-radius: 4px;">
                                                        <table role="presentation" style="width: 100%;">
                                                            <tr>
                                                                <td style="padding: 8px 0; color: #666666; font-size: 14px; width: 40%;">
                                                                    <strong>Serviço:</strong>
                                                                </td>
                                                                <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                                                                    """
                + tipo + """
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                                <strong>Data Desejada:</strong>
                            </td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                                """ + data
                + """
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    <p style="margin: 25px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                                        Nossa equipe entrará em contato em breve para confirmar os detalhes finais do seu serviço.
                                                    </p>

                                                    <p style="margin: 20px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                                        Se você tiver alguma dúvida, não hesite em nos contatar.
                                                    </p>
                                                </td>
                                            </tr>

                                            <!-- Footer -->
                                            <tr>
                                                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                                                    <p style="margin: 0 0 10px 0; color: #333333; font-size: 16px; font-weight: 600;">
                                                        Atenciosamente,
                                                    </p>
                                                    <p style="margin: 0 0 20px 0; color: #667eea; font-size: 16px; font-weight: 600;">
                                                        Equipe Garage Manager
                                                    </p>
                                                    <p style="margin: 0; color: #999999; font-size: 12px;">
                                                        © 2024 Garage Manager. Todos os direitos reservados.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                        """;
    }

    private String htmlEmailEntregaServico(Servico servico) {
        String tipo = servico.getTipo().toString();
        String data = servico.getDataDeEntregaDesejada().toString();

        return """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Finalização de serviço</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
                    <table role="presentation" style="width: 100%; background-color: #f4f4f4; padding: 20px 0;">
                        <tr>
                            <td align="center">
                                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                                                🚗 Garage Manager
                                            </h1>
                                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                                                Finalização de Serviço
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                                Prezado(a),
                                            </p>
                                            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 4px;">
                                                <p style="margin: 0 0 15px 0; color: #28a745; font-size: 18px; font-weight: 600;">
                                                    ✓ Serviço Finalizado!
                                                </p>
                                                <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                                    Seu serviço foi finalizado com sucesso. Você já pode buscar seu carro!
                                                </p>
                                            </div>
                                            <table role="presentation" style="width: 100%; margin: 25px 0;">
                                                <tr>
                                                    <td style="padding: 15px; background-color: #f8f9fa; border-radius: 4px;">
                                                        <table role="presentation" style="width: 100%;">
                                                            <tr>
                                                                <td style="padding: 8px 0; color: #666666; font-size: 14px; width: 40%;">
                                                                    <strong>Serviço:</strong>
                                                                </td>
                                                                <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                                                                    """
                + tipo + """
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                                <strong>Data de Entrega:</strong>
                            </td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                                """ + data
                + """
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <p style="margin: 20px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                                        Se você tiver alguma dúvida, não hesite em nos contatar.
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                                                    <p style="margin: 0 0 10px 0; color: #333333; font-size: 16px; font-weight: 600;">
                                                        Atenciosamente,
                                                    </p>
                                                    <p style="margin: 0 0 20px 0; color: #667eea; font-size: 16px; font-weight: 600;">
                                                        Equipe Garage Manager
                                                    </p>
                                                    <p style="margin: 0; color: #999999; font-size: 12px;">
                                                        © 2024 Garage Manager. Todos os direitos reservados.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                        """;
    }

    private String htmlEmailSenhaFuncionario(String nomeFuncionario, String email, String senhaTemporaria) {
        return """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Credenciais de Acesso</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
                    <table role="presentation" style="width: 100%; background-color: #f4f4f4; padding: 20px 0;">
                        <tr>
                            <td align="center">
                                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                                                🚗 Garage Manager
                                            </h1>
                                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                                                Credenciais de Acesso
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                                Olá <strong>"""
                + nomeFuncionario
                + """
                        </strong>,
                                                            </p>
                                                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                                                Sua conta foi criada com sucesso no sistema Garage Manager. Abaixo estão suas credenciais de acesso:
                                                            </p>
                                                            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 4px;">
                                                                <p style="margin: 0 0 15px 0; color: #667eea; font-size: 18px; font-weight: 600;">
                                                                    🔑 Suas Credenciais
                                                                </p>
                                                                <table role="presentation" style="width: 100%;">
                                                                    <tr>
                                                                        <td style="padding: 8px 0; color: #666666; font-size: 14px; width: 40%;">
                                                                            <strong>E-mail:</strong>
                                                                        </td>
                                                                        <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                                                                            """
                + email
                + """
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                                <strong>Senha Temporária:</strong>
                            </td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 10px; border-radius: 4px;">
                                """
                + senhaTemporaria
                + """
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 4px;">
                                                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                                                            ⚠️ <strong>Importante:</strong> Por segurança, recomendamos que você altere sua senha no primeiro acesso ao sistema.
                                                        </p>
                                                    </div>
                                                    <p style="margin: 20px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                                        Se você tiver alguma dúvida ou não solicitou este cadastro, entre em contato conosco imediatamente.
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                                                    <p style="margin: 0 0 10px 0; color: #333333; font-size: 16px; font-weight: 600;">
                                                        Atenciosamente,
                                                    </p>
                                                    <p style="margin: 0 0 20px 0; color: #667eea; font-size: 16px; font-weight: 600;">
                                                        Equipe Garage Manager
                                                    </p>
                                                    <p style="margin: 0; color: #999999; font-size: 12px;">
                                                        © 2024 Garage Manager. Todos os direitos reservados.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                        """;
    }

}