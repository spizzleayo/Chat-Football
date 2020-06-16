
module.exports = function (Users, async) {
    return {
        SetRouting: function (router) {
            router.get('/group/:name', this.groupPage);
            router.post('/group/:name', this.postPage);

        },
        groupPage: function (req, res) {
            const { name } = req.params;

            res.render('groupchat/group', { title: 'Footballkik-Group', groupName: name, user: req.user });
        },

        postPage: function (req, res) {
            async.parallel([
                function (callback) {
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
                }
            ]);
        }
    };
};