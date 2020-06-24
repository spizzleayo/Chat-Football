module.exports = function () {
    return {
        SetRouting: function (router) {
            router.get('/settings/profile', this.getprofilePage);
        },
        getprofilePage: function (req, res) {
            res.render('user/profile', { title: "Football-kik - Profile", user: req.user });
        }
    };
}