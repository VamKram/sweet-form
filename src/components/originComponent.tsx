import { TComponentConfig } from "../types/project";
import React from "react";
import { FormItemType } from "../constant";
import { adaptorComponent } from "./wrapper";

const Config: TComponentConfig = {
    [FormItemType.INPUT]: adaptorComponent((props) => <input {...props}/>),
};

export default Config;

