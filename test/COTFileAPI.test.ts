import { COTFileAPI } from "../src/libs/COTFileAPI";
jest.mock("../src/libs/COTFileAPI", () => {
	return {
		COTFileAPI: jest.fn().mockImplementation(() => ({
			getFileById: jest.fn(),
			uploadFile: jest.fn(),
			downloadFile: jest.fn()
		}))
	};
});

describe("File model", () => {
	let file: COTFileAPI;
	beforeEach(() => {
		jest.clearAllMocks();
		file = new COTFileAPI("");
	});

	test("Debe subir un archivo y devolver la información del archivo subido", async () => {
		const fileData = Buffer.from("Contenido del archivo");
		const filename = "archivo_nuevo.txt";
		const mockUploadedFile = { fileId: "file456", name: filename };
		(file.uploadFile as jest.Mock).mockResolvedValue(mockUploadedFile);
		const uploadedFile = await file.uploadFile(fileData, filename);
		expect(uploadedFile).toHaveProperty("fileId");
	});

	test("Debe obtener un archivo por su ID desde la API", async () => {
		const fileId = "file789";
		const mockFileData = { fileId, content: "contenido del archivo" };
		(file.getFileById as jest.Mock).mockResolvedValue(mockFileData);
		const fileData = await file.getFileById(fileId);
		expect(fileData).toHaveProperty("fileId", fileId);
	});

	test("Debe descargar un archivo y devolver un buffer", async () => {
		const fileId = "file101";
		const mockBuffer = Buffer.from("Contenido descargado");
		(file.downloadFile as jest.Mock).mockResolvedValue(mockBuffer);
		const downloadedBuffer = await file.downloadFile(fileId);
		expect(downloadedBuffer).toBeInstanceOf(Buffer);
	});
});
