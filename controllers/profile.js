const path = require('path');
const fs = require('fs');
module.exports = function (async, Message, Users, formidable, FriendResult) {
    return {
        SetRouting: function (router) {
            router.get('/settings/profile', this.getprofilePage);
            router.post('/userupload', this.userUpload);
            router.post('/settings/profile', this.postProfilePage)
            router.get('/profile/:name', this.overviewPage);
            router.post('/profile/:name', this.overviewPostPage)
        },
        getprofilePage: function (req, res) {
            async.parallel([
                function (callback) {
                    Users.findOne({ 'username': req.user.username })
                        .populate('request.userId')
                        .exec((err, result) => {
                            callback(err, result);
                        });
                },
                function (callback) {
                    Message.aggregate([
                        {
                            $match: {
                                $or: [
                                    { 'senderName': req.user.username },
                                    { 'receiverName': req.user.username }
                                ]
                            }
                        },
                        {
                            $sort: {
                                createdAt: -1
                            }
                        },
                        {
                            $group: {
                                "_id": {
                                    "last_message_between_": {
                                        $cond: [
                                            {
                                                $gt: [
                                                    { $substr: ["$senderName", 0, 1] },
                                                    { $substr: ["$receiverName", 0, 1] },
                                                ]
                                            },

                                            { $concat: ["$senderName", " and ", "$receiverName"] },
                                            { $concat: ["$receiverName", " and ", "$senderName"] }

                                        ]
                                    }
                                },
                                "body": { $first: "$$ROOT" }
                            }
                        }
                    ], function (err, newResult) {
                        callback(err, newResult);
                    });
                }
            ], (err, results) => {
                const result1 = results[0];
                const result2 = results[1];
                res.render('user/profile', { title: 'Footballkik-Profile', user: req.user, data: result1, chat: result2 });
            });
        },

        postProfilePage: function (req, res) {
            FriendResult.PostRequest(req, res, '/settings/profile');
            async.waterfall([
                function (callback) {
                    Users.findOne({ _id: req.user._id }, (err, result) => {
                        callback(err, result);
                    });
                },
                function (result, callback) {
                    req.body.username = req.body.username == '' ? result.username : req.body.username;
                    req.body.fullname = req.body.fullname == '' ? result.fullname : req.body.fullname;
                    req.body.mantra = req.body.mantra == '' ? result.mantra : req.body.mantra || '';

                    req.body.gender = req.body.gender == '' || req.body.gender == null ? result.gender : req.body.gender || '';
                    req.body.country = req.body.country == '' ? result.country : req.body.country || '';

                    if (req.body.upload === null || req.body.upload === '') {
                        Users.update({
                            '_id': req.user._id,
                        }, {
                            username: req.body.username,
                            fullname: req.body.fullname,
                            mantra: req.body.mantra,
                            gender: req.body.gender,
                            userImage: result.userImage,
                            country: req.body.country,

                        }, {
                            upsert: true
                        }, (err, result) => {
                            // console.log(result);
                            res.redirect('/settings/profile');
                        });
                    } else {
                        Users.update({
                            '_id': req.user._id,
                        }, {
                            username: req.body.username,
                            fullname: req.body.fullname,
                            mantra: req.body.mantra,
                            gender: req.body.gender,
                            userImage: req.body.upload
                        }, {
                            upsert: true
                        }, (err, result) => {
                            console.log(result);
                            res.redirect('/settings/profile');
                        });
                    }
                }
            ]);
        },
        userUpload: function (req, res) {
            const form = new formidable.IncomingForm();
            form.uploadDir = path.join(__dirname, '../public/uploads/users');

            form.on('file', (field, file) => {
                // console.log(file.path);
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
        overviewPage: function (req, res) {
            async.parallel([
                function (callback) {
                    Users.findOne({ 'username': req.params.name })
                        .populate('request.userId')
                        .exec((err, result) => {
                            callback(err, result);
                        });
                },
                function (callback) {
                    Message.aggregate([
                        {
                            $match: {
                                $or: [
                                    { 'senderName': req.user.username },
                                    { 'receiverName': req.user.username }
                                ]
                            }
                        },
                        {
                            $sort: {
                                createdAt: -1
                            }
                        },
                        {
                            $group: {
                                "_id": {
                                    "last_message_between_": {
                                        $cond: [
                                            {
                                                $gt: [
                                                    { $substr: ["$senderName", 0, 1] },
                                                    { $substr: ["$receiverName", 0, 1] },
                                                ]
                                            },

                                            { $concat: ["$senderName", " and ", "$receiverName"] },
                                            { $concat: ["$receiverName", " and ", "$senderName"] }

                                        ]
                                    }
                                },
                                "body": { $first: "$$ROOT" }
                            }
                        }
                    ], function (err, newResult) {
                        callback(err, newResult);
                    });
                }
            ], (err, results) => {
                const result1 = results[0];
                const result2 = results[1];
                res.render('user/overview', { title: 'Footballkik-Overview', user: req.user, data: result1, chat: result2 });
            });
        },
        overviewPostPage: function (req, res) {
            FriendResult.PostRequest(req, res, "profile/" + req.params.name);
        }
    };
}