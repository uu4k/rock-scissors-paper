<template>
  <div class="room">
    <h1>room: {{ $route.params.roomId }}</h1>
    <div class="loading" v-if="loading">読み込み中...</div>
    <div class="error" v-if="error">{{ error }}</div>
    <div class="name" v-if="user && user.name != undefined">{{user.name}}</div>
    <div class="input_name" v-if="user && !user.name">
      <input
        type="text"
        v-model="input_username"
        @keyup.enter="handleInputName"
        placeholder="なまえをにゅうりょくしてください"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import VueRouter from "vue-router";
import AuthService from "@/services/auth-service";
import UserRepository from "@/repositories/firebase/user-repository";
import User from "@/models/room/user/user";
import Uid from "@/models/room/user/uid";
import Name from "@/models/room/user/name";
import firebase from "firebase/app";
import "firebase/firestore";

Component.registerHooks(["beforeRouteEnter"]);

@Component({})
export default class Room extends Vue {
  public user: User | null = null; // TODO ログイン状態の管理方法検討
  public loading: boolean = true;
  public error: string = "";
  public input_username: string = "";

  public async beforeRouteEnter(to: any, from: VueRouter, next: any) {
    // TODO DI
    const db = firebase.firestore();
    const authService = new AuthService(new UserRepository(db));

    const user = await authService.login(to.params.roomId);

    next((component: any) => {
      component.user = user;
    });
  }

  public created() {
    // TODO リポジトリに出したい
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // TODO DI
        const db = firebase.firestore();
        const authService = new AuthService(new UserRepository(db));

        authService.getUser(this.$route.params.roomId, user.uid).then(user => {
          this.user = user;
        });
      } else {
        this.user = null;
      }
    });
  }

  public handleInputName(): void {
    // TODO DI
    const db = firebase.firestore();
    const authService = new AuthService(new UserRepository(db));
    if (this.user) {
      authService
        .updateUserName(
          this.$route.params.roomId,
          this.user.uid,
          this.input_username
        )
        .then(user => {
          this.user = user;
        })
        .catch(() => {
          this.error = "ユーザ情報の更新に失敗しました";
        });
    } else {
      this.error = "ユーザ情報が存在しません";
    }
  }
}
</script>
