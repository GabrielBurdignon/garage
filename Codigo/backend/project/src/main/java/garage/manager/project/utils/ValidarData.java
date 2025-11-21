package garage.manager.project.utils;

import java.time.LocalDate;

public final class ValidarData {

    public static boolean validarDataEntrega(LocalDate data) {
        return !data.isBefore(LocalDate.now()); 
    }

}
