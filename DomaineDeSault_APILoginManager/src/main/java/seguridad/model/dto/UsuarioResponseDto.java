package seguridad.model.dto;

public record UsuarioResponseDto (String nombre) {
	
}

//Record es forma moderna de crear Dto, evita getter and setter. A partir de Java 16
//El record genera:
//public final class UsuarioResponseDto { ->final es clase que no puede ser heredada
//    private final String nombre; -> final es una constante
//
//    public String nombre() {
//        return nombre;
//    }
//}
