class Pool {
    constructor() {
        console.log('creating client pool');
        this.clients = {};
        this.client_id = 0;
    }

    addClient(clientUpdater) {
        console.log('adding client', this.client_id);
        const id = this.client_id;
        this.clients[id] = clientUpdater;
        this.client_id++;
        return id;
    }

    removeClient(id) {
        console.log('removing client', this.client_id);
        delete this.clients[id];
    }

    messageClients(data) {
        console.log('messaging clients', data);
        const clients = Object.values(this.clients);

        for (const clientUpdater of clients) {
            clientUpdater(data);
        }
    }
}

const _pool = new Pool();
export default _pool;
