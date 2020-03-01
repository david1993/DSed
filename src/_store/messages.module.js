import {messageService} from '../_services';
import {router} from "../_helpers";

const state = {
    all: {},
    add: {},
};

const actions = {
    getMessages({commit}) {
        commit('getAllRequest');

        messageService.getAll()
            .then(
                users => commit('getAllSuccess', users),
                error => commit('getAllFailure', error)
            );
    },

    add({commit}, message) {
        commit('addRequest', message);

        messageService.add(message)
            .then(
                message => {
                    commit('addSuccess', message);
                    router.push('/');
                    setTimeout(() => {
                        // display success message after route change completes
                        dispatch('alert/success', 'Message sent', {root: true});
                    })
                },
                error => commit('addFailure', error)
            );
    },

};

const mutations = {
    getAllRequest(state) {
        state.all = {loading: true};
    },
    getAllSuccess(state, messages) {
        state.all = {items: messages};
    },
    getAllFailure(state, error) {
        state.all = {error};
    },
    addRequest(state, message) {
        state.add = {creating: true};
    },
    addSuccess(state, message) {
        console.log('addSuccess');
        state.add = {}
    },
    addFailure(state, error) {

        console.log('addFailure',error);
        state.add = {}
    },

};

export const messages = {
    namespaced: true,
    state,
    actions,
    mutations
};
