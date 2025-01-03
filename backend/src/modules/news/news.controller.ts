import axios, { AxiosInstance } from "axios";
import { NewsClassifySchemaType } from "./newsSchema";

class NewsController {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.FLASK_ENDPOINT + ":" + process.env.FLASK_PORT,
      timeout: parseInt(process.env.FLASK_TIMEOUT),
    });
  }

  async classify(payload: NewsClassifySchemaType) {
    const { news, type } = payload;
    if (!news) {
      throw new Error("News is required");
    }
    try {
      let response;
      if (type && type === "Probability") {
        response = await this.axiosInstance.post("/classify-probability", {
          news,
        });
      } else {
        response = await this.axiosInstance.post("/classify", { news });
      }
      return response.data;
    } catch (error) {
      console.error(
        "Error in classify method:",
        error.response?.data || error.message
      );

      // Handle and rethrow the error with proper details
      if (error.response && error.response.status === 500) {
        throw new Error(`Server Error: ${error.response.data}`);
      }
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}
export const newsController = new NewsController();
