/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    subKey: ComponentFramework.PropertyTypes.StringProperty;
    lookupHost: ComponentFramework.PropertyTypes.StringProperty;
    abnInput: ComponentFramework.PropertyTypes.StringProperty;
    businessName: ComponentFramework.PropertyTypes.StringProperty;
    postCode: ComponentFramework.PropertyTypes.StringProperty;
    state: ComponentFramework.PropertyTypes.StringProperty;
    acn: ComponentFramework.PropertyTypes.StringProperty;
}
export interface IOutputs {
    lookupHost?: string;
    abnInput?: string;
    businessName?: string;
    postCode?: string;
    state?: string;
    acn?: string;
}
