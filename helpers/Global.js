class Global {
    constructor() {
        this.globalRoom = [];
    }

    EnterRoom(id, name, room, img) {
        let users = { id, name, room, img };
        this.globalRoom.push(users);
        return roomName;
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