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
    <div class="chat">
      <show-message
        v-for="message in messages.asList()"
        :message="message"
        :mine="user && message.uid === user.uid"
        :key="message.id"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ShowMessage from "@/components/ShowMessage.vue";
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
import Change from "@/models/post/changes/change";
import Messages from "@/models/post/messages";

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

@Component({
  components: { ShowMessage }
})
export default class Room extends Vue {
  public entrys: Users = new Users();
  public messages: Messages = new Messages();
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
    firebase.auth().onAuthStateChanged(fbuser => {
      if (fbuser) {
        entryService
          .getUser(this.$route.params.roomId, fbuser.uid)
          .then(user => {
            this.user = user;
          });
      } else {
        this.user = null;
        // TODO トップに戻る？
      }
    });

    // TODO ルームのユーザの参加を観測して反映

    // ルームのメッセージの変更を観測して反映
    postService.setMessageSynchronizer(
      this.$route.params.roomId,
      (change: Change) => {
        this.messages = postService.changeMessages(this.messages, change);
      }
    );
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

<style lang="scss" scoped>
div .room {
  display: grid;
  grid-template-columns: 100vw;
  grid-template-rows: 1fr;

  line-height: 1.5em;
}

div .chat {
  justify-self: center;
  align-self: center;

  padding: 5px 10px;
  max-width: 600px;
  text-align: center;
}
</style>
