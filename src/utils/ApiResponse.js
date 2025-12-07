class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
    }
}

export {ApiResponse};