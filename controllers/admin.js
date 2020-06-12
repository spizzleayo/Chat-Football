const path = require('path');
const fs = require('fs');

module.exports = function (formidable, Club) {
    return {
        SetRouting: function (router) {
            router.get('/dashboard', this.adminPage);
            router.post('/uploadFile', this.uploadFile);
            router.post('/dashboard', this.adminPostPage);

        },
        adminPage: function (req, res) {
            res.render('admin/dashboard');
        },
        adminPostPage: function (req, res) {
            req.body.country = req.body.country.charAt(0).toUpperCase() + req.body.country.slice(1).toLowerCase();
            let { club, country, upload } = req.body;
            const newClub = new Club();
            newClub.name = club;
            newClub.country = country;
            newClub.image = upload;
            newClub.save((err) => {
                if (err) throw err;
                res.render('admin/dashboard');
            });
        },
        uploadFile: function (req, res) {
            const form = new formidable.IncomingForm();
            form.uploadDir = path.join(__dirname, '../public/uploads');

            form.on('file', (field, file) => {
                fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
                    if (err) throw err;
                    // console.log('File renamed successfully');
                });
            });

            form.on('error', (err) => {
                console.log(err);
            });
            form.on('end', () => {
                // console.log('File upload is successful');
            });

            form.parse(req);
        },

    };
};