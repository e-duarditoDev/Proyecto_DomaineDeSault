package apirest.domaine.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice //convierte la clase en manejador global excepciones. Si salta excepcion en algun restController intercepta
public class GlobalExceptionHandler {
	//Con esta clase Spring sabe que hacer cuando encuentre una exception, 
	//evita se tengan que manejar en cada controller
	
	//Viene por aqui si falla @Valid o @NotBlank de los DTOs. No se para si encuentra uno, ex almacena una lista de todos los campos fallan
	@ExceptionHandler(MethodArgumentNotValidException.class)
	 public ResponseEntity<?> handleValidationErrors(MethodArgumentNotValidException ex) {

		//Construye estructura tipo clave (nombre campo que falla), valor (mensaje error) 
		//ambos de tipo <String, String>, un JSON contenedor de las excepciones
		Map<String, String> errores = new HashMap<>();

		//for (FieldError error: ...) por cada validacion fallida de la lista ex almacenala en error
		//getBindingResult() obtiene que fallo, que validacion rompio
		//getFieldErrors() datos del fallo asociado al campo (nombre campo, mensaje)
		for (FieldError error : ex.getBindingResult().getFieldErrors()) {
			
			//errores.put rellena el Map con los fallos encontrados en cada campo
			//getField() nombre del campo fallo
			//getDefaultMessage mensaje de la RuntimeException, del @Valid o de @NotBlank en el DTO
			errores.put(error.getField(), error.getDefaultMessage());
			 }
		
		return ResponseEntity.badRequest().body(errores);
		
		 }

	//Captura las RuntimeException, y si no lo maneja otro handler mas especifico, viene por aqui
	@ExceptionHandler(RuntimeException.class)
	 public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
		 return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
		 }
	 }
