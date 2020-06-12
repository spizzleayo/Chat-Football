
module.exports = function () {
    return {
        SetRouting: function (router) {
            router.get('/group/:name', this.groupPage);

        },
        groupPage: function (req, res) {
            const { name } = req.params;

            res.render('groupchat/group', { title: 'Footballkik-Group', groupName: name, user: req.user });
        }
    };
};