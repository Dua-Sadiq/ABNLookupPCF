import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { AbnComponent } from "./AbnComponent";

// Type for company search result
interface CompanySearchResult {
    Name: string;
    Abn: string;
    Postcode?: string;
    State?: string;
}

export class AbnLookupControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _notifyOutputChanged: () => void;
    private _context: ComponentFramework.Context<IInputs>;
    private _root: Root;

    // State variables
    private companyNameInput = "";
    private abn = "";
    private businessName = "";
    private postCode = "";
    private state = "";
    private acn = "";
    private searchTimeout: NodeJS.Timeout | null = null;
    private searchResults: CompanySearchResult[] = [];
    private dropdownOpen = false;
    private subKey = "";

    

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this._container = container;
        this._notifyOutputChanged = notifyOutputChanged;
        this._context = context;
        this._root = createRoot(container);
        
        // Get the configurable subKey value
        this.subKey = context.parameters.subKey.raw || "";
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._context = context;

        // Load any pre-existing field values
        this.companyNameInput = context.parameters.businessName.raw || "";
        this.abn = context.parameters.abnInput.raw || "";
        this.businessName = context.parameters.businessName.raw || "";
        this.postCode = context.parameters.postCode.raw || "";
        this.state = context.parameters.state.raw || "";
        this.acn = context.parameters.acn.raw || "";

        this.render();
    }

    private onAbnChange = (value: string) => {
        this.companyNameInput = value;
        this._notifyOutputChanged();
        
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        // Debounce the search - wait 500ms after user stops typing
        if (value.trim().length > 2) {
            this.searchTimeout = setTimeout(() => {
                this.performLookup(value);
            }, 500);
        }
        
        this.render();
    };

    private performLookup = async (searchTerm: string) => {
        if (!searchTerm.trim()) return;
        
        console.log("subKey value:", this.subKey);
        console.log("searchTerm:", searchTerm);
        
        if (!this.subKey) {
            console.error("No API key configured. Please set the subKey property.");
            return;
        }
        
        const apiUrl = `https://abr.business.gov.au/json/MatchingNames.aspx?name=${encodeURIComponent(searchTerm)}&maxResults=5&activeOnly=Y&guid=${this.subKey}`;
        console.log("API URL:", apiUrl);
        try {
            const response = await fetch(apiUrl);
            const text = await response.text();
            const jsonpMatch = text.match(/callback\((.*)\)/);
            if (!jsonpMatch) throw new Error("Invalid response format");
            const data = JSON.parse(jsonpMatch[1]);
            if (data.Names && data.Names.length > 0) {
                this.searchResults = data.Names.slice(0, 5);
                this.dropdownOpen = true;
                this.render();
            } else {
                this.searchResults = [];
                this.dropdownOpen = false;
            this.render();
            }
        } catch (error) {
            console.error("Company lookup failed:", error);
            this.searchResults = [];
            this.dropdownOpen = false;
            this.render();
        }
    };

    private onResultSelect = (result: CompanySearchResult) => {
        if (!result || !result.Name) {
            this.dropdownOpen = false;
            this.searchResults = [];
            this.render();
            return;
        }
        this.companyNameInput = result.Name || "";
        this.abn = result.Abn || "";
        this.businessName = result.Name || "";
        this.postCode = result.Postcode || "";
        this.state = result.State || "";
        this.acn = this.abn.length >= 9 ? this.abn.slice(-9) : "";
        this.dropdownOpen = false;
        this.searchResults = [];
        this._notifyOutputChanged();
        this.render();
    };

    private render() {
        this._root.render(
            React.createElement(AbnComponent, {
                abnInput: this.companyNameInput,
                onAbnChange: this.onAbnChange,
                businessName: this.businessName,
                postCode: this.postCode,
                state: this.state,
                acn: this.acn,
                abn: this.abn,
                searchResults: this.searchResults,
                dropdownOpen: this.dropdownOpen,
                onResultSelect: this.onResultSelect
            })
        );
    }

    public getOutputs(): IOutputs {
        return {
            lookupHost: this.businessName,        // ABN Lookup field will show business name
            abnInput: this.abn,                   // ABN field will show ABN number
            businessName: this.businessName,      // Name field will show business name
            postCode: this.postCode,
            state: this.state,
            acn: this.acn
        };
    }

    public destroy(): void {
        this._root.unmount();
    }

    
}
