var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var issueSchema = new Schema({}, { strict: false });
var issue = mongoose.model("issue", issueSchema);

var userSchema = new Schema({email: String, password: String, name: String, companyId: String}, { strict: false });
var user = mongoose.model("user", userSchema);

var companySchema = new Schema({title: String}, { strict: false });
var company = mongoose.model("company", companySchema);

var releaseSchema = new Schema({title: String, companyId: String}, { strict: false });
var release = mongoose.model("release", releaseSchema);

var sprintSchema = new Schema({title: String, companyId: String}, { strict: false });
var sprint = mongoose.model("sprint", sprintSchema);