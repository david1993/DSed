<template>
    <div>
        <h1>Hi {{account.user.name}}!</h1>
        <router-link to="/login">Logout</router-link>
        <p></p>
        <h3>Users from secure api end point:</h3>
        <em v-if="users.loading">Loading users...</em>
        <span v-if="users.error" class="text-danger">ERROR: {{users.error}}</span>
        <ul v-if="users.items">
            <li v-for="user in users.items" :key="user.id">
                {{user.name}}
                <span v-if="user.deleting"><em> - Deleting...</em></span>
                <span v-else-if="user.deleteError" class="text-danger"> - ERROR: {{user.deleteError}}</span>
                <span v-else> - <a @click="deleteUser(user.id)" class="text-danger">Delete</a></span>
            </li>
        </ul>
        <h2>Cообщения</h2>
        <div>
            <div v-for="message in messages.all.items" :key="message.id">
                {{message.fromUser.name}} => {{message.toUser.name}} :<br/> {{message.text}}
            </div>
        </div>
        <router-link to="/message/add">Создать сообщение</router-link>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'

    export default {
        computed: {
            ...mapState({
                account: state => state.account,
                users: state => state.users.all,
                messages: state => state.messages
            })
        },
        created() {
            console.log('store', this.$store.state);
            this.getAllUsers();
            this.getMessages();
        },
        methods: {
            ...mapActions('users', {
                getAllUsers: 'getAll',
                deleteUser: 'delete'
            }),
            ...mapActions('messages', ['getMessages'])
        }
    };
</script>
