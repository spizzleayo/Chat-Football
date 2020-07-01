const path = require('path');
const fs = require('fs');
module.exports = function (async, Message, Users, FriendResult) {
    return {
        SetRouting: function (router) {
            router.get('/settings/interest', this.getInterestPage);
            router.post('/settings/interest', this.postInterestPage);
        },
        getInterestPage: function (req, res) {
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
                res.render('user/interest', { title: 'Footballkik-Interest', user: req.user, data: result1, chat: result2 });
            });
        },
        postInterestPage: function (req, res) {
            FriendResult.PostRequest(req, res, '/settings/interest');
            async.parallel([
                function (callback) {
                    if (req.body.favPlayer) {
                        Users.update({
                            '_id': req.user._id,
                            'favPlayer.playerName': { $ne: req.body.favPlayer }
                        },
                            {
                                $push: {
                                    favPlayer: {
                                        playerName: req.body.favPlayer
                                    }
                                }
                            }, (err, result1) => {
                                callback(err, result1);
                            });
                    }
                },
            ], (err, results) => {
                res.redirect('/settings/interest');
            });


            async.parallel([
                function (callback) {
                    if (req.body.favClub) {
                        Users.update({
                            '_id': req.user._id,
                            'favClub.clubName': { $ne: req.body.favClub }
                        },
                            {
                                $push: {
                                    favClub: {
                                        clubName: req.body.favClub
                                    }
                                }
                            }, (err, result2) => {
                                callback(err, result2);
                            });
                    }
                }
            ], (err, results) => {
                res.redirect('/settings/interest');
            });

            async.parallel([
                function (callback) {
                    if (req.body.nationalTeam) {
                        Users.update({
                            '_id': req.user._id,
                            'nationalTeam.teamName': { $ne: req.body.nationalTeam }
                        },
                            {
                                $push: {
                                    favNationalTeam: {
                                        teamName: req.body.nationalTeam
                                    }
                                }
                            }, (err, result3) => {
                                callback(err, result3);
                            });
                    }
                }
            ], (err, results) => {
                res.redirect('/settings/interest');
            });
        }
    };
};