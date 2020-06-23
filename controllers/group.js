
module.exports = function (Users, async, Message, FriendResult, Group) {
    return {
        SetRouting: function (router) {
            router.get('/group/:name', this.groupPage);
            router.post('/group/:name', this.groupPostPage);

            router.get('/logout', this.logout);


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
                // console.log('result1 length', result1.request.length);
                res.render('groupchat/group', { title: 'Footballkik-Group', groupName: name, user: req.user, data: result1, chat: result2 });
            });
        },

        groupPostPage: function (req, res) {
            FriendResult.PostRequest(req, res, '/group/' + req.params.name);

            async.parallel([
                function (callback) {
                    if (req.body.message) {
                        const group = new Group();
                        group.sender = req.user._id;
                        group.body = req.body.message;
                        group.name = req.body.groupName
                    }
                }
            ]);
        },
        logout: function (req, res) {
            req.logout();
            req.session.destroy((err) => {
                res.redirect('/');
            });
        }
    };
};