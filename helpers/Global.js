class Global {
    constructor() {
        this.globalRoom = [];
    }

    EnterRoom(id, name, room, img) {
        let roomName = { id, name, room, img };
        this.globalRoom.push(roomName);
        return roomName;
    }
    RemoveUser(id) {
        let user = this.GetUserId(id);
        if (user) {
            this.users = this.globalRoom.filter(user => user.id !== id);
        }
        return user;
    }

    GetUserId(id) {
        let getUser = this.globalRoom.filter(user => user.id === id)[0];
        return getUser;
    }

    GetRoomList(room) {
        let roomName = this.globalRoom.filter(user => user.room === room);
        let namesArray = roomName.map(user => {
            return {
                name: user.name,
                img: user.img
            };
        });
        return namesArray;
    }
}

module.exports = { Global };