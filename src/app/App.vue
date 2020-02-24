<template>
    <div class="jumbotron">
        <div class="container">
            <div class="row">
                <div class="col-sm-12 offset-sm-0" id="mainBlock">
                    <div v-if="alert.message" :class="`alert ${alert.type}`">{{alert.message}}</div>
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'


    export default {
        name: 'app',
        computed: {
            ...mapState({
                alert: state => state.alert
            })
        },
        methods: {
            ...mapActions({
                clearAlert: 'alert/clear'
            })
        },
        watch: {
            $route(to, from) {
                this.clearAlert();
            }
        }
    };

</script>

<style>
    body {
        background: #d3ddff;
        min-height: 100%;
    }

    .jumbotron {
        background: none;
    }

    #mainBlock {
        background: white;
        padding: 20px;
    }
</style>
