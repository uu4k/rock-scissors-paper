<template>
  <div>{{ message.body }}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Message from "@/models/post/message/message";

@Component
export default class ShowMessage extends Vue {
  @Prop({ required: true }) private message!: Message;
}
</script>

<style>
</style>
