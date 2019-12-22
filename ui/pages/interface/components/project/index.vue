<template>
    <div>
        <md-tabs>
            <md-tab v-for="m in menu" :key="m.title" :md-label="m.title" :to="m.link" class="md-no-animation">
                <p> <router-view></router-view>    </p>
            </md-tab>
        </md-tabs>
    </div>
</template>

<script>
    export default {
        name: "project",
        data: function () {
            return {
                menu: [{
                        title: "Projects",
                        link: "/project/list"
                    },
                    {
                        title: "New project",
                        link: "/project/new"
                    },
                    {
                        title: "Help",
                        link: "/project/help"
                    }

                ]
            }
        }
    }
</script>