package apirest.domaine.modelo.dto;


import apirest.domaine.modelo.entities.Direccion;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class DireccionDto {
	
	private Long idDireccion;

    @NotBlank(message = "Indique la calle.")
    private String calle;

    @NotBlank(message = "Indique un numero de vivienda.")
    private String numero;

    private Integer codigoPostal;// no es vital para cumplir con reglas del negocio

    @NotBlank(message = "Indique una provincia.")
    private String provincia;

    @NotBlank(message = "Indique una localidad.")
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
//	
	
	public static DireccionDto convertToDto (Direccion direccion) {
		DireccionDto direccionDto = new DireccionDto();
		
		direccionDto.setIdDireccion(direccion.getIdDireccion());
		direccionDto.setCalle(direccion.getCalle());
		direccionDto.setCodigoPostal(direccion.getCodigoPostal());
		direccionDto.setLocalidad(direccion.getLocalidad());
		direccionDto.setNumero(direccion.getNumero());
		direccionDto.setProvincia(direccion.getProvincia());
		
		return direccionDto;
	}
	
	public static Direccion convertToEntity (DireccionDto dto) {
		Direccion direccion = new Direccion();
		
		direccion.setIdDireccion(dto.getIdDireccion());
		direccion.setCalle(dto.getCalle());
		direccion.setCodigoPostal(dto.getCodigoPostal());
		direccion.setLocalidad(dto.getLocalidad());
		direccion.setNumero(dto.getNumero());
		direccion.setProvincia(dto.getProvincia());
		
		return direccion;
	}
	
}
