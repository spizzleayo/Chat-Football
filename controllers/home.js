
module.exports = function (async, Club, _, Users) {
    return {
        SetRouting: function (router) {
            router.get('/home', this.homePage);

        },
        homePage: function (req, res) {
            async.parallel([
                function (callback) {
                    Club.find({}, (err, result) => {
                        callback(err, result);
                    });
                },
                function (callback) {
                    Club.aggregate([
                        {
                            $group: { _id: "$country", count: { $sum: 1 } }
                        }

                    ], (err, newResult) => {
                        callback(err, newResult);
                    });
                },
                function (callback) {
                    Users.findOne({ 'username': req.user.username })
                        .populate('request.userId')
                        .exec((err, result) => {
                            callback(err, result);
                        });
                }
            ], (err, results) => {
                const res1 = results[0];
                const res2 = results[1];
                const res3 = results[2];
                // console.log(res1);
                // console.log(res2);
                const dataChunk = [];
                const chunkSize = 3;
                for (let i = 0; i < res1.length; i += chunkSize) {
                    dataChunk.push(res1.slice(i, i + chunkSize));
                }

                res2.sort((a, b) => {
                    fa = a._id.toLowerCase();
                    fb = b._id.toLowerCase();

                    if (fa > fb) {
                        return 1;
                    }
                    if (fa < fb) {
                        return -1;
                    }
                    return 0;
                });
                // console.log(res2);


                res.render('home', { title: 'Footballkik-home', chunks: dataChunk, user: req.user, countries: res2, data: res3 });
            });
        }
    };
};