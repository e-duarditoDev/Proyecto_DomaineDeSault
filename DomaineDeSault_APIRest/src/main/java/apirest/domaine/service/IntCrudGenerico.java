package apirest.domaine.service;

import java.util.List;

public interface IntCrudGenerico <E, ID>{
	
	E findById (ID atributoId);
	List <E> findAll();
	E insertOne (E entidad);
	E updateOne (E entidad);
	int deleteOne(ID atributoId);
}
