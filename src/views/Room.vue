<template>
  <div class="room">
    <h1>room: {{ $route.params.roomId }}</h1>
    <div class="loading" v-if="loading">読み込み中...</div>
    <div class="error" v-if="error">{{ error }}</div>
    <div class="name" v-if="user && user.name != undefined">{{user.name}}</div>
    <div class="input_name" v-if="user && !user.name">
      <input
        type="text"
        v-model="inputUsername"
        @keyup.enter="handleInputName"
        placeholder="なまえをにゅうりょくしてください"
      >
    </div>
    <div>
      <input
        type="text"
        v-model="inputMessageBody"
        @keyup.enter="handleInputMessage"
        placeholder="めっせーじをにゅうりょくしてください"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import VueRouter from "vue-router";
import UserRepository from "@/repositories/firebase/user-repository";
import User from "@/models/entry/user/user";
import Uid from "@/models/entry/user/uid";
import Name from "@/models/entry/user/name";
import EntryService from "@/services/entry-service";
import firebase from "firebase/app";
import "firebase/firestore";
import RoomRepository from "@/repositories/firebase/room-repository";
import OpenService from "@/services/open-service";
import Users from "@/models/entry/users";
import PostService from "@/services/post-service";
import MessageRepository from "@/repositories/firebase/message-repository";

Component.registerHooks(["beforeRouteEnter"]);

@Component({})
export default class Room extends Vue {
  public entrys: Users = new Users();
  public user: User | null = null; // TODO ログイン状態の管理方法検討
  public loading: boolean = true;
  public error: string = "";
  public inputUsername: string = "";
  public inputMessageBody: string = "";

  public async beforeRouteEnter(to: any, from: any, next: any) {
    // TODO DI
    const db = firebase.firestore();
    const entryService = new EntryService(
      new RoomRepository(db),
      new UserRepository(db)
    );
    const openService = new OpenService(new RoomRepository(db));

    if (to.params.roomId) {
      const user = await entryService.login(to.params.roomId);

      next((component: any) => {
        component.user = user;
      });
    } else {
      const room = await openService.openRoom();
      next("/room/" + room.id);
    }
  }

  // TODO パラメータ変更検知 beforeRouteUpdate

  public created() {
    // TODO リポジトリに出したい
    firebase.auth().onAuthStateChanged(fbuser => {
      if (fbuser) {
        // TODO DI
        const db = firebase.firestore();
        const entryService = new EntryService(
          new RoomRepository(db),
          new UserRepository(db)
        );

        entryService
          .getUser(this.$route.params.roomId, fbuser.uid)
          .then(user => {
            this.user = user;
          });
      } else {
        this.user = null;
      }
    });

    // TODO ルームのユーザの参加を観測して反映
    // TODO ルームのメッセージの変更を観測して反映
  }

  public handleInputName(): void {
    // TODO DI
    const db = firebase.firestore();
    const entryService = new EntryService(
      new RoomRepository(db),
      new UserRepository(db)
    );
    if (this.user) {
      entryService
        .setUserName(
          this.$route.params.roomId,
          this.user.uid,
          this.inputUsername
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

  public handleInputMessage(): void {
    const db = firebase.firestore();
    const postService = new PostService(new MessageRepository(db));

    if (this.user) {
      postService.post(
        this.$route.params.roomId,
        this.user,
        this.inputMessageBody
      );
    } else {
      this.error = "ユーザ情報が存在しません";
    }
  }
}
</script>
