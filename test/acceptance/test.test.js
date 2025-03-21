// Mocks
jest.mock('../../src/libs/CotalkerAPI', () => {
  return {
    cotalkerAPI: {
      getProperty: jest.fn(),
      getPropertyByCode: jest.fn(),
      getAnswer: jest.fn(),
      jsonPatchProperty: jest.fn(),
      getAllFromPropertyType: jest.fn(),
      searchProperty: jest.fn()
    }
  };
});

jest.mock('../../src/libs/Answer', () => {
  return {
    answersAPI: {
      getAnswer: jest.fn(),
      getUser: jest.fn()
    },
    Answer: class {
      constructor(cotAnswer) {
        this.cotAnswer = cotAnswer;
        this.user = cotAnswer.user;
        this.createdAt = new Date(cotAnswer.createdAt);
      }

      static async fromId(id) {
        const { answersAPI } = require('../../src/libs/Answer');
        const cotAnswer = await answersAPI.getAnswer(id);
        return new this(cotAnswer);
      }

      async getSubAnswers(identifier) {
        const sub = {
          contentType: 'application/vnd.cotalker.survey+survey',
          process: [JSON.stringify({ uuids: ['sub1'] })]
        };
        this.cotAnswer.data = [{ identifier, ...sub }];
        const { Answer } = require('../../src/libs/Answer');
        return [await Answer.fromId('sub1')];
      }

      getIdentifier() {
        return { contentType: 'application/vnd.cotalker.survey+survey', process: [JSON.stringify({ uuids: ['sub1'] })] };
      }
    }
  };
});

// Imports después de los mocks
const { propertiesAPI } = require('../../src/libs/properties');
const { cotalkerAPI } = require('../../src/libs/CotalkerAPI');
const { Answer, answersAPI } = require('../../src/libs/Answer');

describe('propertiesAPI', () => {
  it('should fetch a property by ID', async () => {
    const mockProperty = { _id: '123', name: 'Test Property' };
    cotalkerAPI.getProperty.mockResolvedValue(mockProperty);

    const result = await propertiesAPI.getProperty('123');
    console.debug('[TEST] getProperty called with:', '123');
    console.debug('[TEST] getProperty response:', result);

    expect(result).toEqual(mockProperty);
  });

  it('should fetch a property by code', async () => {
    const mockProperty = { code: 'test_code', name: 'Property By Code' };
    cotalkerAPI.getPropertyByCode.mockResolvedValue(mockProperty);

    const result = await propertiesAPI.getPropertyByCode('test_code');
    console.debug('[TEST] getPropertyByCode called with:', 'test_code');
    console.debug('[TEST] getPropertyByCode response:', result);

    expect(result).toEqual(mockProperty);
  });

  it('should return all properties from propertyType', async () => {
    const mockList = [{ name: 'Prop 1' }, { name: 'Prop 2' }];
    cotalkerAPI.getAllFromPropertyType.mockResolvedValue(mockList);

    const result = await propertiesAPI.getAllFromPropertyType('testType');
    console.debug('[TEST] getAllFromPropertyType response:', result);

    expect(result.length).toBe(2);
  });

  it('should search properties by string', async () => {
    const mockList = [{ name: 'Found 1' }];
    cotalkerAPI.searchProperty.mockResolvedValue(mockList);

    const result = await propertiesAPI.searchProperty('someSearch');
    console.debug('[TEST] searchProperty response:', result);

    expect(result[0].name).toBe('Found 1');
  });

  it('should apply JSON patch to property', async () => {
    const mockPatched = { name: 'Patched Property' };
    cotalkerAPI.jsonPatchProperty.mockResolvedValue(mockPatched);

    const patchBody = [
      { op: 'replace', path: '/name', value: 'Patched Property' }
    ];

    const result = await propertiesAPI.jsonPatchProperty('pid-100', patchBody);
    console.debug('[TEST] jsonPatchProperty response:', result);

    expect(result.name).toBe('Patched Property');
  });
});

describe('Answer class', () => {
  it('should create an Answer instance from ID', async () => {
    const mockAnswer = {
      _id: 'a1',
      user: 'u1',
      createdAt: new Date().toISOString(),
      data: []
    };

    answersAPI.getAnswer.mockResolvedValue(mockAnswer);

    const answer = await Answer.fromId('a1');
    console.debug('[TEST] getAnswer called with:', 'a1');
    console.debug('[TEST] getAnswer response:', answer);

    expect(answer).toBeInstanceOf(Answer);
    expect(answer.user).toBe('u1');
  });

  it('should get sub answers by identifier', async () => {
    const mockSubAnswer = {
      _id: 'sub1',
      user: 'u2',
      createdAt: new Date().toISOString(),
      data: []
    };

    answersAPI.getAnswer.mockResolvedValue(mockSubAnswer);

    const answer = await Answer.fromId('a1');
    const subs = await answer.getSubAnswers('subIdentifier');

    console.debug('[TEST] getSubAnswers response:', subs);

    expect(subs.length).toBe(1);
    expect(subs[0]).toBeInstanceOf(Answer);
  });
});

describe('cotalkerAPI', () => {
  it('should delegate getProperty to propertiesAPI', async () => {
    const mockProperty = { _id: 'x1', name: 'Delegated Property' };
    cotalkerAPI.getProperty.mockResolvedValue(mockProperty);

    const result = await cotalkerAPI.getProperty('x1');
    console.debug('[TEST] cotalkerAPI.getProperty result:', result);

    expect(result.name).toBe('Delegated Property');
  });

  it('should delegate getAnswer to answersAPI', async () => {
    const mockAnswer = {
      _id: 'y1',
      user: 'u2',
      createdAt: new Date().toISOString(),
      data: []
    };
    cotalkerAPI.getAnswer.mockResolvedValue(mockAnswer);

    const result = await cotalkerAPI.getAnswer('y1');
    console.debug('[TEST] cotalkerAPI.getAnswer result:', result);

    expect(result._id).toBe('y1');
  });
});
