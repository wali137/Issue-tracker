var crypto = require('crypto');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: global.auth
});

var mongoose = require('mongoose');
var issueModel = mongoose.model('issue');
var userModel = mongoose.model('user');
var companyModel = mongoose.model('company');
var releaseModel = mongoose.model('release');
var sprintModel = mongoose.model('sprint');

exports.signIn = function(req, res){
    userModel.findOne({ email: req.body.email, password: encrypt(req.body.password)}, function(err, doc){
        if(err || doc == null){
            res.json({error: true, message: "Invalid Email or Password!"});
            return;
        }
        res.json({error: false, user: doc});
    });
};
exports.register = function(req, res){
    new companyModel({title: req.body.companyTitle}).save(function(err, cmp){
        if(err){
            res.json({error: true});
            return;
        }
        delete req.body.companyTitle;
        req.body.companyId = cmp._id;
        req.body.password = encrypt(req.body.password);

        new userModel(req.body).save(function(err, doc){
            if(err){
                res.json({error: true});
                return;
            }
            res.json({error: false, user: doc});
        });
    });
};
exports.registerUser = function(req, res){
    req.body.password = encrypt(req.body.password);
    new userModel(req.body).save(function(err, doc){
        if(err){
            res.json({error: true});
            return;
        }
        res.json({error: false, user: doc});
    });
};

exports.allIssues = function(req, res){
    issueModel.find(req.body, function(err, docs){
        if(err){
            res.json({error: true});
            return;
        }
        res.json({error: false, issues: docs});
    });
};
exports.saveIssue = function(req, res){
    new issueModel(req.body).save(function(err, doc){
        if(err){
            res.json({error: true});
            return;
        }
        res.json({error: false, issue: doc});
    });
};
exports.updateIssue = function(req, res){
    issueModel.update({_id: req.body._id}, {$set: {title: req.body.title, description: req.body.description, user: req.body.user, severity: req.body.severity, status: req.body.status, sprint: req.body.sprint, release: req.body.release}}, {}, function(err, numAffected){
        if(err){
            res.json({error: true});
            return;
        }
        res.json({error: false, numAffected: numAffected});
    });
};
exports.removeIssue = function(req, res){
    issueModel.remove({_id: req.body._id}, function(err){
        if(err){
            res.json({error: true});
            return;
        }
        else{
            res.json({error: false});
        }
    });
};

exports.allUsers = function(req, res){
    userModel.find(req.body, function(err, docs){
        if(err){
            res.json({error: true});
            return;
        }
        res.json({error: false, users: docs});
    });
};
exports.removeUser = function(req, res){
    userModel.remove({_id: req.body._id}, function(err){
        if(err){
            res.json({error: true});
            return;
        }
        else{
            res.json({error: false});
        }
    });
};
exports.inviteUser = function(req, res){
    userModel.findOne({email: req.body.receiver}, function(err, doc){
        if(err || doc != null){
            res.json({error: true, message: "User Already Exists!"});
            return;
        }
        var code = encrypt(req.body.receiver), cid = req.body.companyId;
        var mailOptions = {
            from: global.from,
            to: req.body.receiver,
            subject: req.body.sender + " has invited you to join Issue Tracker.",
            text: req.body.sender + " has invited you to join Issue Tracker.",
            html: req.body.sender + " has invited you to join Issue Tracker. <br> <br>"
                + "Click on the link below to join the company, <br>"
                + "<a href='"+global.host+"invite/" + code + "/" + cid + "'>"+global.host+"invite/" + code + "/" + cid + " </a><br>"
        };
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                res.json({error: true, message: "Invalid Email Address!"});
            }else{
                res.json({error: false, message: "Invitation sent to " + req.body.receiver + "!"});
            }
        });
    });
};
exports.validateInvite = function(req, res){
    try{
        var cid = req.params.cid, email = decrypt(req.params.code);
        companyModel.findOne({_id: cid}, function(err, doc){
            if(err || doc == null){
                res.render('invitation', {companyTitle: "", email: "", cid: ""});
                return;
            }
            res.render('invitation', {companyTitle: doc.title, email: email, cid: cid});
        });
    }catch(err){
        res.render('invitation', {companyTitle: "", email: "", cid: ""});
    }
};

exports.allReleases = function(req, res){
    releaseModel.find(req.body, function(err, docs){
        if(err){
            res.json({error: true});
            return;
        }
        res.json({error: false, releases: docs});
    });
};
exports.saveRelease = function(req, res){
    new releaseModel(req.body).save(function(err, doc){
        if(err){
            res.json({error: true});
            return;
        }
        res.json({error: false, release: doc});
    });
};
exports.removeRelease = function(req, res){
    releaseModel.remove({_id: req.body._id}, function(err){
        if(err){
            res.json({error: true});
            return;
        }
        else{
            res.json({error: false});
        }
    });
};

exports.allSprints = function(req, res){
    sprintModel.find(req.body, function(err, docs){
        if(err){
            res.json({error: true});
            return;
        }
        res.json({error: false, sprints: docs});
    });
};
exports.saveSprint = function(req, res){
    new sprintModel(req.body).save(function(err, doc){
        if(err){
            res.json({error: true});
            return;
        }
        res.json({error: false, sprint: doc});
    });
};
exports.removeSprint = function(req, res){
    sprintModel.remove({_id: req.body._id}, function(err){
        if(err){
            res.json({error: true});
            return;
        }
        else{
            res.json({error: false});
        }
    });
};

function encrypt(text){
    var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}
function decrypt(text){
    var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}