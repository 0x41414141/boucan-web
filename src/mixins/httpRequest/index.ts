// mixin.js
import Vue from 'vue';
import Component from 'vue-class-component';
import bus from '@/bus';
// You can declare a mixin as the same style as components.
@Component
export default class HttpRequestMixin extends Vue {
    registeredEvents = [];
    loadData() {}
    registerOnBroadcastHttpRequestCreated() {
        bus.$on('HTTP_REQUEST_CREATED', (event: any) => {
            this.loadData();
        });
    }
}
