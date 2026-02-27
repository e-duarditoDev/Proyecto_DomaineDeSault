package apirest.domaine.modelo.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class DireccionDto {

	private String calle;
	private String numero;
	private int codigoPostal;
	private String poblacion; 
	private String localidad;
	
	
//	public static DireccionDto convertToDto (Direccion direccion) {
//		DireccionDto direccionDto = new DireccionDto();
//		
//		direccionDto.setCalle(direccion.getCalle());
//		direccionDto.setCodigoPostal(direccion.getCodigoPostal());
//		direccionDto.setLocalidad(direccion.getLocalidad());
//		
//		return direccionDto;
//	}
	
}
