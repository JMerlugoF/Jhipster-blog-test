/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, MountingOptions } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';

import Blog from '../../../......mainwebappapp/entities/blog/blog.vue';
import BlogService from '../../../......mainwebappapp/entities/blog/blog.service';
import AlertService from '../../../......mainwebappapp/shared/alert/alert.service';

type BlogComponentType = InstanceType<typeof Blog>;

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  let alertService: AlertService;

  describe('Blog Management Component', () => {
    let blogServiceStub: SinonStubbedInstance<BlogService>;
    let mountOptions: MountingOptions<BlogComponentType>['global'];

    beforeEach(() => {
      blogServiceStub = sinon.createStubInstance<BlogService>(BlogService);
      blogServiceStub.retrieve.resolves({ headers: {} });

      alertService = new AlertService({
        i18n: { t: vitest.fn() } as any,
        bvToast: {
          toast: vitest.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          bModal: bModalStub as any,
          'font-awesome-icon': true,
          'b-badge': true,
          'b-button': true,
          'router-link': true,
        },
        directives: {
          'b-modal': {},
        },
        provide: {
          alertService,
          blogService: () => blogServiceStub,
        },
      };
    });

    describe('Mount', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        blogServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        const wrapper = shallowMount(Blog, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(blogServiceStub.retrieve.calledOnce).toBeTruthy();
        expect(comp.blogs[0]).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
    describe('Handles', () => {
      let comp: BlogComponentType;

      beforeEach(async () => {
        const wrapper = shallowMount(Blog, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();
        blogServiceStub.retrieve.reset();
        blogServiceStub.retrieve.resolves({ headers: {}, data: [] });
      });

      it('Should call delete service on confirmDelete', async () => {
        // GIVEN
        blogServiceStub.delete.resolves({});

        // WHEN
        comp.prepareRemove({ id: 123 });

        comp.removeBlog();
        await comp.$nextTick(); // clear components

        // THEN
        expect(blogServiceStub.delete.called).toBeTruthy();

        // THEN
        await comp.$nextTick(); // handle component clear watch
        expect(blogServiceStub.retrieve.callCount).toEqual(1);
      });
    });
  });
});
