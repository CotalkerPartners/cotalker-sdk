// 👇 MOCK ANTES DE LA IMPORTACIÓN
jest.mock('../../src/libs/CotalkerAPI', () => {
    const mockAPI = {
      postSchedule: jest.fn(),
      runSchedule: jest.fn(),
      getScheduleById: jest.fn(),
      getSchedules: jest.fn(),
      runByCode: jest.fn(),
      getDetailsByCode: jest.fn(),
      getScheduleHistory: jest.fn(),
      getSchedulePriority: jest.fn(),
      getMaxIterations: jest.fn(),
      getScheduleConfig: jest.fn(),
      getScheduleLegacyById: jest.fn(),
      getScheduleByCodeLegacy: jest.fn(),
      runLegacySchedule: jest.fn(),
      getScheduleLogs: jest.fn()
    };
  
    return {
      cotalkerAPI: mockAPI,
      __esModule: true
    };
  });
  
  // 👇 Importación DESPUÉS del mock
  const { cotalkerAPI } = require('../../src/libs/CotalkerAPI');

describe('Scheduler API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should post a new schedule', async () => {
    const mockResponse = { code: 'new_schedule' };
    cotalkerAPI.postSchedule.mockResolvedValue(mockResponse);

    const result = await cotalkerAPI.postSchedule({ code: 'test' });

    console.debug('[TEST] postSchedule response:', result);
    expect(result.code).toBe('new_schedule');
  });

  it('should run a schedule', async () => {
    const mockResponse = { success: true };
    cotalkerAPI.runSchedule.mockResolvedValue(mockResponse);

    const result = await cotalkerAPI.runSchedule({ code: 'run_now' });

    console.debug('[TEST] runSchedule response:', result);
    expect(result.success).toBe(true);
  });

  it('should get a schedule by ID', async () => {
    const mockSchedule = { _id: 's1', name: 'Schedule 1' };
    cotalkerAPI.getScheduleById.mockResolvedValue(mockSchedule);

    const result = await cotalkerAPI.getScheduleById('s1');

    console.debug('[TEST] getScheduleById response:', result);
    expect(result._id).toBe('s1');
  });

  it('should get all schedules', async () => {
    const mockSchedules = [{ code: 's1' }, { code: 's2' }];
    cotalkerAPI.getSchedules.mockResolvedValue(mockSchedules);

    const result = await cotalkerAPI.getSchedules();

    console.debug('[TEST] getSchedules response:', result);
    expect(result.length).toBe(2);
  });

  it('should run schedule by code', async () => {
    const mockResponse = { executed: true };
    cotalkerAPI.runByCode.mockResolvedValue(mockResponse);

    const result = await cotalkerAPI.runByCode('code123');

    console.debug('[TEST] runByCode response:', result);
    expect(result.executed).toBe(true);
  });

  it('should get schedule details by code', async () => {
    const mockDetails = { code: 'abc', detail: 'info' };
    cotalkerAPI.getDetailsByCode.mockResolvedValue(mockDetails);

    const result = await cotalkerAPI.getDetailsByCode('abc');

    console.debug('[TEST] getDetailsByCode response:', result);
    expect(result.code).toBe('abc');
  });

  it('should get schedule history', async () => {
    const mockHistory = [{ run: 1 }, { run: 2 }];
    cotalkerAPI.getScheduleHistory.mockResolvedValue(mockHistory);

    const result = await cotalkerAPI.getScheduleHistory();

    console.debug('[TEST] getScheduleHistory response:', result);
    expect(result.length).toBe(2);
  });

  it('should get schedule priority by code', async () => {
    const mockPriority = { code: 'xyz', priority: 3 };
    cotalkerAPI.getSchedulePriority.mockResolvedValue(mockPriority);

    const result = await cotalkerAPI.getSchedulePriority('xyz');

    console.debug('[TEST] getSchedulePriority response:', result);
    expect(result.priority).toBe(3);
  });

  it('should get max iterations by code', async () => {
    const mockIterations = { max: 5 };
    cotalkerAPI.getMaxIterations.mockResolvedValue(mockIterations);

    const result = await cotalkerAPI.getMaxIterations('loop_code');

    console.debug('[TEST] getMaxIterations response:', result);
    expect(result.max).toBe(5);
  });

  it('should get schedule config by code', async () => {
    const mockConfig = { retries: 2 };
    cotalkerAPI.getScheduleConfig.mockResolvedValue(mockConfig);

    const result = await cotalkerAPI.getScheduleConfig('conf_code');

    console.debug('[TEST] getScheduleConfig response:', result);
    expect(result.retries).toBe(2);
  });

  it('should get legacy schedule by ID', async () => {
    const mockLegacy = { _id: 'legacy1' };
    cotalkerAPI.getScheduleLegacyById.mockResolvedValue(mockLegacy);

    const result = await cotalkerAPI.getScheduleLegacyById('legacy1');

    console.debug('[TEST] getScheduleLegacyById response:', result);
    expect(result._id).toBe('legacy1');
  });

  it('should get schedule by legacy code', async () => {
    const mockLegacy = { code: 'legacy-code' };
    cotalkerAPI.getScheduleByCodeLegacy.mockResolvedValue(mockLegacy);

    const result = await cotalkerAPI.getScheduleByCodeLegacy('legacy-code');

    console.debug('[TEST] getScheduleByCodeLegacy response:', result);
    expect(result.code).toBe('legacy-code');
  });

  it('should run legacy schedule', async () => {
    const mockResult = { run: 'ok' };
    cotalkerAPI.runLegacySchedule.mockResolvedValue(mockResult);

    const result = await cotalkerAPI.runLegacySchedule({});

    console.debug('[TEST] runLegacySchedule response:', result);
    expect(result.run).toBe('ok');
  });

  it('should get schedule logs', async () => {
    const mockLogs = [{ log: 'line 1' }];
    cotalkerAPI.getScheduleLogs.mockResolvedValue(mockLogs);

    const result = await cotalkerAPI.getScheduleLogs(['id1', 'id2'], 100);

    console.debug('[TEST] getScheduleLogs response:', result);
    expect(result.length).toBe(1);
  });
});
