import { vitest } from 'vitest';
import { computed } from 'vue';
import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import sinon from 'sinon';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from '../../../......mainwebappapp/constants';
import Register from '../../../......mainwebappapp/account/register/register.vue';
import RegisterService from '../../../......mainwebappapp/account/register/register.service';
import LoginService from '../../../......mainwebappapp/account/login.service';

type RegisterComponentType = InstanceType<typeof Register>;

const axiosStub = {
  get: sinon.stub(axios, 'get'),
  post: sinon.stub(axios, 'post'),
};

describe('Register Component', () => {
  let register: RegisterComponentType;
  let loginService: LoginService;
  const filledRegisterAccount = {
    email: 'jhi@pster.net',
    langKey: 'pt-br',
    login: 'jhi',
    password: 'jhipster',
  };

  beforeEach(() => {
    axiosStub.get.resolves({});
    axiosStub.post.reset();
    loginService = new LoginService({ emit: vitest.fn() });
    vitest.spyOn(loginService, 'openLogin');

    const wrapper = shallowMount(Register, {
      global: {
        provide: {
          loginService,
          currentLanguage: computed(() => 'pt-br'),
        },
      },
    });
    register = wrapper.vm;
  });

  it('should set all default values correctly', () => {
    expect(register.success).toBe(false);
    expect(register.error).toBe('');
    expect(register.errorEmailExists).toBe('');
    expect(register.errorUserExists).toBe('');
    expect(register.confirmPassword).toBe(null);
    expect(register.registerAccount.login).toBe(undefined);
    expect(register.registerAccount.password).toBe(undefined);
    expect(register.registerAccount.email).toBe(undefined);
  });

  it('should open login modal when asked to', () => {
    register.openLogin();
    expect(loginService.openLogin).toBeCalledTimes(1);
  });

  it('should register when password match', async () => {
    axiosStub.post.resolves();
    register.registerAccount = filledRegisterAccount;
    register.confirmPassword = filledRegisterAccount.password;
    register.register();
    await register.$nextTick();

    expect(
      axiosStub.post.calledWith('api/register', {
        email: 'jhi@pster.net',
        langKey: 'pt-br',
        login: 'jhi',
        password: 'jhipster',
      })
    ).toBeTruthy();
    expect(register.success).toBe(true);
    expect(register.error).toBe(null);
    expect(register.errorEmailExists).toBe(null);
    expect(register.errorUserExists).toBe(null);
  });

  it('should register when password match but throw error when login already exist', async () => {
    const error = { response: { status: 400, data: { type: LOGIN_ALREADY_USED_TYPE } } };
    axiosStub.post.rejects(error);
    register.registerAccount = filledRegisterAccount;
    register.confirmPassword = filledRegisterAccount.password;
    register.register();
    await register.$nextTick();

    expect(
      axiosStub.post.calledWith('api/register', { email: 'jhi@pster.net', langKey: 'pt-br', login: 'jhi', password: 'jhipster' })
    ).toBeTruthy();
    await register.$nextTick();
    expect(register.success).toBe(null);
    expect(register.error).toBe(null);
    expect(register.errorEmailExists).toBe(null);
    expect(register.errorUserExists).toBe('ERROR');
  });

  it('should register when password match but throw error when email already used', async () => {
    const error = { response: { status: 400, data: { type: EMAIL_ALREADY_USED_TYPE } } };
    axiosStub.post.rejects(error);
    register.registerAccount = filledRegisterAccount;
    register.confirmPassword = filledRegisterAccount.password;
    register.register();
    await register.$nextTick();

    expect(
      axiosStub.post.calledWith('api/register', { email: 'jhi@pster.net', langKey: 'pt-br', login: 'jhi', password: 'jhipster' })
    ).toBeTruthy();
    await register.$nextTick();
    expect(register.success).toBe(null);
    expect(register.error).toBe(null);
    expect(register.errorEmailExists).toBe('ERROR');
    expect(register.errorUserExists).toBe(null);
  });

  it('should register when password match but throw error', async () => {
    const error = { response: { status: 400, data: { type: 'unknown' } } };
    axiosStub.post.rejects(error);
    register.registerAccount = filledRegisterAccount;
    register.confirmPassword = filledRegisterAccount.password;
    register.register();
    await register.$nextTick();

    expect(
      axiosStub.post.calledWith('api/register', { email: 'jhi@pster.net', langKey: 'pt-br', login: 'jhi', password: 'jhipster' })
    ).toBeTruthy();
    await register.$nextTick();
    expect(register.success).toBe(null);
    expect(register.errorEmailExists).toBe(null);
    expect(register.errorUserExists).toBe(null);
    expect(register.error).toBe('ERROR');
  });
});
