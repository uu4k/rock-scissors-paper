<template>
  <div class="room">
    <v-layout row justify-center>
      <h1>room: {{ $route.params.roomId }}</h1>
    </v-layout>
    <v-layout row justify-center>
      <v-dialog v-model="showUsernameModal" persistent max-width="450px">
        <v-card>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex>
                  <v-text-field
                    v-model="inputUsername"
                    label="なまえをにゅうりょくしてください"
                    required
                    @keyup.enter.native="handleInputName"
                    @keypress.native="setCanUsernameSubmit"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="handleInputName">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <div class="chat">
      <show-message
        v-for="message in messages.asList()"
        :message="message"
        :mine="user && message.uid === user.uid"
        :key="message.id"
      />
    </div>
    <div class="error" v-if="error">{{ error }}</div>
    <div class="post">
      <v-text-field
        v-model="inputMessageBody"
        id="post_message"
        label="post_message"
        placeholder="めっせーじをにゅうりょくしてください"
        @keyup.enter.native="handleInputMessage"
        @keypress.native="setCanMessageSubmit"
        solo
        class="inputmessage"
      ></v-text-field>
      <v-btn color="info" @click="handleClickPostMessageButton" class="postbutton">POST</v-btn>
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
  public user: User | null = null;
  public loading: boolean = true;
  public error: string = "";
  public inputUsername: string = "";
  public inputMessageBody: string = "";
  public canMessageSubmit: boolean = false;
  public canUsernameSubmit: boolean = false;
  public showUsernameModal: boolean = false;

  public async beforeRouteEnter(to: any, from: any, next: any) {
    if (to.params.roomId) {
      await entryService.login(to.params.roomId);

      next((component: any) => {});
    } else {
      const room = await openService.openRoom();
      next("/room/" + room.id);
    }
  }

  // TODO ルーム変更検知 beforeRouteUpdate

  public created() {
    entryService.setAuthSynchronizer(
      this.$route.params.roomId,
      (user?: User) => {
        this.user = user || null;

        if (!this.user || !this.user.name) {
          this.showUsernameModal = true;
        }
      }
    );

    // TODO ルームのユーザの参加を観測して反映

    // ルームのメッセージの変更を観測して反映
    postService.setMessageSynchronizer(
      this.$route.params.roomId,
      (change: Change) => {
        this.messages = postService.changeMessages(this.messages, change);
        if (this.isBottom()) {
          this.$vuetify.goTo(document.body.scrollHeight, {
            duration: 300,
            offset: 0
          });
        }
      }
    );
  }

  public handleInputName(): void {
    if (!this.canUsernameSubmit) {
      return;
    }

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
      this.canUsernameSubmit = false;
      this.showUsernameModal = false;
    } else {
      this.error = "ユーザ情報が存在しません";
    }
  }

  public handleInputMessage(): void {
    if (!this.canMessageSubmit) {
      return;
    }

    if (this.user) {
      postService.post(
        this.$route.params.roomId,
        this.user,
        this.inputMessageBody
      );
      this.inputMessageBody = "";
      this.canMessageSubmit = false;
    } else {
      this.error = "ユーザ情報が存在しません";
    }
  }

  public handleClickPostMessageButton(): void {
    this.setCanMessageSubmit();
    this.handleInputMessage();
  }

  public setCanMessageSubmit(): void {
    this.canMessageSubmit = true;
  }

  public setCanUsernameSubmit(): void {
    this.canUsernameSubmit = true;
  }

  public isBottom(): boolean {
    const currentScrollHeight = window.pageYOffset;
    const documentScrollHeight = document.body.scrollHeight;

    console.log(currentScrollHeight > documentScrollHeight - 700);
    return currentScrollHeight > documentScrollHeight - 700;
  }
}
</script>

<style lang="scss" scoped>
div .chat {
  margin: 0 auto 0;
  padding: 5px 10px;
  text-align: center;
  max-width: 600px;
}

div .post {
  margin: 0 auto 0;
  padding: 5px 10px;
  text-align: center;
  max-width: 600px;

  display: grid;
  grid-template:
    "inputmessage postbutton" 1fr /
    1fr 80px;
}
</style>
