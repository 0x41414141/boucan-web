<template>
    <div class="page home-page row">
        <b-container style="padding-top: 10px" class="page">
            <div class="row page-header-row">
                <div class="col-md-9 col-xs-12">
                    <h2 v-if="userId">Edit Profile</h2>
                </div>
            </div>

            <div class="row">
                <div class="col-md-12 col-xs-12">
                    TODO
                    <!-- <profile-edit-form:user-id="userId"></profile-edit-form> -->
                </div>
            </div>
        </b-container>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
// import ProfileEditForm from '@/components/user/ProfileEditForm.vue';

@Component({ components: {} })
export default class ProfileEdit extends Vue {
    isLoading = true;
    isLoaded = false;

    mounted() {
        this.isLoaded = true;
    }
}
</script>
