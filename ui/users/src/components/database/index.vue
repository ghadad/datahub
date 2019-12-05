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
        name: "database",
        data: function () {
            return {
                menu: [{
                        title: "Databases",
                        link: "/database/list"
                    },
                    {
                        title: "New Database",
                        link: "/database/new"
                    },
                    {
                        title: "Help",
                        link: "/database/help"
                    }

                ]
            }
        }
    }
</script>
