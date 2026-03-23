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

    @NotBlank(message = "La calle es obligatoria.")
    private String calle;

    @NotBlank(message = "El número es obligatorio.")
    private String numero;

    private Integer codigoPostal;// no es vital para cumplir con reglas del negocio

    @NotBlank(message = "La provincia es obligatoria.")
    private String provincia;

    @NotBlank(message = "La localidad es obligatoria.")
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
