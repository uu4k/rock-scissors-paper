<template>
  <div class="room">
    <h1>room: {{ $route.params.roomId }}</h1>
    <div class="loading" v-if="loading">読み込み中...</div>
    <div class="error" v-if="error">{{ error }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import VueRouter from 'vue-router'
import AuthService from '@/services/auth-service'
import UserRepository from '@/repositories/firebase/user-repository'
import User from '@/models/user/user'
import Uid from '@/models/user/uid'
import Name from '@/models/user/name'

Component.registerHooks(['beforeRouteEnter'])

@Component({})
export default class Room extends Vue {
  public user: User | null = null
  public loading: boolean = true
  public error: string = ''

  public async beforeRouteEnter(to: VueRouter, from: VueRouter, next: any) {
    // TODO DI
    const authService = new AuthService(new UserRepository())
    const user = await authService.getLoggedinUserOrLoginUser()
    console.log('beforeRouteEnter')
    console.log(user)
    next((component: any) => {
      console.log(user)
      component.user = user
      component.error = 'aaa'
    })
  }
}
</script>
