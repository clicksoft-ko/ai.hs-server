jest.mock("@/routes/admin-settings/service/admin-settings.service", () => {
  const actualModule = jest.requireActual("@/routes/admin-settings/service/admin-settings.service");
  const { saveAdminSettings, getAdminSettings } = actualModule.adminSettingsService;

  return {
    ...actualModule,
    adminSettingsService: {
      getManagerCode: jest.fn().mockReturnValue("abc"), // getManagerCode 함수만 모킹
      saveAdminSettings,
      getAdminSettings,
    }
  };
});


jest.mock('../utils/mail/mail-util', () => ({
  sendChangePasswordEmail: jest.fn(() => { })
}));
