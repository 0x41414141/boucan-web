import Vue from 'vue';

import { BROADCAST_URL } from '@/config';

import bus from '@/bus';

// TODO: make this cooler (more dynamic / general)
class Broadcast {
    public publicWS: any;
    public authedWS: any;
    public authEnabled: boolean;
    public bus: Vue;

    constructor(bus: Vue, publicWS: WebSocket | null, authedWS: WebSocket | null) {
        this.bus = bus;
        this.publicWS = publicWS;
        this.authedWS = authedWS;
        this.authEnabled = authedWS ? true : false;
    }

    public authedWSOnError(event: any) {
        console.log('authed ws on error', event);
    }
    public authedWSOnClose(event: any) {
        console.log('authed ws on close', event);
        this.bus.$emit('APP_TOAST', {
            message:
                'The connection to the authenticated websocket has closed. Please try reconnecting by refreshing the browser.',

            options: {
                title: 'WebSocket Close: Authenticated',
                variant: 'danger',
                toaster: 'b-toaster-top-right',
                noAutoHide: true,
            },
        });
    }
    public authedWSOnOpen(event: any) {
        console.log('authed ws on open', event);
    }
    public authedWSOnMessage(event: any) {
        let res = event.data;
        let data = JSON.parse(res);
        console.log('authed ws on message', data);
        console.log('emitting WS_BROADCAST_MESSAGE');
        this.bus.$emit('WS_BROADCAST_MESSAGE', {
            channel: 'auth',
            on: 'message',
            event: event,
            message: data,
        });
        if (data.name) {
            console.log('emitting ' + data.name);
            this.bus.$emit(data.name, {
                channel: 'auth',
                on: 'message',
                event: event,
                message: data,
            });
        }
    }

    public registerAuthedWS(wsTokenRaw: string) {
        console.log('registerAuthedWS', wsTokenRaw);
        let url = BROADCAST_URL + '/auth?ws_access_token=' + wsTokenRaw;
        const authedWS = new WebSocket(url);
        this.authedWS = authedWS;
        authedWS.onopen = this.authedWSOnOpen.bind(this);
        authedWS.onmessage = this.authedWSOnMessage.bind(this);
        authedWS.onerror = this.authedWSOnError.bind(this);
        authedWS.onclose = this.authedWSOnClose.bind(this);
        this.authEnabled = true;
    }

    public publicOnMessage(event: any) {
        console.log(this);
        let res = event.data;
        let data = JSON.parse(res);
        console.log('public onmessage', data);
        this.bus.$emit('WS_BROADCAST_MESSAGE', {
            channel: 'public',
            on: 'message',
            event: event,
            message: data,
        });
        if (data.name) {
            console.log('emitting ' + data.name);
            this.bus.$emit(data.name, {
                channel: 'public',
                on: 'message',
                event: event,
                message: data,
            });
        }
    }

    public publicOnOpen(event: any) {
        console.log('onopen', event);
        let msg = { message: 'yo' };
        event.target.send(JSON.stringify(msg));
    }
    public publicOnError(event: any) {
        console.log('ws on error', event);
    }

    public publicOnClose(event: any) {
        console.log('ws on close', event);
        this.bus.$emit('APP_TOAST', {
            message:
                'The connection to the public websocket has closed. Please try reconnecting by refreshing the browser.',
            options: {
                title: 'WebSocket Closed: Public',
                variant: 'danger',
                toaster: 'b-toaster-top-right',
                noAutoHide: true,
            },
        });
    }
    public registerPublicWS() {
        this.publicWS.onmessage = this.publicOnMessage.bind(this);
        this.publicWS.onopen = this.publicOnOpen.bind(this);
        this.publicWS.onerror = this.publicOnError.bind(this);
        this.publicWS.onclose = this.publicOnClose.bind(this);
    }
}

const broadcast = new Broadcast(bus, new WebSocket(BROADCAST_URL), null);
console.log('BROADCAST', broadcast);
export default broadcast;
