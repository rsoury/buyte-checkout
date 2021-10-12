import { hasTabs } from "@/utils/browser-traits";

import Tab from "./TabReceiver";
import Page from "./PageReceiver";

export const TabReceiver = Tab;
export const PageReceiver = Page;

export default hasTabs ? Tab : Page;
