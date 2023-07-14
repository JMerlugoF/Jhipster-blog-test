import { computed, defineComponent, inject, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';

import { useValidation } from '@/shared/composables';
import { useAlertService } from '@/shared/alert/alert.service';

import { IBlog, Blog } from '@/shared/model/blog.model';
import BlogService from './blog.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'BlogUpdate',
  setup() {
    const blogService = inject('blogService', () => new BlogService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const blog: Ref<IBlog> = ref(new Blog());
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'pt-br'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

    const retrieveBlog = async blogId => {
      try {
        const res = await blogService().find(blogId);
        blog.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.blogId) {
      retrieveBlog(route.params.blogId);
    }

    const { t: t$ } = useI18n();
    const validations = useValidation();
    const validationRules = {
      name: {
        required: validations.required(t$('entity.validation.required').toString()),
        minLength: validations.minLength(t$('entity.validation.minlength', { min: 3 }).toString(), 3),
      },
      handle: {
        required: validations.required(t$('entity.validation.required').toString()),
        minLength: validations.minLength(t$('entity.validation.minlength', { min: 2 }).toString(), 2),
      },
    };
    const v$ = useVuelidate(validationRules, blog as any);
    v$.value.$validate();

    return {
      blogService,
      alertService,
      blog,
      previousState,
      isSaving,
      currentLanguage,
      v$,
      t$,
    };
  },
  created(): void {},
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.blog.id) {
        this.blogService()
          .update(this.blog)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('blogApp.blog.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.blogService()
          .create(this.blog)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('blogApp.blog.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },
  },
});
