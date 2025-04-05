import COTFileClient from "../../src/libs/models/COTFileClient";
import axios from "axios";
jest.mock("../../src/libs/models/COTFileClient", () => {
	return {
		default: jest.fn().mockImplementation(() => ({
			getFileObjectById: jest.fn(),
			uploadFile: jest.fn(),
			downloadFileByFileId: jest.fn()
		}))
	};
});

describe("File model", () => {
	let file: COTFileClient;
	const mockAxios = axios.create();
	beforeEach(() => {
		jest.clearAllMocks();
		file = new COTFileClient(mockAxios);
	});

	test("Debe subir un archivo y devolver la información del archivo subido", async () => {
		const fileData = Buffer.from("Contenido del archivo");
		const mockUploadedFile = { fileId: "file456" };
		(file.uploadFile as jest.Mock).mockResolvedValue(mockUploadedFile);
		const uploadedFile = await file.uploadFile(fileData);
		expect(uploadedFile).toHaveProperty("fileId");
	});

	test("Debe obtener un archivo por su ID desde la API", async () => {
		const fileId = "file789";
		const mockFileData = { fileId, content: "contenido del archivo" };
		(file.getFileObjectById as jest.Mock).mockResolvedValue(mockFileData);
		const fileData = await file.getFileObjectById(fileId);
		expect(fileData).toHaveProperty("fileId", fileId);
	});

	test("Debe descargar un archivo y devolver un buffer", async () => {
		const fileId = "file101";
		const mockBuffer = Buffer.from("Contenido descargado");
		(file.downloadFileByFileId as jest.Mock).mockResolvedValue(mockBuffer);
		const downloadedBuffer = await file.downloadFileByFileId(fileId);
		expect(downloadedBuffer).toBeInstanceOf(Buffer);
	});
});
