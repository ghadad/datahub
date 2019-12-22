<template>
    <div>
        <md-tabs>
            <md-tab  class="md-no-animation" v-for="m in menu" :key="m.title" :md-label="m.title" :to="m.link">
                <p> <router-view></router-view>    </p>
            </md-tab>
        </md-tabs>
    </div>
</template>

<script>
    export default {
        name: "api",
        data: function () {
            return {
                menu: [{
                        title: "API",
                        link: "/api/list"
                    },
                    {
                        title: "New API",
                        link: "/api/new"
                    },
                    {
                        title: "Help",
                        link: "/job/help"
                    }

                ]
            }
        }
    }
</script>
