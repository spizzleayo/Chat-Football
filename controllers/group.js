
module.exports = function (Users, async) {
    return {
        SetRouting: function (router) {
            router.get('/group/:name', this.groupPage);
            router.post('/group/:name', this.groupPostPage);

        },
        groupPage: function (req, res) {
            const { name } = req.params;

            async.parallel([
                function (callback) {
                    Users.findOne({ 'username': req.user.username })
                        .populate('request.userId')
                        .exec((err, result) => {
                            callback(err, result);
                        });
                }
            ], (err, results) => {
                const result1 = results[0];
                console.log('result1 length', result1.request.length);
                res.render('groupchat/group', { title: 'Footballkik-Group', groupName: name, user: req.user, data: result1 });
            });
        },

        groupPostPage: function (req, res) {
            async.parallel([
                function (callback) {
                    // console.log('body is', req.body);
                    if (req.body.receiverName) {
                        Users.update({
                            'username': req.body.receiverName,
                            'request.userId': { $ne: req.user._id },
                            'friendsList.friendId': { $ne: req.user._id }
                        },
                            {
                                $push: {
                                    request: {
                                        userId: req.user._id,
                                        username: req.user.username
                                    }
                                },
                                $inc: { totalRequest: 1 }
                            }, (err, count) => {
                                callback(err, count);
                            }
                        );
                    }
                },

                function (callback) {
                    if (req.body.receiverName) {
                        Users.update({
                            'username': req.user.username,
                            'sentRequest.username': { $ne: req.body.receiverName }
                        },
                            {
                                $push: {
                                    sentRequest: {
                                        username: req.body.receiverName
                                    }
                                }
                            },
                            (err, count) => {
                                callback(err, count);
                            });
                    }
                }
            ], (err, result) => {
                res.redirect('/group/' + req.params.name);
            });
        }
    };
};