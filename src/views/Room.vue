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
import "firebase/firestore";
import EntryService from "@/services/entry-service";
import OpenService from "@/services/open-service";
import PostService from "@/services/post-service";
import User from "@/models/entry/user/user";
import Uid from "@/models/entry/user/uid";
import Name from "@/models/entry/user/name";
import firebase from "firebase/app";
import Users from "@/models/entry/users";
import container from "@/config/ioc-config";
import SERVICE_IDENTIFIER from "@/constants/service-identifier";

Component.registerHooks(["beforeRouteEnter"]);
const entryService: EntryService = container.get<EntryService>(
  SERVICE_IDENTIFIER.ENTRY
);
const openService: OpenService = container.get<OpenService>(
  SERVICE_IDENTIFIER.OPEN
);
const postService: PostService = container.get<PostService>(
  SERVICE_IDENTIFIER.POST
);

@Component({})
export default class Room extends Vue {
  public entrys: Users = new Users();
  public user: User | null = null; // TODO ログイン状態の管理方法検討
  public loading: boolean = true;
  public error: string = "";
  public inputUsername: string = "";
  public inputMessageBody: string = "";

  public async beforeRouteEnter(to: any, from: any, next: any) {
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

  // TODO ルーム変更検知 beforeRouteUpdate

  public created() {
    // TODO リポジトリに出したい
    firebase.auth().onAuthStateChanged(fbuser => {
      if (fbuser) {
        const entryService: EntryService = container.get<EntryService>(
          SERVICE_IDENTIFIER.ENTRY
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
