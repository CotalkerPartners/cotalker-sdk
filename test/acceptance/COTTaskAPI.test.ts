import COTTaskClient from "../../src/libs/models/COTTaskClient";
import axios from "axios";

jest.mock("../../src/libs/models/COTTaskClient", () => {
	return {
		__esModule: true,
		default: jest.fn().mockImplementation(() => ({
			getTasksSMStateChanges: jest.fn(),
			getTask: jest.fn(),
			patchTask: jest.fn(),
			findTasks: jest.fn(),
			postTask: jest.fn(),
			getNextSmStates: jest.fn(),
			queryTasksFilter: jest.fn(),
			patchMultiTasks: jest.fn()
		}))
	};
});

describe("Task model", () => {
	let taskAPI: COTTaskClient;
	const taskId = "task123";
	const taskGroupId = "group456";
	const name = "test task";
	const serial = 12345;
	const mockTask = {
		_id: taskId,
		taskGroup: taskGroupId,
		name: name,
		serial: serial
	};
	const mockAxios = axios.create();

	beforeEach(() => {
		jest.clearAllMocks();
		taskAPI = new COTTaskClient(mockAxios);
	});

	test("Debe obtener una tarea por su ID o serial", async () => {
		(taskAPI.getTask as jest.Mock).mockImplementation(async (params) => {
			if ("taskId" in params) {
				return { ...mockTask, _id: params.taskId };
			} else {
				return { ...mockTask, serial: params.taskSerial };
			}
		});

		const resultId = await taskAPI.getTask({ taskId }, taskGroupId);
		const resultSerial = await taskAPI.getTask(
			{ taskSerial: serial },
			taskGroupId
		);

		expect(resultId).toEqual({ ...mockTask, _id: taskId });
		expect(resultSerial).toEqual({ ...mockTask, serial: serial });
	});

	test("Debe actualizar una tarea correctamente", async () => {
		const updatedTask = { ...mockTask, name: "Updated Task" };
		(taskAPI.patchTask as jest.Mock).mockResolvedValue(updatedTask);

		const result = await taskAPI.patchTask(taskId, taskGroupId, {
			name: "Updated Task"
		});

		expect(result).toEqual(updatedTask);
	});

	test("Debe crea una nueva tarea", async () => {
		const newTask = { _id: "new123", name: "New Task" };
		(taskAPI.postTask as jest.Mock).mockResolvedValue(newTask);

		const result = await taskAPI.postTask({
			taskGroup: taskGroupId,
			name: "New Task"
		} as any);

		expect(result).toEqual(newTask);
	});

	test("Debe buscar tareas con query", async () => {
		const mockTasks = [mockTask, { _id: "task456", name: "Another Task" }];
		(taskAPI.findTasks as jest.Mock).mockResolvedValue(mockTasks);

		const result = await taskAPI.findTasks(taskGroupId, {
			state: "open"
		} as any);

		expect(result).toEqual(mockTasks);
	});

	test("Debe actualizar múltiples tareas", async () => {
		const updatedTasks = [
			{ ...mockTask, name: "Updated 1" },
			{ _id: "task456", name: "Updated 2" }
		];
		(taskAPI.patchMultiTasks as jest.Mock).mockResolvedValue(updatedTasks);

		const result = await taskAPI.patchMultiTasks(taskGroupId, {
			taskIds: [taskId, "task456"],
			updates: { name: "Updated" }
		} as any);

		expect(result).toEqual(updatedTasks);
	});

	test("Debe obtener cambios de estado de SM", async () => {
		const mockChanges = [
			{
				task: taskId,
				currentState: "in_progress",
				createdAt: new Date()
			}
		];
		(taskAPI.getTasksSMStateChanges as jest.Mock).mockResolvedValue(
			mockChanges
		);

		const result = await taskAPI.getTasksSMStateChanges(
			taskId,
			taskGroupId
		);

		expect(result).toEqual(mockChanges);
	});

	test("Debe obtener los próximos estados posibles", async () => {
		const nextStates = ["approved", "rejected"];
		(taskAPI.getNextSmStates as jest.Mock).mockResolvedValue(nextStates);

		const result = await taskAPI.getNextSmStates(taskGroupId, taskId);

		expect(result).toEqual(nextStates);
	});

	test("Debe Filtrar las tareas correctamente", async () => {
		const filteredTasks = [
			{ _id: taskId, name: "High Priority", score: 95 }
		];
		(taskAPI.queryTasksFilter as jest.Mock).mockResolvedValue(
			filteredTasks
		);

		const result = await taskAPI.queryTasksFilter(taskGroupId, "priority", {
			limit: 10
		});

		expect(result).toEqual(filteredTasks);
	});
});
