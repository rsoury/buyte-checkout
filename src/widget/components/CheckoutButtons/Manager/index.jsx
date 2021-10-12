import { hasTabs } from "@/utils/browser-traits";

import Tab from "./TabManager";
import Page from "./PageManager";

export const TabManager = Tab;
export const PageManager = Page;

export default hasTabs ? Tab : Page;
