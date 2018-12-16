<template>
  <section :class="{'container-right': !mine, 'container-left': mine}">
    <div class="icon">アイコン</div>
    <div class="name">名前</div>
    <div class="message">
      <div class="speech-bubble">
        <div class="sb-bubble sb-line3" :class="{'sb-right': !mine, 'sb-left': mine}">
          <p>{{ message.body }}</p>
        </div>
      </div>
    </div>
    <div class="empty"></div>
    <div class="postdate">01/01 00:00:00</div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Message from "@/models/post/message/message";

@Component
export default class ShowMessage extends Vue {
  @Prop({ required: true }) private message!: Message;
  @Prop({ required: true }) private mine!: boolean;
}
</script>

<style scoped>
.container-left {
  display: grid;
  grid-template:
    "icon message empty" 1fr
    "icon message empty" 1fr
    "name message postdate" 1fr /
    80px 1fr 80px;
}

.container-right {
  display: grid;
  grid-template:
    "enpty message icon" 1fr
    "empty message icon" 1fr
    "postdate message name" 1fr /
    80px 1fr 80px;
}

.icon {
  grid-area: icon;
}

.message {
  grid-area: message;
}

.emtpty {
  grid-area: empty;
}

.name {
  grid-area: name;
}

.postdate {
  grid-area: postdate;
}

/* https://codepen.io/kinformation/pen/vewVrP */
.speech-bubble {
  overflow: hidden;
  padding-bottom: 10px;
}

.speech-bubble p {
  margin: 0;
}

.speech-bubble {
  background: #ffffff;
}

.speech-bubble:after {
  clear: both;
  content: "";
  display: table;
}

.speech-bubble:before {
  content: "";
  display: table;
}

.sb-bubble:after,
.sb-bubble:before {
  content: " ";
  height: 0;
  pointer-events: none;
  position: absolute;
  top: 1.2em;
  width: 0;
}

.sb-left {
  float: left;
  margin-left: 20px;
}

.sb-right {
  float: right;
  margin-right: 20px;
}

/*** 現ライン風（フラット２） ***/

.sb-line3 {
  border: solid 2px #c5d0e4;
  border-radius: 0.5em;
  max-width: 70%;
  padding: 0.2em 1em;
  position: relative;
}

.sb-line3.sb-left {
  background: #ffffff;
  border-top-left-radius: 0;
}

.sb-line3.sb-left:after {
  background: #ffffff;
  border: solid #c5d0e4;
  border-radius: 0 1em 0 0;
  border-width: 2px 2px 0 0;
  height: 0.5em;
  right: 100%;
  top: -2px;
  width: 0.5em;
}

.sb-line3.sb-left:before {
  background: #ffffff;
  border-top: solid 2px #c5d0e4;
  height: 0.5em;
  right: 100%;
  top: -2px;
  width: 0.5em;
}

.sb-line3.sb-right {
  background: #d5e0f4;
  border-top-right-radius: 0;
}

.sb-line3.sb-right:after {
  background: #ffffff;
  border: solid 2px #c5d0e4;
  border-radius: 1em 0 0 0;
  border-width: 2px 0 0 2px;
  height: 0.5em;
  left: 100%;
  top: -2px;
  width: 0.5em;
}

.sb-line3.sb-right:before {
  background: #d5e0f4;
  border-top: solid 2px #c5d0e4;
  height: 0.5em;
  left: 100%;
  top: -2px;
  width: 0.5em;
}
</style>
