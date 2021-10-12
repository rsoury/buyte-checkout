import axios from "axios";
import axiosRetry from "axios-retry";

import { apiUrl } from "@/utils/env-config";

const request = axios.create({
	baseURL: apiUrl
});
axiosRetry(request, { retries: 2 });

export default request;
