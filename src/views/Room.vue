<template>
  <div class="room">
    <v-layout row justify-center>
      <h1>room: {{ $route.params.roomId }}</h1>
    </v-layout>
    <v-layout row justify-center>
      <v-dialog v-model="isError" persistent max-width="450px">
        <v-card>
          <v-card-title class="headline red lighten-2" primary-title>Error</v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex>{{error}}</v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="error=null">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showUsernameModal" persistent max-width="450px">
        <v-card>
          <v-card-text>
            <v-container grid-list-md>
              <v-form v-model="usernameValid" @submit.prevent>
                <v-layout wrap>
                  <v-flex>
                    <v-text-field
                      v-model="inputUsername"
                      label="なまえをにゅうりょくしてください"
                      required
                      :rules="usernameRules"
                      maxlength="20"
                      counter="20"
                      @keyup.enter.native="handleInputName"
                      @keypress.native="setCanUsernameSubmit"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex>
                    <label v-for="[key, val] in Array.from(selectableIcons)" :key="key">
                      <input type="radio" v-model="inputUserIcon" :value="key" class="radio_icon">
                      <img :src="require('../assets/icons/' + val)" class="radio_image">
                    </label>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="handleClickInputUsernameOKButton">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <div v-if="loading">
      <v-layout justify-center>
        <v-progress-circular :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
      </v-layout>
    </div>
    <div v-if="!loading">
      <div class="chat">
        <show-message
          v-for="message in messages.asList()"
          :message="message"
          :mine="user && message.uid === user.uid"
          :key="message.id"
        />
      </div>
      <v-form v-model="messageBodyValid" @submit.prevent>
        <div class="post" v-if="!battle">
          <v-text-field
            v-model="inputMessageBody"
            id="post_message"
            label="post_message"
            placeholder="めっせーじをにゅうりょくしてください"
            @keyup.enter.native="handleInputMessage"
            @keypress.native="setCanMessageSubmit"
            solo
            required
            :rules="messageBodyRules"
            counter="200"
            maxlength="200"
            class="inputmessage"
          ></v-text-field>
          <v-btn color="info" @click="handleClickPostMessageButton" class="postbutton">POST</v-btn>
          <v-btn color="success" @click="handleClickOutbreakButton" class="outbreakbutton">BATTLE</v-btn>
        </div>
      </v-form>
      <div class="rock_scissor_paper" v-if="battle">
        <v-btn color="info" @click="handleClickRockButton" class="rock" :disabled="isPicked">ぐー</v-btn>
        <v-btn
          color="info"
          @click="handleClickScissorButton"
          class="scissor"
          :disabled="isPicked"
        >ちょき</v-btn>
        <v-btn color="info" @click="handleClickPaperButton" class="paper" :disabled="isPicked">ぱー</v-btn>
      </div>
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
import OutbreakService from "@/services/outbreak-service";
import PickService from "@/services/pick-service";
import Battle from "@/models/outbreak/battle/battle";
import Hand from "@/models/pick/hand/hand";
import HandFactory from "@/models/pick/hand-factory";
import Icon from "@/models/entry/user/icon";

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
const outbreakService: OutbreakService = container.get<OutbreakService>(
  SERVICE_IDENTIFIER.OUTBREAK
);
const pickService: PickService = container.get<PickService>(
  SERVICE_IDENTIFIER.PICK
);
const handFactory: HandFactory = container.get<HandFactory>(HandFactory.name);

@Component({
  components: { ShowMessage },
  computed: {
    isError: function() {
      return !!this.$data.error;
    },
    selectableIcons: function() {
      return Icon.SELECTABLE_ICONS;
    }
  }
})
export default class Room extends Vue {
  public entrys: Users = new Users();
  public messages: Messages = new Messages();
  public battle: Battle | null = null;
  public user: User | null = null;
  public loading: boolean = true;
  public isPicked: boolean = false;
  public error: string = "";
  public inputUsername: string = "";
  public inputUserIcon: string = "";
  public inputMessageBody: string = "";
  public canMessageSubmit: boolean = false;
  public canUsernameSubmit: boolean = false;
  public showUsernameModal: boolean = false;

