class Users {
    constructor() {
        this.users = [];
    }

    AddUserData(id, name, room) {
        let users = { id, name, room };
        this.users.push(users);
        return users;
    }

    RemoveUser(id) {
        let user = this.GetUserId(id);
        if (user) {
            this.users = this.users.filter(user => user.id !== id);
        }
        return user;
    }

    GetUserId(id) {
        let getUser = this.users.filter(user => user.id === id)[0];
        return getUser;
    }


    GetUsersList(room) {
        let users = this.users.filter(user => user.room === room);
        let namesArray = users.map(user => { return user.name; });
        return namesArray;
    }
}

module.exports = { Users };