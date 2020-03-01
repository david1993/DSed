<template>
    <div>
        <h2>Login</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="org">Организация</label>
                <v-select v-model="org" :options="orgs" label="name"
                          name="org" class="form-control"
                          :class="{ 'is-invalid': submitted && !org }"/>
                <div v-show="submitted && !org" class="invalid-feedback">Выберите Организацию</div>
            </div>
            <div class="form-group" v-show="org">
                <label for="user">Пользователь</label>

                <v-select v-model="user" :options="users" label="name"
                          name="user" class="form-control"
                          :class="{ 'is-invalid': submitted && !user }"/>
                <div v-show="submitted && !user" class="invalid-feedback">Выберите пользователя</div>
            </div>
            <div class="form-group" v-show="user">
                <label htmlFor="password">Пароль</label>
                <input type="password" v-model="password" name="password" class="form-control"
                       :class="{ 'is-invalid': submitted && !password }"/>
                <div v-show="submitted && !password" class="invalid-feedback">Введите пароль</div>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" :disabled="status.loggingIn">Войти</button>
                <img v-show="status.loggingIn"
                     src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>
                <router-link to="/forgot_pass" class="btn btn-link">Забыли пароль?</router-link>
            </div>
        </form>
    </div>
</template>
<style>
    @import url("./../../node_modules/vue-select/dist/vue-select.css");
</style>
<script>
    import {userService} from '../_services';
    import {mapState, mapActions} from 'vuex'

    import vSelect from 'vue-select'
    export default {
        components: {
            vSelect
        },
        data() {

            return {
                username: '',
                password: '',
                submitted: false,
                orgs: [],
                users: [],
                org: null,
                user: null,
            }
        },
        computed: {
            ...mapState('account', ['status'])
        },
        created() {
            // reset login status
            this.logout();
            userService.getOrgs().then((data) => {
                this.orgs = data.orgs;
            });
            try {
                this.org = JSON.parse(localStorage.login_org)
            } catch (e) {
            }
        },
        methods: {
            ...mapActions('account', ['login', 'logout']),
            handleSubmit(e) {
                this.submitted = true;
                const {user, password} = this;
                if (user && password) {
                    this.login({user_id: user.id, password})
                }
            }
        },
        watch: {
            user: function (user) {
                localStorage.login_user = JSON.stringify(user);
            },
            org: function (org) {
                this.user = null;
                localStorage.login_org = JSON.stringify(org);
                userService.getUsers(org.id).then((data) => {
                    this.users = data.users;
                    try {
                        this.user = JSON.parse(localStorage.login_user)
                    } catch (e) {
                    }
                });
            }
        }
    };
</script>
