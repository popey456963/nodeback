var Global = function() {};

Global.prototype.log = function(file, contents, status) {
    //console.log(file + " " + contents)
    file = file + ":";
    spaces = Array(11 - file.length).join(" ");
    switch (status) {
        case "success":
            console.log(file.title + spaces + contents.success);
            break;
        case "info":
            console.log(file.title + spaces + contents.info);
            break;
        case "error":
            console.log(file.title + spaces + contents.error);
        default:
            console.log(file + spaces + contents);
    }
};

module.exports = new Global();