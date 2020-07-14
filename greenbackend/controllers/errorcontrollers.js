const nodeMailer = require("nodemailer");
const Nexmo = require("nexmo");

module.exports = {
    sendError: async (req, res) => {
        try {
            if (req.body.email !== undefined) {
                const transporter = nodeMailer.createTransport({
                    service: "Gmail",
                    secure: false,
                    requireTLS: true,
                    auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_PASSWORD
                    }
                });
                const mailOptions = {
                    from: "adidasphatonline@gmail.com",
                    to: req.body.email,
                    subject: `Got error with your device ${req.params.deviceID}`,
                    text: "You are reported with an severe error at sensor, please contact your device company for more information"
                };
                await transporter.sendMail(mailOptions, function (err) {
                    if (err) {
                        console.log("Error occurs: %s", err);
                        return res.status(401).json({
                            error: err
                        });
                    } else {
                        return res.status(200).json({
                            type: "1",
                            message: "Email sent to " + req.body.email + ". Please check your mail please .."
                        });
                    }
                });
            } else if (req.body.phone !== undefined) {
                const nexmo = new Nexmo({
                    apiKey: process.env.API_KEY,
                    apiSecret: process.env.API_SECRET
                }, {debug: true});
                const newPhone = req.body.phone.replace("0", "84");
                const text = "You are reported with an severe error at sensor, please contact your device company for more information";
                await nexmo.message.sendSms("0943796709", newPhone, text, {
                    type: "unicode"
                }, (err, responseData) => {
                    if (err) {
                        return res.status(400).json({
                            error: err
                        });
                    } else {
                        if (responseData.messages[0]["status"] === "0") {
                            console.log(responseData);
                            return res.status(200).json({
                                type: "2",
                                message: "Message sent to " + req.body.phone + ". Please check  .."
                            });
                        } else {
                            return res.status(200).json({
                                type: "4",
                                message: `Message failed with error: ${responseData.messages[0]["error-text"]}`
                            });
                        }
                    }
                });
            } else {
                return res.status(200).json({
                    type: "3",
                    message: "Please choose notification through email or phone number"
                });
            }
        } catch (err) {
            return res.status(400).json({
                error: err
            });
        }
    }
};
