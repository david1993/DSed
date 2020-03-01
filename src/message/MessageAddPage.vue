<template>
    <div>
        <h1>Hi {{account.user.name}}!</h1>
        <router-link to="/login">Logout</router-link>
        <h3>Добавить сообщение:</h3>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="message">Сообщение</label>
                <textarea v-model="message" id="message" name="message" class="form-control"
                          :class="{ 'is-invalid': submitted && !message }"
                />
                <div v-if="submitted && !message" class="invalid-feedback">Введите сообщение</div>
            </div>
            <div class="form-group">
                <label for="user">кому</label>

                <em v-if="users.loading">Loading users...</em>
                <span v-if="users.error" class="text-danger">ERROR: {{users.error}}</span>
                <v-select id="user" v-model="user" :options="users.items" label="name"
                          name="user" class="form-control"
                          :class="{ 'is-invalid': submitted && !user }"/>
                <div v-if="submitted && !user" class="invalid-feedback">Выберите адресата</div>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" :disabled="add.creating">Отправить</button>
                <img v-show="add.creating"
                     src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>
                <router-link to="/login" class="btn btn-link">Cancel</router-link>
            </div>
        </form>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'

    import vSelect from 'vue-select'

    export default {
        components: {vSelect},
        data() {
            return {
                message: '',
                user: null,
                submitted: false,
                add: {},
            }
        },
        created() {
            this.getAllUsers()
        },
        computed: {
            ...mapState({
                users: state => state.users.all,
                add: state => state.messages.add,
                account: state => state.account,
            })
        },
        methods: {
            ...mapActions('users', {
                getAllUsers: 'getAll',
            }),
            ...mapActions('messages', {addMessage: 'add'}),
            handleSubmit(e) {
                this.submitted = true;
                if (this.user && this.message) {
                    this.addMessage({user: this.user, text: this.message})
                }
            }
        },
    };
</script>