  public usernameValid: boolean = false;
  public usernameRules = [
    (v: any) => !!v || "なまえがにゅうりょくされていません",
    (v: any) => v.length <= 20 || "なまえがながすぎます"
  ];

  public messageBodyValid: boolean = false;
  public messageBodyRules = [
    (v: any) => !!v || "めっせーじがにゅうりょくされていません",
    (v: any) => v.length <= 200 || "めっせーじがながすぎます"
  ];

  public async beforeRouteEnter(to: any, from: any, next: any) {
    if (to.params.roomId) {
      await entryService.login(to.params.roomId);

      next((component: any) => {});
    } else {
      const room = await openService.openRoom();
      next("/room/" + room.id);
    }
  }

  public created() {
    entryService.setAuthSynchronizer(
      this.$route.params.roomId,
      (user?: User) => {
        this.user = user || null;

        if (!this.user || !this.user.name) {
          this.inputUserIcon = Icon.SELECTABLE_ICONS.keys().next().value;
          this.showUsernameModal = true;
        } else {
          this.loading = false;
        }

        if (this.user && this.battle) {
          pickService
            .isPicked(this.$route.params.roomId, this.battle, this.user)
            .then((isPicked: boolean) => {
              this.isPicked = isPicked;
            });
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

    outbreakService.setBattleSynchronizer(
      this.$route.params.roomId,
      battle => {
        // じゃんけん開始を観測して表示切り替え
        this.battle = battle;

        if (this.user && this.battle) {
          pickService
            .isPicked(this.$route.params.roomId, this.battle, this.user)
            .then((isPicked: boolean) => {
              this.isPicked = isPicked;
            });
        }
      },
      battle => {
        // じゃんけん終了を観測して表示切り替え
        this.battle = null;

        this.isPicked = false;
      }
    );
  }

  public handleInputName(): void {
    if (!this.canUsernameSubmit || !this.usernameValid) {
      return;
    }

    if (this.user) {
      entryService
        .setUserNameAndIcon(
          this.$route.params.roomId,
          this.user.uid,
          this.inputUsername,
          this.inputUserIcon
        )
        .then(user => {
          this.user = user;
        })
        .catch(() => {
          this.error = "ユーザ情報の更新に失敗しました";
        });
      this.canUsernameSubmit = false;
      this.showUsernameModal = false;
      this.loading = false;
    } else {
      this.error = "ユーザ情報が存在しません";
    }
  }

  public handleInputMessage(): void {
    if (!this.canMessageSubmit || !this.messageBodyValid) {
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

  public handleClickInputUsernameOKButton(): void {
    this.setCanUsernameSubmit();
    this.handleInputName();
  }

  public handleClickPostMessageButton(): void {
    this.setCanMessageSubmit();
    this.handleInputMessage();
  }

  public handleClickOutbreakButton(): void {
    // じゃんけん開始
    outbreakService.outbreak(this.$route.params.roomId);
  }

  public handleClickRockButton(): void {
    this.pick(handFactory.createHand("rock"));
  }

  public handleClickScissorButton(): void {
    this.pick(handFactory.createHand("scissor"));
  }

  public handleClickPaperButton(): void {
    this.pick(handFactory.createHand("paper"));
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

    return currentScrollHeight > documentScrollHeight - 700;
  }

  private pick(hand: Hand): void {
    if (this.battle && this.user) {
      pickService
        .pick(this.$route.params.roomId, this.battle, this.user, hand)
        .then(() => (this.isPicked = true));
    }
  }
}
</script>

<style lang="scss" scoped>
div .chat,
div .rock_scissor_paper {
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
    "inputmessage postbutton outbreakbutton" 1fr /
    1fr 100px 100px;
}

input.radio_icon {
  display: none;
}

input.radio_icon + .radio_image {
  border: 3px #ffffff solid;
  background-color: #ffffff;
  width: 60px;
}

input.radio_icon:checked + .radio_image {
  border: 3px #ff0000 solid;
  background-color: #ffeeee;
}
</style>
