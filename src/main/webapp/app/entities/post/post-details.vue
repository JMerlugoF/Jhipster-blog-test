<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="post">
        <h2 class="jh-entity-heading" data-cy="postDetailsHeading"><span v-text="t$('blogApp.post.detail.title')"></span> {{ post.id }}</h2>
        <dl class="row jh-entity-details">
          <dt>
            <span v-text="t$('blogApp.post.title')"></span>
          </dt>
          <dd>
            <span>{{ post.title }}</span>
          </dd>
          <dt>
            <span v-text="t$('blogApp.post.content')"></span>
          </dt>
          <dd>
            <span>{{ post.content }}</span>
          </dd>
          <dt>
            <span v-text="t$('blogApp.post.date')"></span>
          </dt>
          <dd>
            <span v-if="post.date">{{ formatDateLong(post.date) }}</span>
          </dd>
          <dt>
            <span v-text="t$('blogApp.post.blog')"></span>
          </dt>
          <dd>
            <div v-if="post.blog">
              <router-link :to="{ name: 'BlogView', params: { blogId: post.blog.id } }">{{ post.blog.name }}</router-link>
            </div>
          </dd>
          <dt>
            <span v-text="t$('blogApp.post.tag')"></span>
          </dt>
          <dd>
            <span v-for="(tag, i) in post.tags" :key="tag.id"
              >{{ i > 0 ? ', ' : '' }}
              <router-link :to="{ name: 'TagView', params: { tagId: tag.id } }">{{ tag.name }}</router-link>
            </span>
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.back')"></span>
        </button>
        <router-link v-if="post.id" :to="{ name: 'PostEdit', params: { postId: post.id } }" custom v-slot="{ navigate }">
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.edit')"></span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./post-details.component.ts"></script>
