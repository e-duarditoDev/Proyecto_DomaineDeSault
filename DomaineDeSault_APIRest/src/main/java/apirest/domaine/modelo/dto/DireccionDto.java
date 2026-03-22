package apirest.domaine.modelo.dto;


import apirest.domaine.modelo.entities.Direccion;
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
	private Integer codigoPostal;
	private String provincia; 
	private String localidad;
	
	
//	public static DireccionDto convertToDto (Direccion direccion) {
//		DireccionDto direccionDto = new DireccionDto();
//		
//		direccionDto.setCalle(direccion.getCalle());
//		direccionDto.setCodigoPostal(direccion.getCodigoPostal());
//		direccionDto.setLocalidad(direccion.getLocalidad());
//		direccionDto.setNumero(direccion.getNumero());
//		direccionDto.setProvincia(direccion.getProvincia());
//		
//		return direccionDto;
//	}
	
	
	public static Direccion convertToEntity (DireccionDto dto) {
		Direccion direccion = new Direccion();
		
		direccion.setCalle(dto.getCalle());
		direccion.setCodigoPostal(dto.getCodigoPostal());
		direccion.setLocalidad(dto.getLocalidad());
		direccion.setNumero(dto.getNumero());
		direccion.setProvincia(dto.getProvincia());
		
		return direccion;
	}
	
}
