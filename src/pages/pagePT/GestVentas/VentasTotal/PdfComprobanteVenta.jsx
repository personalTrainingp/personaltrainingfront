import React from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
// import pdfFonts from "pdfmake/build/vfs_fonts";
import { fontsRoboto } from '@/assets/fonts/fontsRoboto'
pdfMake.vfs = fontsRoboto
export const PdfComprobanteVenta = ({id_venta, isPdfOpen}) => {
    // Crear un nuevo FormData
    
	var dd = {
		content: [
			{
				text: 'CONTRATO DE LOCACIÓN DE SERVICIOS',
				alignment: 'center',
				style: 'header'
			},
			{
				text: 'Conste por el presente documento, que se extiende por duplicado, el CONTRATO DE LOCACIÓN DE SERVICIOS (en adelante, el Contrato), que celebran los siguientes contratantes:',
			},
			{
				margin: [30, 10],
				ul: [
					'XXXXXXXXXXXXXXX identificada con RUC N° XXXXXXXXXX, con domicilio legal en Avenida XXXXXXX, distrito de XXXXX, provincia y departamento de Lima, debidamente representada por el Sr xxxxxxxxxxxxxxx, identificada con DNI N° XXXXXX, registrada en el REMYPE con el código XXXXXX, (en adelante, la “COMITENTE”).',
					'El “LOCADOR”,  conforme este se identifica en el Anexo 1 del Contrato, a quien en adelante se denominará “EL LOCADOR”.'
				]
			},
			{
				text: 'En lo sucesivo, LA COMITENTE y EL LOCADOR serán definidos conjunta e indistintamente como LAS PARTES.'
			},
			{
				text: 'PRIMERA: ANTECEDENTES'
			},
			{
				margin: [30, 10],
				ol: [
					'LA COMITENTE es una empresa dedicada al diseño e implementación de oficinas y servicios de arquitectura y diseño que requiere la contratación de los servicios indicados en el Anexo 1, para que sean prestados tanto en las propias instalaciones de la COMITENTE como en las instalaciones y lugares de obra de los clientes de la COMITENTE, según se detalle en el Anexo 1.',
					'EL LOCADOR presta de manera permanente los servicios indicados en el Anexo 1, para lo cual declara que cuenta con la experiencia, conocimientos, personal, equipos, herramientas y dispositivos necesarios para prestar servicios en las condiciones requeridas por la COMITENTE.',
					'Con estos antecedentes, las partes acuerdan celebrar un contrato de locación de servicios, en los siguientes términos:'
				]
			},
			{
				text: 'SEGUNDA: OBJETO DEL CONTRATO'
			},
			{
				text: 'Por el presente Contrato, LA COMITENTE contrata y EL LOCADOR se compromete a prestar los servicios indicados en el Anexo 1, conforme  a los alcances, reglas y términos contenidos en el Contrato, el Anexo y los documentos en virtud de los cuales el LOCADOR presentó su propuesta técnica y económica (en adelante, el “Servicio”)',
			},
			{
				text: 'El Servicio será prestado en el lugar de obras indicado por la COMITENTE, contenido en el Anexo 1.TERCERA: PLAZO'
			},
			{
				text: 'El plazo de vigencia del Contrato es el indicado en el Anexo 1. No existe renovación, ampliación, extensión o prórroga automática. Todo acuerdo para tal fin deberá ser celebrado de forma previa y por escrito. '
			},
			{
				text: 'TERCERA: CONTRAPRESTACIÓN'
			},
			{
				margin: [30, 10],
				ol: [
					'El monto de la contraprestación que LA COMITENTE deberá pagar a favor de EL LOCADOR es la indicada en el Anexo 1, conforme al cronograma de pagos y entregables ahí especificados. Este monto es bruto y comprende la prestación tota a ser pagada por la COMITENTE para la prestación del Servicio, por lo que el LOCADOR reconoce que no se le adeudará suma alguna adicional y renuncia a cualquier reclamación en tal sentido.',
					'La contraprestación indicada incluye el IGV y todo tributo que corresponda.'
				]
			},
			{
				text: 'CUARTA: FORMA DE PAGO'
			},
			{
				margin: [30, 10],
				ol: [
					'El pago de la contraprestación se realizará conforme al cronograma y entregables previstos en el Anexo 1.',
					'EL LOCADOR deberá emitir el comprobante de pago cumpliendo con las disposiciones del Reglamento de Comprobantes de Pago.  EL pago se realizará dentro de los 30 días contados desde la fecha de notificación del comprobante a la COMITENTE y siempre que esta haya dado conformidad al Servicio o a los entregables correspondientes del Servicio.'
				]
			},
			{
				text: 'QUINTA: DEL CARÁCTER DEL CONTRATO.'
			},
			{
				margin: [30, 10],
				ol: [
					'Las partes dejan constancia que el presente Contrato es de naturaleza civil y se rige por las disposiciones contenidas en los artículos 1764º y 1770º del Código Civil; por lo tanto, LA COMITENTE y EL LOCADOR reconocen que no se generará vínculo, derecho o expectativa de carácter laboral, por lo que no le corresponde a este último el pago de beneficios sociales.',
					'EL LOCADOR no podrá ceder su posición contractual, subcontratar terceros ni ceder su posición contractual, sin el previo y escrito consentimiento de LA COMITENTE.',
					'Si en alguna oportunidad la prestación del servicio requiere de apoyo, EL LOCADOR deberá poner el hecho en conocimiento de LA COMITENTE, e indicar la relación de personas que prestarán tal apoyo. Asimismo, si EL LOCADOR se valiera de terceros para la prestación del servicio contratado, LA COMITENTE queda liberada de cualquier responsabilidad frente a dicho personal, dada la naturaleza civil de la relación contractual entre LA COMITENTE y EL LOCADOR.'
				]
			},
			{
				text: 'SEXTA: DE LAS OBLIGACIONES DEL LOCADOR.'
			},
			{
				text: 'EL LOCADOR tendrá las siguientes obligaciones:'
			},
			{
				margin: [30, 10],
				ol: [
					'Presentará, a LA COMITENTE, juntamente con su comprobante de pago, un informe detallado sobre la prestación de servicio realizada durante el mes.',
					'Brindar toda su capacidad y experiencia profesional y técnica en la prestación del servicio que le toca brindar, ajustando su labor a las instrucciones e indicaciones que reciba del personal de LA COMITENTE.',
					'Utilizar las herramientas e implementos adecuados, de propiedad de EL LOCADOR, para el desarrollo del servicio objeto del presente Contrato.',
					'Asistir y respetar las fechas acordadas con LA COMITENTE conforme a lo establecido en la cláusula SEGUNDA.',
					'Desarrollar la prestación del servicio contratado empleando, para ello equipos de su propiedad, salvo el caso que LA COMITENTE asigne a EL LOCADOR un equipo determinado.',
					'Adoptar las medidas de seguridad y salubridad necesarias para salvaguardar su integridad y la de terceros, incluyendo los que contrate por propia cuenta y responsabilidad.',
					'Mantener en la más estricta confidencialidad el contenido del Contrato, así como de los procedimientos y/o métodos de trabajo de LA COMITENTE.',
					'Asumir todo gasto adicional (SCTR y otros seguros, en caso de que corresponda), salvo expreso pacto en contrario.',
					'Informar y solicitar autorización previa a LA COMITENTE si es que, para el desarrollo del servicio objeto del presente Contrato, EL LOCADOR se valdrá del apoyo de terceras personas, sean estas sus dependientes o terceros con cualquier naturaleza de vínculo contractual con EL LOCADOR. ',
					'Cumplir con todas las normas laborales, previsionales, civiles y/o administrativas que garanticen el efectivo cumplimiento de los derechos de sus dependientes o colaboradores, cualquiera sea la naturaleza del vínculo contractual que los una, según corresponda. LA COMITENTE no tendrá responsabilidad legal de ninguna naturaleza respecto de las personas de las que EL LOCADOR se valga para desarrollar su servicio.',
					'11.Dotar bajo su propio costo, de los implementos necesarios, de ser el caso, a los colaboradores, dependientes y/o ayudantes que coadyuven a EL LOCADOR a cumplir con el servicio objeto del presente Contrato.'
				]
			},
			{
				text: 'SÉPTIMA: DE LAS OBLIGACIONES DE LA COMITENTE.'
			},
			{
				text: 'LA COMITENTE tendrá las siguientes obligaciones:'
			},
			{
				margin: [30, 10],
				ol: [
					'Abonar la contraprestación convenida en la cláusula TERCERA del Contrato en la forma y oportunidades pactadas',
					'Dar aviso, en forma precisa, de la fecha, hora y lugar donde EL LOCADOR deberá iniciar la prestación del servicio.'
				]
			},
			{
				text: 'OCTAVA: DE LOS COMPROMISOS DE EL LOCADOR.'
			},
			{
				margin: [30, 10],
				ol: [
					'EL LOCADOR declara no haber contraído compromiso alguno anterior que le impida el cumplimiento de las obligaciones que, a su cargo, se establecen en el marco del Contrato, al cual le concede prioridad, comprometiéndose además a no adquirir compromiso para la prestación de servicios que igualmente le impida el cumplimiento de las obligaciones que, a su cargo, se establecen en el marco del Contrato sin la previa autorización de LA COMITENTE.',
					'Sin perjuicio de lo anteriormente señalado, en caso de que EL LOCADOR, por razones de seria afectación de su salud, en casos fortuitos o situaciones de fuerza mayor, todos ellos debidamente acreditados, se encontrase en la imposibilidad temporal de cumplir con las obligaciones inherentes al Contrato, podrá solicitar que se le brinden facilidades de tiempo y reprogramaciones que le permitan cumplir con sus obligaciones, con la finalidad de no perjudicar las necesidades de LA COMITENTE. Estas circunstancias no podrán considerarse como situaciones de incumplimiento por parte de EL LOCADOR, por lo que ambas partes deberán coordinar con la mayor buena fe y disposición, en aras de lograr los objetivos perseguidos en virtud del presente contrato.',
					'En los casos en que el Servicio deba prestarse en locaciones de clientes de la COMITENTE, el LOCADOR se obliga a cumplir las normas, reglamentos, políticas y disposiciones corporativas que establezcan los clientes de la COMITENTE, así como las medidas de seguridad y salud que correspondan para preservar la seguridad y salud de sus contratistas, personal del cliente de LA COMITENTE, personal de la COMITENTE y de terceros.',
					'EL LOCADOR se compromete a mantener indemne a LA COMITENTE frente de cualquier reclamo laboral, civil, penal, administrativo y/o de cualquier naturaleza que, sin importar la naturaleza del vínculo contractual que los una, alguna de las personas de las que se valga para el desarrollo del servicio objeto del Contrato pueda plantear.'
				]
			},
			{
				text: 'NOVENA:	CONFIDENCIALIDAD'
			},
			{
				margin: [30, 10],
				ol: [
					'	Se entenderá por “Información Confidencial” para los fines de este contrato, en relación al COMITENTE, sus funcionarios, accionistas, directores, sucursales, proveedores, clientes, potenciales clientes, prospectos comerciales,  y de forma meramente enunciativa, a lo siguiente: información y documentación del giro del negocio y actividades, Know How, signos distintivos, patentes, marcas, diseños industriales, modelos de utilidad, procesos y procedimientos, secretos profesionales, secretos industriales, secretos comerciales, secretos empresariales, planes de negocios, productos, servicios, información de marketing, información económica, contable, tributaria y/o financiera, información administrativa, información legal, información contractual, estrategias empresariales, información de clientes, potenciales clientes, proveedores y otros, bancos de datos personales y sus contenidos, información o documentación generada o relacionada con la celebración y ejecución del presente contrato, , investigaciones y trabajos en desarrollo o en etapa de experimentación, , información sobre materiales programas de computación, tecnología, planes de negocio, planes financieros, planes y proyecciones, propuestas de ventas o adquisiciones, operaciones de venta, licitaciones y postulaciones a concursos públicos, listas e información de contacto de clientes, potenciales clientes y prospectos comerciales o de clientes, estrategias de marketing, proyección de ventas, precios, información sobre productos o servicios, desarrollo de productos y/o servicios, propiedad intelectual e industrial, patrimonio, activos y pasivos, información societaria, procesos y procedimientos administrativos, judiciales y arbitrales, estructura de propiedad, estructura de costos, sistemas informativos, (software y hardware), dibujos, métodos, diseños, circuitos, bosquejos, formulas, procesos, datos, muestras, información de mercado y comercialización, listas de proveedores, el modo de funcionamiento y cualquier información, mecanismo, procedimiento, desarrollo, o forma de trabajo.',
					'	En consecuencia, el LOCADOR se obliga a mantener absoluta confidencialidad y reserva sobre la Información Confidencial, no pudiendo de ninguna manera y bajo ninguna circunstancia, total o parcialmente, reproducirla, distribuirla, comercializarla, transferirla, cederla, comunicarla, difundirla, licenciarla, divulgarla, revelarla, modificarla, transformarla para uso personal o de alguna forma hacer de conocimiento de terceros o entregarla en propiedad, uso o disfrute, ni a título gratuito no oneroso; sin una previa y expresa autorización de EL COMITENTE.',
					'	La Información Confidencial sólo podrá ser usada por el LOCADOR únicamente y de manera restringida para los fines de la ejecución del presente Contrato y siempre bajo conocimiento y supervisión del COMITENTE, no pudiendo ser utilizada por EL LOCADOR, ni mucho menos transmitida, revelada o comentada a terceros u otros locadores de EL COMITENTE, sin expreso consentimiento, y por escrito, de EL COMITENTE.',
					'	En general, la obligación de confidencialidad incluye toda información que no sea de dominio público, es decir, que esté en posesión o sea de propiedad de EL COMITENTE, o que se utilice en las actividades que éste realiza.',
					'	En caso de que EL LOCADOR fuera legal o judicialmente requerido para revelar cualquier tipo de información sobre la cual exista obligación de confidencialidad, se compromete a notificar de esta circunstancia a EL COMITENTE dentro de las veinticuatro (24) horas de recibido dicho requerimiento, para que éste pueda tomar las medidas necesarias para cautelar su derecho a la privacidad.',
					'	Asimismo, dado el carácter confidencial de gran parte de la información a la cual podrá tener acceso EL LOCADOR, aquel prestará sus servicios en forma exclusiva, no pudiendo desarrollar labor alguna a favor de otras personas naturales y/o jurídicas distintas a EL COMITENTE, salvo que medie autorización expresa para ello.',
					'	Debido a la titularidad de EL COMITENTE respecto de la Información Confidencial, el deber de confidencialidad y reserva se mantendrá de forma indefinida en el tiempo y no finaliza con la extinción del vínculo contractual entre EL COMITENTE y EL LOCADOR. Por ello, cualquier vulneración a dicho deber de confidencialidad podrá ser objeto de una indemnización por daños y perjuicios que podrá ser reclamada por EL COMITENTE. ',
					'	EL LOCADOR reconoce y acepta que la divulgación y/o utilización no autorizada de información y documentación reservada materia de EL COMITENTE, puede configurar, cuando sea el caso, los delitos previstos en el Título VII (contra los derechos intelectuales) del Código Penal, así como cualesquiera que puedan configurarse.',
					'	Durante los doce meses posteriores a la terminación del presente acuerdo, EL LOCADOR se encuentra prohibido y por lo tanto no podrá emplear, directamente o a través de terceras personas, empleados o contratistas de EL COMITENTE o de empresas vinculadas al COMITENTE.',
					'	El LOCADOR, durante la vigencia del contrato o incluso terminado el mismo, de forma indefinida en el tiempo, se encontrará prohibido de fomentar, inducir, facilitar o influenciar para la contratación de empleados del COMITENTE por parte de personas jurídicas y personas naturales que realicen actividades que compitan directa o indirectamente, total o parcialmente, con el COMITENTE, o para que dichos empleados renuncien a sus puestos con el COMITENTE.',
					'	Durante los doce meses posteriores a la terminación del presente acuerdo, EL LOCADOR tampoco podrá relacionarse comercialmente o intentar inducir a algún cliente actual de EL COMITENTE o en expectativa, cuya cuenta haya atendido o supervisado en el último año anterior a la finalización de su relación contractual con EL COMITENTE, a que lleve su relación comercial con EL COMITENTE o sus filiales a otra empresa.',
					'	El incumplimiento por parte de EL LOCADOR de cualquiera de las obligaciones contenidas en esta cláusula facultará a EL COMITENTE a iniciar las acciones legales que pudieran corresponder en defensa de sus derechos y a obtener la indemnización por daños y perjuicios a que hubiera lugar.”',
				]
			},
			{
				text: 'DÉCIMA: NO COMPETENCIA.'
			},
			{
				margin: [30, 10],
				ol: [
					'EL LOCADOR, en virtud de esta cláusula, se obliga a no celebrar contratos bajo ninguna modalidad, sea civil o laboral, a título oneroso o gratuito, con personas jurídicas o personas naturales que directamente o de forma indirecta a través de terceros, realicen actividades, negocios, ofrezcan productos o provean servicios que puedan considerarse como competencia directa o indirecta, total o parcial, de LA COMITENTE.',
					'Esta obligación tendrá una vigencia de un (01) año contado desde la fecha en que el presente contrato o cualquiera de sus adendas haya vencido o terminado bajo cualquier circunstancia.',
					'El incumplimiento de esta obligación implicará la automática presunción de que EL LOCADOR ha incumplido los deberes de confidencialidad y reserva previstos en este contrato, y facultará a LA COMITENTE a iniciar las acciones legales necesarias para obtener los resarcimientos por daños y perjuicios que se generen por el incumplimiento de esta cláusula y de la que regula el deber de confidencialidad, sin perjuicio de cualquier otro daño o perjuicio que se pudiese generar.',
				]
			},
			{
				text: 'DÉCIMA PRIMERA: PROPIEDAD INTELECTUAL'
			},
			{
				margin: [30, 10],
				ol: [
					'EL LOCADOR reconoce y acepta que todo desarrollo intelectual, profesional o técnico que realice durante el Contrato y con ocasión de mismo, es y será de propiedad exclusiva de LA COMITENTE, por lo que desde ya y mediante este documento renuncia expresamente a cualquier derecho de propiedad intelectual o industrial, derecho de autor o de obra, en favor de LA COMITENTE, de manera ilimitada en extensión, contenido y tiempo, incluyendo los derechos de explotación económicas de dichos derechos o propiedades y derechos de reconocimiento como autor. Esta renuncia incluye la renuncia al derecho y a la acción.',
					'2.EL LOCADOR reconoce y acepta que toda propiedad intelectual, industrial, derecho de autor, signo distintivo, patente, diseño, modelo de utilidad, software y, en general, cualquier elemento que represente algún derecho intelectual o creación, a la que acceda, utilice o conozca como consecuencia del ejercicio de su cargo, es de titularidad de LA COMITENTE o bien de terceros, por lo que reconoce que no tiene derecho alguno sobre las mismas ni pretenderá en forma alguna reclamarlo u obtenerlo, asumiendo responsabilidad en caso de actos que pretendan desconocer dicha titularidad.',
				]
			},
			{
				text: 'DÉCIMA TERCERA: DE LA RESOLUCIÓN DEL CONTRATO.'
			},
			{
				margin: [30, 10],
				ol: [
					'Constituirán causales de resolución automática del presente contrato, de pleno derecho y sin necesidad de declaración judicial, de conformidad con el artículo 1430° del Código Civil, el incumplimiento, por parte de “EL LOCADOR”, de cualquiera de las obligaciones contraídas en el presente Contrato, así como de las disposiciones dictadas por “LA COMITENTE”. ',
					'En dicho caso, LA COMITENTE requerirá a EL LOCADOR, para que cumpla la obligación no ejecutada, otorgándole un plazo no menor de cinco (05) días calendarios, bajo apercibimiento de que, de no procederse en tal sentido, el contrato quedará definitivamente resuelto. Si vencido el plazo señalado la parte notificada no cumple a satisfacción su obligación, el contrato quedará resuelto de pleno derecho, siendo de aplicación, en tal circunstancia, lo dispuesto por el segundo párrafo del artículo 1429º del Código Civil.  En dicho caso, la parte incumplidora se encontrará sujeta a la indemnización por los daños y perjuicios directos que se le haya ocasionado a su contraparte, hasta por el importe o valor de la obligación que no fue cumplida.',
					'Queda expresamente convenido que, en atención a lo dispuesto en el artículo 1430° del Código Civil, en caso la obligación omitida por EL LOCADOR no sea susceptible de subsanación o esta no resulte de utilidad para LA COMITENTE, el solo hecho de haberse detectado tal incumplimiento, implicará la resolución automática del contrato. En dicho caso, la parte incumplidora se encontrará sujeta a la indemnización por los daños y perjuicios directos que se le haya ocasionado a su contraparte, hasta por el importe o valor de la obligación que no fue cumplida.',
				]
			},
			{
				text: 'DÉCIMA CUARTA: TERMINACIÓN.'
			},
			{
				text: 'El presente contrato terminará por una de las siguientes causas, sin perjuicio de aquellas establecidas a lo largo del Contrato:'
			},
			{
				type: 'lower-alpha',
				ol: [
					'Acuerdo de las partes de poner fin a la relación contractual.',
					'Terminación unilateral e incausada por parte de LA COMITENTE, la cual deberá ser notificada a EL LOCADOR mediante comunicación escrita con anticipación de siete (7) días.',
					'Incumplimiento de alguna de las obligaciones por parte de alguna de las partes, para lo cual bastará que la parte afectada con el incumplimiento comunique a la otra parte su decisión de dar por terminado el presente Contrato.',
					'Muerte del LOCADOR.'
				]
			},
			{
				text: 'DÉCIMA QUINTA: DOMICILIO Y COMUNICACIONES'
			},
		],
		styles: {

			tableExample: {
				// fontSize: 10
				// margin: [0, 5, 0, 15]
			},
			subTitle: {
				fontSize: 12,
				bold: true,
				margin: [4, 10, 0, 7]
			},
			subSubTitle:{
				fontSize: 12,
				bold: true
			},
			header: {
				fontSize: 18,
				bold: true,
			},
			subHeader: {
				fontSize: 13,
			},
			quote: {
				italics: true
			},
			small: {
				fontSize: 8
			}
		}
		
	}
    
        const formData = new FormData();
        const pdfGenerator = pdfMake.createPdf(dd)
        // pdfGenerator.getBlob((blob)=>{
        //     // Crear un archivo para el FormData con el PDF generado
        //     formData.append('file', blob, `contrato-prov.pdf`);
        //     const url = URL.createObjectURL(blob)
        //     setUrl(url)
        // })
        // pdfGenerator.download()
  return (
    <div>PdfComprobanteVenta</div>
  )
}
