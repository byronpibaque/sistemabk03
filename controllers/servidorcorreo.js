var nodemailer = require('nodemailer');
// email sender function
exports.sendEmail = function(req, res){
    const {email,mensaje,asunto,claveAcceso,rutaXml,rutaPdf} = req.body;
// Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'tuahorrogi@gmail.com',
            pass: 'Byron9009'
        } 
    }); 
    // Definimos el email
    var mailOptions = {
        from: 'tuahorrogi@gmail.com',
        to: email,
        subject: asunto,
        text: mensaje,
        attachments: [
            {
                //archivo XML
                filename:claveAcceso+'.xml',
                path:rutaXml
            },
            {
                filename:claveAcceso+'.pdf',
                path:rutaPdf 
            }
        ]
    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info){
        if (error){
           
            res.send(500, error.message);
        } else {
           
            res.status(200).jsonp('Enviado');  
        }
    });
};

exports.enviar = function(req, res){
    const {email,mensaje,asunto,claveAcceso,rutaXml,rutaPdf} = req.body;
// Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'tuahorrogi@gmail.com',
            pass: 'Byron9009'
        }
    }); 
    // Definimos el email
    var mailOptions = {
        from: 'tuahorrogi@gmail.com',
        to: email,
        subject: asunto,
        text: mensaje
    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info){
        if (error){
            
            res.send(500).status(error.message);
        } else {
           
            res.status(200).jsonp('Enviado');  
        }
    });
};