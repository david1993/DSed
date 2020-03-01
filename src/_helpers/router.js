import Vue from 'vue';
import Router from 'vue-router';

import HomePage from '../home/HomePage.vue'
import LoginPage from "../login/LoginPage.vue";
import RegisterPage from "../forgot_pass/ForgotPasswordPage.vue";
import MessageAddPage from "../message/MessageAddPage.vue";

Vue.use(Router);

export const router = new Router({
    mode: 'history',
    routes: [
        {path: '/', component: HomePage},
        {path: '/message/add', component: MessageAddPage},
        {path: '/login', component: LoginPage},
        {path: '/forgot_pass', component: RegisterPage},

        // otherwise redirect to home
        {path: '*', redirect: '/'}
    ]
});

router.beforeEach((to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login', '/forgot_pass'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');

    if (authRequired && !loggedIn) {
        return next('/login');
    }

    next();
})
