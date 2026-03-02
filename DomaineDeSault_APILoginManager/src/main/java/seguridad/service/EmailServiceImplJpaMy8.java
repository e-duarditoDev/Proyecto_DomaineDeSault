package seguridad.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImplJpaMy8 implements EmailService{

	@Autowired
	private JavaMailSender mailSender;
	
	@Override
	public void sendEmailEs(String para, String link) {
		
		SimpleMailMessage correo = new SimpleMailMessage();
		correo.setTo(para);
		correo.setSubject("Confirmacion cuenta Domaine De Sault");
		correo.setText("Estimado cliente:\n"
				+ "Gracias por si interes en registrarse en Domaine De Sault y disfrutar de las ventajas del club Domaine.\n"
				+ "Por favor, pinche en el siguente link para completar el proceso: \n"
				+link);
		
		mailSender.send(correo);
		
		
		
//		 @Value("${sendgrid.api.key}")
//		 private String apiKey;
//		 
//		@Override
//		public void sendEmailEs(String para, String link) {
//			
//	        Email from = new Email("grupohemsa@gmail.com"); 
//	        String subject = "Confirma tu cuenta Domaine de Sault";
//
//	        Email toEmail = new Email(para);
//
//	        String contentText = "Pulsa aquí para confirmar tu cuenta:\n" + link;
//
//	        Content content = new Content("text/plain", contentText);
//
//	        Mail mail = new Mail(from, subject, toEmail, content);
//
//	        SendGrid sg = new SendGrid(apiKey);
//	        Request request = new Request();
//
//	        try {
//	            request.setMethod(Method.POST);
//	            request.setEndpoint("mail/send");
//	            request.setBody(mail.build());
//
//	            Response response = sg.api(request);
//
//	            System.out.println("Email enviado. Status: " + response.getStatusCode());
//
//	        } catch (IOException ex) {
//	            ex.printStackTrace();
//	        }
//			    
//		
		
	}
}
